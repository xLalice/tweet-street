import React, { useState } from "react";
import { Calendar, Clock } from "lucide-react"; // Import icons for the calendar and clock
import { createPost } from "../services/api"; // Import the API service for creating posts
import axios from "axios"; // For making API calls to Unsplash

// Define the shape of the post form data
interface PostFormData {
    content: string;
    scheduledDate: string;
    scheduledTime: string;
    location: string;
    imageUrl: string; // Add image URL to form data
}

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; // Add your Unsplash Access Key here

const PostForm: React.FC = () => {
    // State to manage form data, error messages, success messages, and Unsplash search results
    const [formData, setFormData] = useState<PostFormData>({
        content: "",
        scheduledDate: "",
        scheduledTime: "",
        location: "",
        imageUrl: "", // Initialize with an empty string
    });
    const [error, setError] = useState<string>(""); // State for error messages
    const [successMessage, setSuccessMessage] = useState<string>(""); // State for success messages
    const [unsplashResults, setUnsplashResults] = useState<string[]>([]); // State for Unsplash search results
    const [searchTerm, setSearchTerm] = useState<string>(""); // State for Unsplash search term

    // Handle input changes and update the form data state
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value, // Update the respective field
        });
    };

    // Handle Unsplash image search
    const handleImageSearch = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        if (!searchTerm) {
            setError("Please enter a search term for images.");
            return;
        }
        try {
            const response = await axios.get(
                `https://api.unsplash.com/search/photos?query=${searchTerm}&client_id=${UNSPLASH_ACCESS_KEY}`
            );
            const images = response.data.results.map(
                (img: any) => img.urls.small
            ); // Get image URLs (small size for preview)
            setUnsplashResults(images); // Update Unsplash results
            setError(""); // Clear error if successful
        } catch (error) {
            console.error("Error fetching images from Unsplash:", error);
            setError("Failed to fetch images from Unsplash.");
        }
    };

    // Handle image selection
    const handleImageSelect = (url: string) => {
        setFormData({ ...formData, imageUrl: url }); // Update the form data with selected image URL
        setSuccessMessage("Image selected!"); // Set success message for image selection
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Validate that all fields are filled
        if (
            !formData.content ||
            !formData.scheduledDate ||
            !formData.scheduledTime ||
            !formData.location 
        ) {
            setError("All fields are required"); // Set error if any field is empty
            setSuccessMessage(""); // Clear success message
            return;
        }

        setError(""); // Clear error messages

        // Combine date and time into a single string in ISO format
        const scheduledTime = `${formData.scheduledDate}T${formData.scheduledTime}`;
        try {
            // Attempt to create the post with the provided data
            await createPost({ ...formData, scheduledTime });

            setSuccessMessage("Post scheduled successfully!"); // Set success message
            // Reset form fields after successful submission
            setFormData({
                content: "",
                scheduledDate: "",
                scheduledTime: "",
                location: "",
                imageUrl: "",
            });
            setUnsplashResults([]); // Clear Unsplash results
            setSearchTerm(""); // Clear search term
        } catch (error) {
            console.error("Error scheduling post:", error); // Log any errors encountered
            setError("Failed to schedule post."); // Set error message for failed submission
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit} // Attach submit handler
                className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
                    Schedule a Post
                </h2>

                {/* Post Content Field */}
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

                {/* Date and Time Fields */}
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

                {/* Location Field */}
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

                {/* Unsplash Image Search */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Search for an Image:
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search images..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                        <button
                            onClick={handleImageSearch}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Display Unsplash results */}
                {unsplashResults.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {unsplashResults.map((imgUrl) => (
                            <img
                                key={imgUrl}
                                src={imgUrl}
                                alt="Unsplash result"
                                className={`cursor-pointer w-full h-auto rounded-lg border ${
                                    formData.imageUrl === imgUrl
                                        ? "border-indigo-600"
                                        : "border-transparent"
                                }`}
                                onClick={() => handleImageSelect(imgUrl)}
                            />
                        ))}
                    </div>
                )}

                {/* Display error or success messages */}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {successMessage && (
                    <p className="text-green-500 text-sm mt-2">
                        {successMessage}
                    </p>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Schedule Post
                </button>
            </form>
        </div>
    );
};

export default PostForm;
