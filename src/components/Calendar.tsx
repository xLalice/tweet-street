import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchScheduledPosts, updatePost } from "../services/api";
import Modal from "./Modal";

// Localize the calendar to use moment.js for date formatting
const localizer = momentLocalizer(moment);

// Define the structure of a Post
interface Post {
    id: number;
    content: string;
    platform: string;
    scheduledTime: string;
    status: string;
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
}

// Extend the Event interface to include additional properties
interface ColoredEvent extends Event {
    id?: number;
    color?: string;
    status?: string;
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
}

const CalendarView: React.FC = () => {
    const [events, setEvents] = useState<ColoredEvent[]>([]); // State to store events for the calendar
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [selectedEvent, setSelectedEvent] = useState<ColoredEvent | null>(
        null // State to store the currently selected event
    );

    // Fetch scheduled posts and set them as calendar events
    useEffect(() => {
        const loadPosts = async () => {
            try {
                const posts = await fetchScheduledPosts(); // Fetch posts from the API

                // Map posts to the structure required by the calendar
                const events = posts.map((post: Post) => ({
                    id: post.id,
                    title: post.content,
                    start: new Date(post.scheduledTime), // Set start time
                    end: new Date(post.scheduledTime), // Set end time
                    allDay: false, // Events are not all-day
                    color: getEventColor(post.status), // Determine color based on status
                    status: post.status,
                    latitude: post.latitude,
                    longitude: post.longitude,
                    imageUrl: post.imageUrl
                }));
                setEvents(events); // Update events state
                console.log("Events: ", events);
            } catch (error) {
                console.error("Error fetching posts:", error); // Log error if fetching fails
            }
        };

        loadPosts(); // Call function to load posts
    }, []); // Empty dependency array to run only once on mount

    // Function to determine event color based on status
    const getEventColor = (status: string) => {
        switch (status) {
            case "SCHEDULED":
                return "bg-blue-500"; // Color for scheduled posts
            case "POSTED":
                return "bg-green-500"; // Color for posted posts
            case "FAILED":
                return "bg-red-500"; // Color for failed posts
            default:
                return "bg-gray-500"; // Default color for unknown status
        }
    };

    // Style events based on their properties
    const eventStyleGetter = (event: ColoredEvent) => {
        const backgroundColor = event.color || "bg-gray-200"; // Use event color or default
        return {
            className: `${backgroundColor} text-white p-2 rounded-md shadow-md`, // Set class name for styling
        };
    };

    // Handle event click to open the modal for editing
    const handleEventClick = (event: ColoredEvent) => {
        setSelectedEvent(event); // Set the selected event
        setIsModalOpen(true); // Open the modal
    };

    // Close the modal and reset the selected event
    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
        setSelectedEvent(null); // Clear selected event
    };

    // Save updated event details after editing in the modal
    const handleEventSave = async (updatedContent: string, updatedTime: string) => {
        if (selectedEvent) {
            await updatePost(selectedEvent.id!, {
                content: updatedContent,
                scheduledTime: updatedTime,
            });

            // Update events state with the modified event
            const updatedEvents = events.map((event) =>
                event.id === selectedEvent.id
                    ? {
                          ...event,
                          title: updatedContent, // Update title
                          end: new Date(updatedTime), // Update end time
                          color: event.color, // Maintain color
                      }
                    : event
            );

            setEvents(updatedEvents); // Set the updated events
            closeModal(); // Close the modal
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4 text-center">
                Posts Calendar
            </h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
                <Calendar
                    localizer={localizer} // Use moment localizer
                    events={events} // Pass events to the calendar
                    startAccessor="start" // Specify start time accessor
                    endAccessor="end" // Specify end time accessor
                    eventPropGetter={eventStyleGetter} // Apply styles to events
                    style={{ height: "600px" }} // Set calendar height
                    className="bg-gray-50 text-sm" // Set calendar styles
                    onSelectEvent={handleEventClick} // Handle event selection
                />
            </div>

            {/* Modal for event details */}
            {selectedEvent && (
                <Modal
                    isOpen={isModalOpen} // Pass modal open state
                    onClose={closeModal} // Pass close handler
                    eventTitle={
                        typeof selectedEvent.title === "string"
                            ? selectedEvent.title // Pass event title
                            : ""
                    }
                    eventStatus={selectedEvent.status} // Pass event status
                    scheduledTime={selectedEvent.end} // Pass scheduled time
                    onSave={handleEventSave} // Pass save handler
                    latitude={selectedEvent.latitude} // Pass latitude
                    longitude={selectedEvent.longitude} // Pass longitude
                    imageUrl={selectedEvent.imageUrl} // Pass image URL to modal
                />
            )}
        </div>
    );
};

export default CalendarView; 
