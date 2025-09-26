import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "../styles/pages/ticketTypeTable.css";
import ButtonConfirm from "../components/ButtonConfirm";
import openImageViewer from "../components/ImageViewer";
import EventCard from "../components/EventCard";
import { isUpcoming } from "../components/IsUpcoming";

export default function OrganizerEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/auth/organizer/my-events", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching organizer events:", err));
  }, []);

  const handleDelete = (id) => {
    ButtonConfirm({
      title: "Delete event",
      message: "Are you sure you want to delete this event?",
      confirmText: "Delete",
      cancelText: "Cancel",
    }).then((ok) => {
      if (!ok) return;
      const token = localStorage.getItem("token");
      axios
        .delete(`http://localhost:5000/api/auth/organizer/delete-event/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setEvents(events.filter((event) => event._id !== id));
        })
        .catch((err) => console.error("Error deleting event:", err));
    });
  };

  const handleEdit = (event) => {
    navigate(`/organizer/events/${event._id}/edit`, { state: { event } });
    console.log("Edit event", event);
  };

  const handleViewImages = (imgs) => {
    if (!imgs || imgs.length === 0) {
      alert("No images uploaded for this event.");
      return;
    }
    openImageViewer({ images: imgs, startIndex: 0 });
  };

  const upcoming = events.filter(isUpcoming);
  const pastOrToday = events.filter((e) => !isUpcoming(e));

  return (
    // <div>
    //   {events.length === 0 ? (
    //     <p>You haven't created any events yet.</p>
    //   ) : (
    //     events.map((event) => (
    //       <div className="event-list">
    //         <div key={event._id} className="event-card">
    //           <h3>{event.name}</h3>
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
    //             <strong>➤Description:</strong> {event.description}
    //           </p>
    //           <p>
    //             <strong>➤Ticket types:</strong>
    //           </p>

    //           <div className="ticket-table-wrap">
    //             <table className="ticket-table">
    //               <colgroup>
    //                 <col />
    //                 <col />
    //                 <col />
    //               </colgroup>{" "}
    //               <thead>
    //                 <tr>
    //                   <th>Type</th>
    //                   <th>Tickets</th>
    //                   <th>Price</th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 {event.tickets.map((ticket, index) => (
    //                   <tr key={index}>
    //                     <td className="num">{ticket.type}</td>
    //                     <td className="num">{ticket.count}</td>
    //                     <td className="price">
    //                       {ticket.price === 0 ? "free" : `$${ticket.price}`}
    //                     </td>
    //                   </tr>
    //                 ))}
    //               </tbody>
    //             </table>
    //           </div>

    //           <div className="event-actions">
    //             <button
    //               className="action-btn"
    //               onClick={() => handleViewImages(event.images)}
    //               disabled={
    //                 !Array.isArray(event.images) || event.images.length === 0
    //               }
    //               title={
    //                 Array.isArray(event.images) && event.images.length > 0
    //                   ? "View Images"
    //                   : "No images yet"
    //               }
    //             >
    //               <span className="text">View Images</span>
    //             </button>

    //             <button
    //               className="action-btn"
    //               onClick={() => handleEdit(event)}
    //               title="Edit event details"
    //             >
    //               <span className="text">Edit Details</span>
    //             </button>

    //             <button
    //               className="action-btn danger"
    //               onClick={() => handleDelete(event._id)}
    //               title="Delete this event"
    //             >
    //               <span className="text">Delete</span>
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     ))
    //   )}
    // </div>

    <div className="event-list">
      {events.length === 0 ? (
        <p>You haven't created any events yet.</p>
      ) : (
        <>
          <h2>Your Upcoming Events</h2>
          {upcoming.length === 0 ? (
            <p>No upcoming events.</p>
          ) : (
            upcoming.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewImages={handleViewImages}
                showActions
              />
            ))
          )}

          <h2 style={{ marginTop: 24 }}>Past / Today</h2>
          {pastOrToday.length === 0 ? (
            <p>No past events.</p>
          ) : (
            pastOrToday.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewImages={handleViewImages}
                showActions
              />
            ))
          )}
        </>
      )}
    </div>
  );
}
