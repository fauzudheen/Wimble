import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import createAxiosInstance from '../../../api/axiosInstance';
import { GatewayUrl } from '../../const/urls';
import { format } from 'date-fns';
import { Send, Paperclip, X } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';

const TeamChat = () => {
    const { id: teamId } = useOutletContext();
    const userId = useSelector(state => state.auth.userId);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [file, setFile] = useState(null);
    const token = useSelector(state => state.auth.userAccess);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const messageListRef = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const socketUrl = `ws://localhost:8005/ws/chat/team/${teamId}/`;

    const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log('WebSocket connected'),
        onClose: () => console.log('WebSocket disconnected'),
        shouldReconnect: (closeEvent) => true,
    });

    const fetchMessages = async (pageNum) => {
        setIsLoading(true);
        try {
            const axiosInstance = createAxiosInstance(token);
            const response = await axiosInstance.get(`${GatewayUrl}api/chat/team/${teamId}/messages/?page=${pageNum}`);
            const newMessages = response.data.results;
            setMessages(prevMessages => [...prevMessages, ...newMessages]);
            setHasMore(!!response.data.next);
            setError(null);
        } catch (error) {
            console.error(error);
            setError('Failed to load messages. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages(1);
    }, [teamId, token]);

    useEffect(() => {
        if (lastMessage !== null) {
            try {
                const data = JSON.parse(lastMessage.data);
                if (data && (data.message || data.file_name)) {
                    setMessages((prevMessages) => [{
                        content: data.message,
                        sender: { id: data.user_id },
                        file: data.file_name,
                        file_type: data.file_type,
                        created_at: new Date().toISOString(),
                    }, ...prevMessages]);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        }
    }, [lastMessage]);

    const loadMoreMessages = () => {
        if (hasMore) {
            fetchMessages(page + 1);
            setPage(prevPage => prevPage + 1);
        }
    };

    const handleSendMessage = useCallback(async () => {
        const trimmedMessage = message.trim();
        if (trimmedMessage || file) {
            const messageData = {
                message: trimmedMessage,
                user_id: userId,
            };
            
            if (file) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const axiosInstance = createAxiosInstance(token);
                    const response = await axiosInstance.post(`${GatewayUrl}api/upload-file/`, formData);
                    messageData.file_name = response.data.file_url;
                    messageData.file_type = file.type;
                } catch (error) {
                    console.error('File upload failed:', error);
                    setError('File upload failed. Please try again.');
                    return;
                }
            }

            sendMessage(JSON.stringify(messageData));
            setMessage('');
            setFile(null);
        } else {
            setError('Cannot send an empty message. Please enter some text or attach a file.');
        }
    }, [message, file, userId, sendMessage, token]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                setError('File size exceeds 5MB limit.');
            } else {
                setFile(selectedFile);
                setError(null);
            }
        }
    };

    const removeFile = () => {
        setFile(null);
    };

    const MessageBubble = ({ msg, isSent }) => (
        <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`flex ${isSent ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                {msg.sender?.profile ? (
                    <img src={`${GatewayUrl}api/user_service/media/${msg.sender.profile.split('/media/media/')[1]}`} alt={`${msg.sender.first_name} ${msg.sender.last_name}`} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                )}
                <div className={`max-w-xs mx-2 p-3 rounded-lg ${isSent ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'}`}>
                    {msg.content && <p className="text-sm">{msg.content}</p>}
                    {msg.file && (
                        <div className="mt-2">
                            {msg.file_type && msg.file_type.startsWith('image/') ? (
                                <img src={msg.file} alt="Uploaded" className="max-w-full h-auto rounded" />
                            ) : (
                                <a href={msg.file} target="_blank" rel="noopener noreferrer" className="text-xs underline">
                                    Attached File
                                </a>
                            )}
                        </div>
                    )}
                    <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">{format(new Date(msg.created_at), 'HH:mm')}</p>
                </div>
            </div>
        </div>
    );

    if (isLoading && messages.length === 0) return <div className="flex justify-center items-center h-full text-gray-900 dark:text-gray-100">Loading...</div>;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="flex-1 p-4 overflow-y-auto" ref={messageListRef} id="scrollableDiv">
                <InfiniteScroll
                    dataLength={messages.length}
                    next={loadMoreMessages}
                    hasMore={hasMore}
                    loader={<h4 className="text-center text-gray-500 dark:text-gray-400">Loading...</h4>}
                    scrollableTarget="scrollableDiv"
                    style={{ display: 'flex', flexDirection: 'column-reverse' }}
                >
                    {messages.map((msg, index) => (
                        <MessageBubble key={index} msg={msg} isSent={msg.sender?.id === userId} />
                    ))}
                </InfiniteScroll>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {error && <div className="text-red-500 mb-2">{error}</div>}
                {file && (
                    <div className="flex items-center mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span className="text-sm truncate flex-1 text-gray-900 dark:text-gray-100">{file.name}</span>
                        <button onClick={removeFile} className="ml-2 text-red-500">
                            <X size={16} />
                        </button>
                    </div>
                )}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    />
                    <label className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <Paperclip size={20} className="text-gray-500 dark:text-gray-400" />
                    </label>
                    <button 
                        onClick={handleSendMessage}
                        className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamChat;
