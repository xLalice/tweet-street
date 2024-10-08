import React, { useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventTitle?: string; 
    eventStatus?: string; 
    eventPlatform?: string; 
    scheduledTime?: Date;
    latitude?: number;  
    longitude?: number;
    onSave?: (updatedContent: string, updatedTime: string) => void;
}

const Modal: React.FC<ModalProps> = ({ 
    isOpen, 
    onClose, 
    
    eventTitle = "No Title", 
    eventStatus = "Unknown", 
    scheduledTime,
    latitude,
    longitude,
    onSave
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(eventTitle);
    const [scheduledTimeValue, setScheduledTimeValue] = useState(scheduledTime ? scheduledTime.toISOString().slice(0, 16) : ''); // Format for input

    if (!isOpen) return null;

    const handleSave = () => {
        if (onSave) {
            onSave(content, scheduledTimeValue);
        }
        setIsEditing(false); // Reset editing mode after saving
    };

    const googleMapsUrl = latitude && longitude
        ? `https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&center=${latitude},${longitude}&zoom=14`
        : '';

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-1/3 transition-transform transform duration-300 scale-100 hover:scale-105">
                {isEditing ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-2 text-blue-600">Edit Post</h2>
                        <label className="block mb-2">
                            Content:
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full border rounded-md p-2"
                                rows={3}
                            />
                        </label>
                        <label className="block mb-2">
                            Scheduled Time:
                            <input
                                type="datetime-local"
                                value={scheduledTimeValue}
                                onChange={(e) => setScheduledTimeValue(e.target.value)}
                                className="w-full border rounded-md p-2"
                            />
                        </label>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mb-2 text-blue-600">{eventTitle}</h2>
                        <p className="text-gray-700"><strong>Status:</strong> {eventStatus}</p>
                        {scheduledTime && (
                            <p className="text-gray-700"><strong>Scheduled Time:</strong> {new Date(scheduledTime).toLocaleString()}</p> // Format the scheduled time
                        )}
                        {latitude && longitude ? (
                            <div className="my-4">
                                <h3 className="text-lg font-bold mb-2">Location</h3>
                                <iframe
                                    title="Google Maps Location"
                                    width="100%"
                                    height="300"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={googleMapsUrl}
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <p className="text-gray-500">Location not available.</p>
                        )}
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={handleSave} 
                                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-200 mr-2"
                            >
                                Save
                            </button>
                            <button 
                                onClick={() => setIsEditing(false)} 
                                className="bg-gray-300 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition duration-200"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                        >
                            Edit
                        </button>
                    )}
                    <button 
                        onClick={onClose} 
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-200 ml-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
