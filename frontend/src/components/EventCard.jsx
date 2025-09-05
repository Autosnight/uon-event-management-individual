import React from "react";
import "../styles/pages/ticketTypeTable.css";

export default function EventCard({
  event,
  onEdit,
  onDelete,
  onViewImages,
  showActions = false,           // toggles Edit/Delete
  disableImagesIfEmpty = true,   // keeps your current UX
}) {
  const hasImages = Array.isArray(event.images) && event.images.length > 0;

  const handleViewImages = () => {
    if (!onViewImages) return;
    if (disableImagesIfEmpty && !hasImages) {
      alert("No images uploaded for this event.");
      return;
    }
    onViewImages(event.images);
  };

  return (
    <div className="event-card">
      <h3>{event.name}</h3>

      <p><strong>➤Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>➤Time:</strong> {event.time}</p>
      <p><strong>➤Place:</strong> {event.venue}</p>
      <p><strong>➤Description:</strong> {event.description}</p>

      <p><strong>➤Ticket types:</strong></p>
      <div className="ticket-table-wrap">
        <table className="ticket-table">
          <colgroup>
            <col /><col /><col />
          </colgroup>
          <thead>
            <tr>
              <th>Type</th>
              <th>Tickets</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {(event.tickets || []).map((t, idx) => (
              <tr key={idx}>
                <td className="num">{t.type}</td>
                <td className="num">{t.count}</td>
                <td className="price">{t.price === 0 ? "free" : `$${t.price}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="event-actions">
        <button
          className="action-btn"
          onClick={handleViewImages}
          disabled={disableImagesIfEmpty ? !hasImages : false}
          title={hasImages ? "View Images" : "No images yet"}
        >
          <span className="text">View Images</span>
        </button>

        {showActions && (
          <>
            <button
              className="action-btn"
              onClick={() => onEdit?.(event)}
              title="Edit event details"
            >
              <span className="text">Edit Details</span>
            </button>

            <button
              className="action-btn danger"
              onClick={() => onDelete?.(event._id)}
              title="Delete this event"
            >
              <span className="text">Delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
