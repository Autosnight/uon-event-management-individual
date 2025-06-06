import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AttendeeEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/auth/user/registrations', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setEvents(res.data))
      .catch(err => console.error('Error fetching registered events:', err));
  }, []);

  return (
    <div>
      {events.length === 0 ? (
        <p>You haven't registered for any events yet.</p>
      ) : (
        events.map(event => (
             <div className = "event-list">
          <div key={event._id} className="event-card">
            <h3>{event.eventTitle || event.name}</h3>
            <p><strong>➤Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>➤Time:</strong>  {event.time}</p>
            <p><strong>➤Place:</strong>  {event.venue}</p>
             <p><strong>➤Tickets:</strong>  {event.tickets}</p>
             <p><strong>➤Description:</strong> {event.description}</p>
             <p><strong>➤Organizer:</strong> {event.createdBy || 'Unknown'}</p>
             </div></div>
        ))
      )}
    </div>
  );
}
