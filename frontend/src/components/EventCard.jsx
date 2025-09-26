import "../styles/pages/ticketTypeTable.css";
import "../components/EventCard.css";
import AnimatedButton from "./Button/AnimatedButton";
import React from "react";

export default function EventCard({
  event,
  onEdit,
  onDelete,
  onViewImages,
  showActions = false, // toggles Edit/Delete
  disableImagesIfEmpty = true, // keeps your current UX
}) {
  const hasImages = Array.isArray(event.images) && event.images.length > 0;

  const handleViewImages = () => {
    console.log("hi");
    if (!onViewImages) {
      alert("function onViewImages does not exist!");
      return;
    }
    if (disableImagesIfEmpty && !hasImages) {
      alert("No images uploaded for this event.");
      return;
    }
    console.log(event);
    onViewImages(event.images);
  };

  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p>
        <strong>➤Date:</strong> {new Date(event.date).toLocaleDateString()}
      </p>
      <p>
        <strong>➤Time:</strong> {event.time}
      </p>
      <p>
        <strong>➤Place:</strong> {event.venue}
      </p>
      <p>
        <strong>➤Description:</strong> {event.description}
      </p>
      <p>
        <strong>➤Ticket types:</strong>
      </p>
      <div className="ticket-table-wrap">
        <table className="ticket-table">
          <colgroup>
            <col />
            <col />
            <col />
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
                <td className="price">
                  {t.price === 0 ? "free" : `$${t.price}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="event-actions">
        <div className="button-wrapper">
          <AnimatedButton
            label={hasImages ? "View Images" : "No images yet"}
            onClick={handleViewImages}
            disabled={!hasImages}
          />
        </div>

        {showActions && (
          <React.Fragment>
            <div className="button-wrapper">
              <AnimatedButton
                label="Edit Details"
                onClick={() => onEdit?.(event)}
              />
            </div>

            <div className="button-wrapper">
              <AnimatedButton
                label="Delete"
                onClick={() => onDelete?.(event._id)}
                danger="true"
              />
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
