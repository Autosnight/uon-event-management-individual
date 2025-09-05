import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/pages/ticketTypeTable.css";
import TicketTypeTable from "../components/ticketTypeTable";

const RegisterEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username");
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedTicketByEvent, setSelectedTicketByEvent] = useState({});

  useEffect(() => {
    fetchEvents();

    const registered = events
      .filter((event) =>
        event?.tickets?.some(
          (t) => Array.isArray(t.attendees) && t.attendees.includes(username)
        )
      )
      .map((event) => event._id);
    setRegisteredEvents(registered);
  }, [events, username]);

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/events/upcoming",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    const selectedTicket = selectedTicketByEvent[eventId];
    if (selectedTicket === null) {
      alert("Please select a ticket type!");
      return;
    }
    const choice = events.find((e) => e._id === eventId).tickets[
      selectedTicket
    ];
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/api/auth/events/register/${eventId}`,
        { type: choice.type },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Registered successfully!");
      fetchEvents();
      setRegisteredEvents((prev) => [...prev, eventId]);
    } catch (err) {
      alert("Registration failed.");
      console.error(err);
    }
  };

  const handleCancellation = async (eventId) => {
    const token = localStorage.getItem("token");
    // const choice = events
    //   .find((e) => e._id === eventId)
    //   .tickets?.find(
    //     (t) => Array.isArray(t.attendees) && t.attendees.includes(username)
    //   );

    const _foundEvent = events.find((e) => e._id === eventId);
    const _tickets = _foundEvent.tickets;
    const _choice = _tickets.find(
      (t) => Array.isArray(t.attendees) && t.attendees.includes(username)
    );

    try {
      await axios.post(
        `http://localhost:5000/api/auth/events/cancel/${eventId}`,
        { type: _choice.type },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Registration cancelled successfully!");
      fetchEvents();
      setRegisteredEvents((prev) => prev.filter((id) => id !== eventId));
    } catch (err) {
      alert("Cancellation failed.");
      console.error(err);
    }
  };

  return (
    <div className="event-register-container">
      <h2 style={{ textAlign: "center" }}>Register for an Event!</h2>
      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No upcoming events available.</p>
      ) : (
        <div className="event-list">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.name}</h3>
              <p>
                <strong>➤Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
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
                  </colgroup>{" "}
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Tickets</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.tickets.map((ticket, index) => (
                      <tr key={index}>
                        <td>
                          <label className="ticket-radio">
                            <input
                              type="radio"
                              name={`ticketType-${event._id}`}
                              value={index}
                              checked={
                                selectedTicketByEvent[event._id] === index
                              }
                              onChange={() =>
                                setSelectedTicketByEvent((prev) => ({
                                  ...prev,
                                  [event._id]: index,
                                }))
                              }
                            />
                            {ticket.type}
                          </label>
                        </td>
                        <td className="num">{ticket.count}</td>
                        <td className="price">
                          {ticket.price === 0 ? "free" : `$${ticket.price}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* <TicketTypeTable
                event={event}
                selectedTicketByEvent={selectedTicketByEvent[event._id]}
                setSelectedTicketByEvent={setSelectedTicketByEvent}
                onChange={(idx) =>
                  setSelectedTicketByEvent((prev) => ({
                    ...prev,
                    [event._id]: idx,
                  }))
                }
              /> */}

              <p>
                <strong>➤Organizer:</strong> {event.createdBy}
              </p>

              {registeredEvents.includes(event._id) ? (
                <button
                  onClick={() => handleCancellation(event._id)}
                  style={{
                    backgroundColor: "#DCFCE7",
                    color: "#15803D",
                    border: "1px solid #86EFAC",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    marginTop: "10px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Registered
                </button>
              ) : (
                <button
                  onClick={() => handleRegister(event._id)}
                  style={{
                    backgroundColor: "#3B82F6",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    marginTop: "10px",
                    fontWeight: "500",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(59, 130, 246, 0.3)",
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
