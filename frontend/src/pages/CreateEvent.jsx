import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';

import axios from 'axios';



export default function CreateEvent() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    venue: '',
    description: '',
    tickets: '',
  });
  const [ticketTypes, setTicketTypes] = useState(['']);


  useEffect(() => {
          const token = localStorage.getItem('token');
              if (!token) {
                alert('Unauthorized');
                navigate('/');
              }
      }, [navigate]);


  const handleTicketChange = (index, value) => {
    const updated = [...ticketTypes];
    updated[index] = value;
    setTicketTypes(updated);
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, '']);
  };

  const removeTicketType = (index) => {
    const updated = [...ticketTypes];
    updated.splice(index, 1);
    setTicketTypes(updated);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
//    console.log("handleSubmit triggered");
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const dataToSubmit = {
    name: formData.name,
    date: formData.date,
    time: formData.time,
    venue: formData.venue,
    description: formData.description,
    tickets: ticketTypes.filter(t => t.trim() !== ''),
    createdBy: username
  };

  console.log(dataToSubmit.createdBy);

  try {
    await axios.post('http://localhost:5000/api/auth/create-event', dataToSubmit, {
      headers: {Authorization: `Bearer ${token}`},
    });

    alert('Event submitted successfully!');
    navigate('/dashboard');
  } catch (err) {
    console.error(err);
    alert('Failed to submit event.');
  }
};

  return (
    <div className="event-form-container">
      <h2>Create a New Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <label>
          Event Name
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Date
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </label>

        <label>
          Time
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        </label>

        <label>
          Venue
          <input type="text" name="venue" value={formData.venue} onChange={handleChange} required />
        </label>

        <label>
          Description
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange} />
        </label>

        <label>
          Ticket Types
          {ticketTypes.map((type, index) => (
            <div key={index} className="ticket-type-row">
              <input
                type="text"
                value={type}
                onChange={(e) => handleTicketChange(index, e.target.value)}
                placeholder="e.g. General, VIP"
              />
              {index === ticketTypes.length - 1 ? (
                <button type="button" onClick={addTicketType} className="add-btn">＋</button>
              ) : (
                <button type="button" onClick={() => removeTicketType(index)} className="remove-btn">－</button>
              )}
            </div>
          ))}
        </label>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: '#ccc',
              color: '#333',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

        <button type="submit">Submit Event</button>
      </form>
    </div>
  );
}
