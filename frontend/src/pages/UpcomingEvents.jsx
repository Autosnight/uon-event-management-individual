import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import openImageViewer from "../components/ImageViewer";
import axios from "axios";

export default function UpcomingEvents() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const handleViewImages = (imgs) => {
    if (!imgs || imgs.length === 0) {
      alert("No images uploaded for this event.");
      return;
    }
    openImageViewer({ images: imgs, startIndex: 0 });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/auth/events/upcoming", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // console.log("Upcoming events:", res.data);
        setUpcomingEvents(res.data);
      })
      .catch(() => {
        alert("Unauthorized");
        navigate("/");
      });
  });

  return (
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
              showActions={false} // 不显示 Edit / Delete
              showOrganizer // 显示 Organizer
            />
          ))}
        </div>
      )}
    </section>
  );
}
