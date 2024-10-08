import React, { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { createPost } from "../services/api";

interface PostFormData {
    content: string;
    scheduledDate: string;
    scheduledTime: string;
    location: string;
}

const PostForm: React.FC = () => {
    const [formData, setFormData] = useState<PostFormData>({
        content: "",
        scheduledDate: "",
        scheduledTime: "",
        location: "",
    });
    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.scheduledDate || !formData.scheduledTime) {
            setError("Please enter a valid date and time.");
            setSuccessMessage("");
            return;
        }

        setError("");

        const scheduledTime = `${formData.scheduledDate}T${formData.scheduledTime}`;
        try {
            await createPost({ ...formData, scheduledTime });

            setSuccessMessage("Post scheduled successfully!");
            setFormData({
                content: "",
                scheduledDate: "",
                scheduledTime: "",
                location: "",
            });
        } catch (error) {
            console.error("Error scheduling post:", error);
            setError("Failed to schedule post.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
                    Schedule a Post
                </h2>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Post Content
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Write your post..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        rows={4}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Schedule Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="date"
                                name="scheduledDate"
                                value={formData.scheduledDate}
                                onChange={handleInputChange}
                                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Schedule Time
                        </label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="time"
                                name="scheduledTime"
                                value={formData.scheduledTime}
                                onChange={handleInputChange}
                                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Address:
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter address or location"
                        className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                </div>

                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                {successMessage && (
                    <p className="text-green-500 text-sm mt-1">
                        {successMessage}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 transform hover:scale-105"
                >
                    Schedule Post
                </button>
            </form>
        </div>
    );
};

export default PostForm;
