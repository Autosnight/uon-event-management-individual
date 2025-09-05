import React from "react";
import EventCard from "../components/EventCard";
import openImageViewer from "../components/ImageViewer";

export default function UpcomingEvents({ upcomingEvents }) {
  const handleViewImages = (imgs) => {
    if (!imgs || imgs.length === 0) {
      alert("No images uploaded for this event.");
      return;
    }
    openImageViewer({ images: imgs, startIndex: 0 });
  };

  return (
    // <section>
    //   <h2 style={{ textAlign: "center" }}>Upcoming Events</h2>
    //   {upcomingEvents.length === 0 ? (
    //     <p>No upcoming events.</p>
    //   ) : (
    //     <div className="event-list">
    //       {upcomingEvents.map((event) => (
    //         <div className="event-card" key={event._id}>
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

    //           <p>
    //             <strong>➤Organizer:</strong> {event.createdBy || "Unknown"}
    //           </p>
    //         </div>
    //       ))}
    //     </div>
    //   )}
    // </section>

    <section>
      <h2 style={{ textAlign: "center" }}>Upcoming Events</h2>

      {upcomingEvents.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <div className="event-list">
          {upcomingEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onViewImages={handleViewImages}
              showActions={false}   // 不显示 Edit / Delete
              showOrganizer         // 显示 Organizer
            />
          ))}
        </div>
      )}
    </section>
  );
}
