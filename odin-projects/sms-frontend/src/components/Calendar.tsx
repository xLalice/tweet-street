import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchScheduledPosts, updatePost } from "../services/api";
import Modal from "./Modal";

const localizer = momentLocalizer(moment);

interface Post {
    id: number;
    content: string;
    platform: string;
    scheduledTime: string;
    status: string;
    latitude?: number;
    longitude?: number;
}

interface ColoredEvent extends Event {
    id?: number;
    color?: string;
    status?: string;
    latitude?: number;
    longitude?: number
}

const CalendarView: React.FC = () => {
    const [events, setEvents] = useState<ColoredEvent[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<ColoredEvent | null>(
        null
    );

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const posts = await fetchScheduledPosts();

                const events = posts.map((post: Post) => ({
                    id: post.id,
                    title: post.content,
                    start: new Date(post.scheduledTime),
                    end: new Date(post.scheduledTime),
                    allDay: false,
                    color: getEventColor(post.status),
                    status: post.status,
                    latitude: post.latitude,
                    longitude: post.longitude
                }));
                setEvents(events);
                console.log("Events: ", events);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        loadPosts();
    }, []);

    const getEventColor = (status: string) => {
        switch (status) {
            case "SCHEDULED":
                return "bg-blue-500";
            case "POSTED":
                return "bg-green-500";
            case "FAILED":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const eventStyleGetter = (event: ColoredEvent) => {
        const backgroundColor = event.color || "bg-gray-200";
        return {
            className: `${backgroundColor} text-white p-2 rounded-md shadow-md`,
        };
    };

    const handleEventClick = (event: ColoredEvent) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleEventSave = async (updatedContent: string, updatedTime: string) => {
      if (selectedEvent) {
          await updatePost(selectedEvent.id!, {
              content: updatedContent,
              scheduledTime: updatedTime, 
          });
  
          const updatedEvents = events.map((event) =>
              event.id === selectedEvent.id
                  ? {
                        ...event,
                        title: updatedContent,
                        end: new Date(updatedTime),
                        color: event.color,
                    }
                  : event
          );
  
          setEvents(updatedEvents);
          closeModal();
      }
  };
  
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4 text-center">
                Posts Calendar
            </h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    eventPropGetter={eventStyleGetter}
                    style={{ height: "600px" }}
                    className="bg-gray-50 text-sm"
                    onSelectEvent={handleEventClick}
                />
            </div>

            {/* Modal for event details */}
            {selectedEvent && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    eventTitle={
                        typeof selectedEvent.title === "string"
                            ? selectedEvent.title
                            : ""
                    }
                    eventStatus={selectedEvent.status}
                    scheduledTime={selectedEvent.end}
                    onSave={handleEventSave}
                    latitude={selectedEvent.latitude}
                    longitude={selectedEvent.longitude}
                />
            )}
        </div>
    );
};

export default CalendarView;
