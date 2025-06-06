import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RegisterEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username");
  const [registeredEvents, setRegisteredEvents] = useState([]);


  useEffect(() => {
    fetchEvents();

    const registered = events
         .filter(event => event.attendees.includes(username))
         .map(event => event._id);

    setRegisteredEvents(registered);

  }, []);


   const fetchEvents = async () => {
     const token = localStorage.getItem('token');
     try {
       const res = await axios.get('http://localhost:5000/api/auth/events/upcoming', {
         headers: { Authorization: `Bearer ${token}` }
       });
       setEvents(res.data);
     } catch (err) {
       console.error('Failed to fetch events:', err);
     } finally {
       setLoading(false);
     }
   };

  const handleRegister = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/api/auth/events/register/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Registered successfully!');
      fetchEvents();
      setRegisteredEvents(prev => [...prev, eventId]);
    } catch (err) {
      alert('Registration failed.');
      console.error(err);
    }
  };

  const handleCancellation = async (eventId) => {
      const token = localStorage.getItem('token');
          try {
            await axios.post(`http://localhost:5000/api/auth/events/cancel/${eventId}`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
            alert('Registration cancelled successfully!');
            fetchEvents();
            setRegisteredEvents(prev => prev.filter(id => id !== eventId));
          } catch (err) {
            alert('Cancellation failed.');
            console.error(err);
          }
  };

  return (
    <div className="event-register-container">
      <h2 style={{ textAlign: 'center' }}>Register for an Event!</h2>
      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No upcoming events available.</p>
      ) : (
        <div className="event-list">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.name}</h3>
              <p><strong>➤Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>➤Time:</strong> {event.time}</p>
              <p><strong>➤Place:</strong> {event.venue}</p>
              <p><strong>➤Description:</strong> {event.description}</p>
              <p><strong>➤Tickets:</strong> {event.tickets.join(', ')}</p>
              <p><strong>➤Organizer:</strong> {event.createdBy}</p>


              {(registeredEvents.includes(event._id) || event.attendees.includes(username)) ? (
                                    <button
                                      onClick={() => handleCancellation(event._id)}
                                      style={{
                                                          backgroundColor: '#DCFCE7',
                                                          color: '#15803D',
                                                          border: '1px solid #86EFAC',
                                                          padding: '6px 12px',
                                                          borderRadius: '6px',
                                                          marginTop: '10px',
                                                          fontWeight: '500',
                                                          cursor: 'pointer'
                                      }}
                                    >
                                      Registered
                                    </button>
                  ) : (
                                  <button onClick={() => handleRegister(event._id)}
                                                                            style={{
                                                                                              backgroundColor: '#3B82F6',
                                                                                              color: 'white',
                                                                                              border: 'none',
                                                                                              padding: '6px 12px',
                                                                                              borderRadius: '6px',
                                                                                              marginTop: '10px',
                                                                                              fontWeight: '500',
                                                                                              cursor: 'pointer',
                                                                                              boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)'
                                                                            }}
                                      >
                                    Register
                                  </button>
                      )}


            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegisterEvents;
