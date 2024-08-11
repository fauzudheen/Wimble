import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useOutletContext } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import createAxiosInstance from '../../../api/axiosInstance';
import { GatewayUrl } from '../../const/urls';
import { format } from 'date-fns';
import { Send, Paperclip, X, AudioLinesIcon, File, FileTextIcon, PlayIcon } from 'lucide-react';
import ImageModal from './ImageModal';

const TeamChat = () => {
    const { id: teamId } = useOutletContext();
    const userId = useSelector(state => state.auth.userId);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [file, setFile] = useState(null);
    const token = useSelector(state => state.auth.userAccess);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const messageListRef = useRef(null);
    const [showJoinDialog, setShowJoinDialog] = useState(false);

    const socketUrl = `ws://localhost:8005/ws/chat/team/${teamId}/?token=${token}`;

    const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log('WebSocket connected'),
        onClose: () => console.log('WebSocket disconnected'),
        shouldReconnect: (closeEvent) => true,
    });

    useEffect(() => {
        if (page === 1 && messageListRef.current) {
            messageListRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
        }
    }, [page, messages]);

    const fetchTeam = async () => {
        try {
          const axiosInstance = createAxiosInstance(token);
          const response = await axiosInstance.get(`${GatewayUrl}api/teams/${teamId}/`);
          console.log('team data', response.data);
          if(response.data.request_status && response.data.request_status === 'accepted') {
            fetchMessages();
          } else {
            setShowJoinDialog(true);
          }
        } catch (error) {
          console.error('Error fetching team data:', error);
        }
      };
    
      useEffect(() => {
        fetchTeam();
      }, [teamId, token]);

    
    const fetchMessages = async (pageNum) => {
        setIsLoading(true);
        try {
            const axiosInstance = createAxiosInstance(token);
            const response = await axiosInstance.get(`${GatewayUrl}api/chat/team/${teamId}/messages/?page=${pageNum}`);
            const newMessages = response.data.results;
            setMessages(prevMessages => [...prevMessages, ...newMessages]);
            console.log("new messages", newMessages);
            setHasMore(!!response.data.next);
            setError(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages(page);
    }, [page, teamId, token]);

    useEffect(() => {
        if (lastMessage !== null) {
            try {
                const data = JSON.parse(lastMessage.data);
                if (data && (data.message || data.file_name)) {
                    setMessages((prevMessages) => [{
                        content: data.message,
                        sender: {
                            id: data.user_id,
                            profile: data.user_profile,
                            first_name: data.user_first_name,
                            last_name: data.user_last_name
                        },
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
                    const response = await axiosInstance.post(`${GatewayUrl}api/chat/upload-file/`, formData);
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
            if (selectedFile.size > 5 * 1024 * 1024) {
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');

    const openImageModal = useCallback((url) => {
        setSelectedImageUrl(url);
        setIsModalOpen(true);
    }, []);

    const closeImageModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedImageUrl('');
    }, []);

    const MessageBubble = memo(({ msg, isSent }) => {
        const formatFileUrl = (url) => url.replace('host.docker.internal', 'localhost');
    
        return (
            <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-1`}>
                <div className={`flex ${isSent ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                    {/* Profile Picture */}
                    {!isSent && msg.sender?.profile && (
                        <img 
                            src={`${GatewayUrl}api/user_service/media/${msg.sender.profile.split('/media/media/')[1]}`} 
                            alt={`${msg.sender.first_name} ${msg.sender.last_name}`} 
                            className="w-8 h-8 rounded-full object-cover mr-2" 
                        />
                    )}
    
                    {/* Message Content */}
                    <div className={`max-w-xs p-2 rounded-lg shadow ${isSent ? 'bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-800 dark:to-blue-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        {msg.file && (
                            <>
                                {/* Image Handling */}
                                {msg.file_type.startsWith('image/') && (
                                    <img 
                                        src={formatFileUrl(msg.file)} 
                                        alt="Uploaded Image" 
                                        className="w-full rounded-md mb-2 cursor-pointer"
                                        onClick={() => openImageModal(formatFileUrl(msg.file))}
                                    />
                                )}
    
                                {/* Video Handling */}
                                {msg.file_type.startsWith('video/') && (
                                    <video controls className="w-full rounded-md mb-2">
                                        <source src={formatFileUrl(msg.file)} type={msg.file_type} />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
    
                                {/* Audio Handling */}
                                {msg.file_type === 'audio/mpeg' && (
                                    <div className="flex items-center mb-2">
                                        <audio
                                            src={formatFileUrl(msg.file)}
                                            className="hidden"
                                            ref={(audio) => {
                                                if (audio) {
                                                    audio.oncanplaythrough = () => {
                                                        // You can keep this line to handle any logic when ready
                                                    };
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={(e) => {
                                                const audio = e.currentTarget.previousElementSibling;
                                                if (audio.paused) {
                                                    audio.play();
                                                } else {
                                                    audio.pause();
                                                }
                                            }}
                                            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-300"
                                        >
                                            <PlayIcon className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">Audio Message</span>
                                    </div>
                                )}
    
                                {/* Text File Handling */}
                                {msg.file_type === 'text/plain' && (
                                    <div className="p-2 bg-white dark:bg-gray-600 rounded-md mb-2 border border-gray-300 dark:border-gray-500">
                                        <FileTextIcon className="text-gray-600 dark:text-gray-300 mr-2 inline" size={14} />
                                        <a 
                                            href={formatFileUrl(msg.file)} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-sm underline text-blue-500 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            Download Text File
                                        </a>
                                    </div>
                                )}
    
                                {/* Generic File Download */}
                                {!msg.file_type.startsWith('image/') && 
                                 !msg.file_type.startsWith('video/') && 
                                 msg.file_type !== 'audio/mpeg' &&
                                 msg.file_type !== 'text/plain' && (
                                    <a 
                                        href={formatFileUrl(msg.file)} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-xs underline text-blue-500 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        Download File
                                    </a>
                                )}
                            </>
                        )}
                        <div className="flex justify-between gap-1">
                        {/* Content Container */}
                        <div className="flex items-center flex-1">
                            {msg.content !== '' && (
                                <p className="text-sm text-gray-900 dark:text-gray-100">{msg.content}</p>
                            )}
                        </div>

                        {/* Timestamp Container */}
                        <div className="flex items-end">
                            <p className="text-[11px] text-gray-600 leading-none dark:text-gray-400">
                                {format(new Date(msg.created_at), 'hh:mm a')}
                            </p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        );
    });

    const renderedMessages = useMemo(() => (
        [...messages].reverse().map((msg, index) => (
            <MessageBubble key={msg.id || index} msg={msg} isSent={msg.sender?.id === userId} />
        ))
    ), [messages, userId]);
    
    
    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            {showJoinDialog && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-w-sm w-full mx-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Unauthorized</h2>
                    <p className="text-sm text-gray-800 dark:text-gray-300 mt-3">
                    You are not a member of this team and cannot access this resource. Please contact your team administrator to be added as a member.
                    </p>
                    <div className="flex justify-end mt-3">
                    <Link to={`/teams/${teamId}/overview`}>
                        <button className="rounded-md px-3 py-2 text-sm font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600">
                        Go Back to Overview
                        </button>
                    </Link>
                    </div>
                </div>
                </div>
            )}
            <div className="flex-1 p-4 overflow-y-auto" ref={messageListRef}>
                {hasMore && (
                    <button 
                        onClick={() => setPage(prevPage => prevPage + 1)} 
                        className="mb-4 mx-auto text-blue-500 dark:text-blue-300 hover:underline"
                    >
                        Load More Messages
                    </button>
                )}
                {renderedMessages}
            </div>
            <ImageModal 
                isOpen={isModalOpen} 
                imageUrl={selectedImageUrl} 
                onClose={closeImageModal} 
            />
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {error && <div className="text-red-500 mb-2">{error}</div>}
                {file && (
                    <div className="flex items-center mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span className="text-sm truncate flex-1 text-gray-900 dark:text-gray-100">{file.name}</span>
                        <button onClick={removeFile} className="ml-2 text-red-500 hover:text-red-600 transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                )}
                <div className="flex items-stretch">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1 p-2 border rounded-l-lg focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 h-10"
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    />
                    <label className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors border-t border-b border-gray-300 dark:border-gray-600">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <Paperclip size={20} className="text-gray-500 dark:text-gray-400" />
                    </label>
                    <button 
                        onClick={handleSendMessage}
                        className="w-10 h-10 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-r-lg hover:from-teal-500 hover:to-blue-600 focus:outline-none transition-colors flex items-center justify-center"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamChat;
