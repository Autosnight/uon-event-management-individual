import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrganizerEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
//     const username = localStorage.getItem('username');
    axios.get('http://localhost:5000/api/auth/organizer/my-events', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setEvents(res.data))
      .catch(err => console.error('Error fetching organizer events:', err));
  }, []);

  return (
    <div>
      {events.length === 0 ? (
        <p>You haven't created any events yet.</p>
      ) : (
        events.map(event => (
            <div className = "event-list">
          <div key={event._id} className="event-card">
            <h3>{event.name}</h3>
            <p><strong>➤Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>➤Time:</strong>  {event.time}</p>
            <p><strong>➤Place:</strong>  {event.venue}</p>
            <p><strong>➤Description:</strong> {event.description}</p>
            <p><strong>➤Tickets:</strong>  {event.tickets}</p>
          </div></div>
        ))
      )}
    </div>
  );
}
