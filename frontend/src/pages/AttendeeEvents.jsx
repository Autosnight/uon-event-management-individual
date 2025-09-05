import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import openImageViewer from "../components/ImageViewer";

export default function AttendeeEvents() {
  const [events, setEvents] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/auth/user/registrations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching registered events:", err));
  }, []);

  const handleViewImages = (imgs) => {
    if (!imgs || imgs.length === 0) {
      alert("No images uploaded for this event.");
      return;
    }
    openImageViewer({ images: imgs, startIndex: 0 });
  };

  const getMyTicketType = (event) => {
    if (!Array.isArray(event?.tickets)) return null;
    const t = event.tickets.find(
      (ticket) =>
        Array.isArray(ticket.attendees) && ticket.attendees.includes(username)
    );
    return t?.type ?? null;
  };

  return (
    // <div>
    //   {events.length === 0 ? (
    //     <p>You haven't registered for any events yet.</p>
    //   ) : (
    //     events.map((event) => (
    //       <div key={event._id} className="event-list">
    //         <div className="event-card">
    //           <h3>{event.eventTitle || event.name}</h3>
    //           <p>
    //             <strong>➤Date:</strong>{" "}
    //             {new Date(event.date).toLocaleDateString()}
    //           </p>
    //           <p>
    //             <strong>➤Time:</strong> {event.time}
    //           </p>
    //           <p>
    //             <strong>➤Place:</strong> {event.venue}
    //           </p>
    //           <p>
    //             <strong>➤Ticket type:</strong>{" "}
    //             {
    //               event.tickets.find((ticket) =>
    //                 ticket.attendees.includes(username)
    //               ).type
    //             }
    //           </p>
    //           <p>
    //             <strong>➤Description:</strong> {event.description}
    //           </p>
    //           <p>
    //             <strong>➤Organizer:</strong> {event.createdBy || "Unknown"}
    //           </p>
    //         </div>
    //       </div>
    //     ))
    //   )}
    // </div>

    <div>
      {events.length === 0 ? (
        <p>You haven't registered for any events yet.</p>
      ) : (
        <div className="event-list">
          {events.map((event) => {
            const myType = getMyTicketType(event);
            return (
              <div key={event._id} className="event-card-wrapper">
                <EventCard
                  event={event}
                  onViewImages={handleViewImages}
                  showActions={false}
                  showOrganizer
                />
                <p className="my-ticket-line" style={{ marginTop: 8 }}>
                  <strong>➤Your ticket:</strong> {myType || "Unknown"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
