import React from 'react';

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="relative bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg shadow-xl max-w-[95vw] max-h-[95vh] w-auto h-auto overflow-hidden">
                <div className="absolute top-2 right-2 z-10">
                    <button 
                        onClick={onClose}
                        className="text-white hover:text-teal-200 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-0.5">
                    <img 
                        src={imageUrl} 
                        alt="Large view" 
                        className="max-w-full max-h-[90vh] object-contain rounded-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageModal;