import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/dashboard.css';

import OrganizerEvents from './OrganizerEvents';
import AttendeeEvents from './AttendeeEvents';
import RegisterEvent from './RegisterEvent';

export default function Dashboard() {

  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [isOrganizer, setIsOrganizer] = useState(false);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [myCreatedEvents, setMyCreatedEvents] = useState([]);

  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (!token) {
      alert('Unauthorized');
      navigate('/');
      return;
    }

    setUsername(username);
    setRole(role);
    setIsOrganizer(role === 'organizer');

    axios
      .get('http://localhost:5000/api/auth/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsername(res.data.username);
        setIsOrganizer(res.data.role === 'organizer');
      })
      .catch(() => {
        alert('Unauthorized');
        navigate('/');
      });

    axios
      .get('http://localhost:5000/api/auth/events/upcoming', {
                  headers: { Authorization: `Bearer ${token}` },
          })
      .then((res) => setUpcomingEvents(res.data))
      .catch(() => {
               alert('Unauthorized');
               navigate('/');
             });

    axios
      .get('http://localhost:5000/api/auth/user/registrations', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserRegistrations(res.data))
      .catch(() => {
               alert('Unauthorized');
               navigate('/');
             });

    axios
      .get('http://localhost:5000/api/auth/organizer/my-events', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMyCreatedEvents(res.data))
      .catch(() => {
                alert('Unauthorized');
                navigate('/');
                  });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard-container">

        <div className="dashboard-bg"></div>

<nav className="navbar">
    <div className="nav-left">
      <span className="user-role">{role?.toUpperCase()}</span>
    </div>
    <div className="nav-center">
    <div className="nav-links">
      <a onClick={() => setActiveSection('home')}>Home</a>
      <a onClick={() => setActiveSection('about')}>About</a>
      {isOrganizer && <a onClick={() => setActiveSection('create')}>Create an Event</a>}
            {!isOrganizer && <a onClick={() => setActiveSection('register')}>Register for Events</a>}
      <a onClick={() => setActiveSection('events')}>Upcoming Events</a>
      <a onClick={() => setActiveSection('myEvents')}>My Events</a>
      <a onClick={handleLogout} style={{ color: 'red' }}>Logout</a>
      </div>
    </div>
</nav>

      <main className="main-content">
          {activeSection === 'home' && (

    <section>
        <div className="dashboard-root">
        <div clasName = "welcome-text">
            <h1>Hi {username}, welcome to NewyEvents!</h1>
            <h3>Our trustworthy event management platform. Your experience matters.</h3>

        </div>

        <div className = "card-row">
               <div className="preview-card">
                 <h3>🔔 Upcoming Events Preview</h3>
                 <ul>
                   <li>📅 UON Career Expo – <i>June 20</i></li>
                   <li>📊 Strategy Planning – <i>July 3</i></li>
                   <li>💡 Agile Workshop – <i>July 18</i></li>
                 </ul>
                 <button>Explore More →</button>
               </div>

              <div className="preview-card">
                <h3>🔔 My events...</h3>
                <ul>
                  <li>🧑‍💻 Hackathon – <i>August 5</i></li>
                  <li>📎 Resume Workshop – <i>August 12</i></li>
                  <li>🗣️ Public Speaking – <i>August 19</i></li>
                </ul>
                <button>Explore More →</button>
              </div>

              <div className="preview-card">
                <h3>🔔 Events you might like</h3>
                <ul>
                  <li>🔬 Research Showcase – <i>Sept 2</i></li>
                  <li>🎨 Creative Expo – <i>Sept 10</i></li>
                  <li>🎓 Graduate Pathways – <i>Sept 17</i></li>
                </ul>
                <button>Explore More →</button>
              </div>
        </div>

        <div style = {{  textAlign: 'left'}}>

             <h2>Our services</h2>

             {role === 'organizer' ? (
                              <h3>👉 As an organizer, you can create an Event, view upcoming events, and check events created by you!</h3>
                 ) : (
                                  <h3>👉 As an attendee, you can register for an Event, view upcoming events, and check events you joined in!</h3>
                     )}



             <h3>📅 Event name, date, time, location & Detail… we’ve got you covered!</h3>
             <h3>📌 Terms & Conditions are under section "About"</h3>
             <h3>📋  Manage and keep track of events easily</h3>

                          {role === 'organizer' ? (
                                           <h3>🚀 Start your journey by creating your 1st event now!</h3>
                              ) : (
                                               <h3>🚀 Start your journey by registering for your 1st event now!</h3>
                                  )}


                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>

        </div>

         <div className="signature-block">
           <img src="/imagege.png" alt="signature" />
           <div><strong>uon Event Management</strong></div>
           <div>NewyEvents@newcastle.au</div>
         </div>

         </div>

    </section>


          )}

        {activeSection === 'about' && (
          <section style={{ paddingInline: '4rem' }}>
            <h2 style={{ paddingLeft: '1.5rem', paddingRight: '2rem' }}>➤About</h2>
              <p>
              Welcome to the UoN Event Management Platform, your ultimate solution for organizing and managing events with ease and efficiency. Designed with both event organizers and attendees in mind, our web-based application provides a comprehensive suite of features that simplify the entire event lifecycle.
              </p>
              <p>
              From initial planning and promotion to registration and attendance tracking, we ensure that every aspect of your event is streamlined for success. At UoN, we understand that creating an event can be a daunting task.That’s why our Event management platform empowers organizers to easily create and manage events. With just a few clicks, you can specify essential details such as the event name, date, time, venue, description, and ticket types.
              </p>
              <p> 
              Our intuitive interface makes it easy for anyone, regardless of technical expertise, to set up an event that meets their unique needs. Attendees will also appreciate the user-friendly experience our platform offers.Registration is straightforward, allowing participants to select their desired tickets and provide the necessary details effortlessly. We prioritize user experience, ensuring that every visitor can navigate the platform with ease and confidence, whether they’re signing up for a conference, workshop, or social gathering. Effective communication is essential for successful event management, and the UoN Event Management Platform excels in this area.Our automated email notifications keep attendees informed with ticket confirmations, general communications, and timely reminders.This feature not only enhances engagement but also reduces the workload on organizers, allowing them to focus on delivering exceptional experiences. 
              </p>
              <p>
              Our platform is designed for everyone—from small community gatherings to large-scale conferences. We cater to diverse event types, ensuring that our features are adaptable to various needs. Whether you’re an experienced event planner or just starting, our platform provides the tools necessary to make your event a success. We pride ourselves on our commitment to delivering an exceptional user experience. The UoN Event Management Platform is not just about functionality; it’s about creating memorable moments for both organizers and attendees. Our goal is to help you streamline your processes so that you can focus on what truly matters: creating engaging and impactful events. Moreover, the UoN team is dedicated to providing ongoing support and resources to help you maximize the potential of our platform.We offer tutorials, customer service, and a wealth of knowledge to ensure that your experience is as smooth as possible. Your success is our priority, and we’re here to support you every step of the way. 
              </p>
              <p>
              In conclusion, the UoN Event Management Platform is your go-to solution for all your event planning needs.With our comprehensive features, user-friendly interface, and dedication to exceptional service, we are confident that we can help you create unforgettable events. Join us today and experience the future of event management!Whether you're an organizer looking to streamline your processes or an attendee eager for seamless registration, UoN is here to elevate your event experience.
              </p>
              <h2 style={{ paddingLeft: '1.5rem', paddingRight: '2rem' }}>➤Terms & Conditions</h2>
              <p>
                  <strong>1. Privacy and Data Protection</strong><br/>

                  The system should protect user information so that it’s not exposed to anyone who shouldn’t see it. This includes using encryption when people send data through the site (like when they register for an event), and making sure it's stored securely behind login systems. Only people who need access to manage events should be able to see private data.

                  We’ll also write up a clear privacy policy that tells users what we collect, why we collect it, and how it will be used. Users should know they’re in control of their data.


                  </p>
                  <p>
                                        <strong>2. Consent and User Testing</strong><br/>

                                        If we test the platform with real students or staff, we’ll make sure they know what they’re signing up for. They’ll be told exactly what kind of data is being collected and how it’s going to be used. Participation will be completely voluntary. If minors are involved at any stage, we’ll take extra steps to follow university and legal guidelines.

                  </p>
                  <p>

                                        <strong>3. Platform Security</strong><br/>

                                        We also need to think about security. The platform shouldn’t be open to hackers or used in a way that puts users at risk. To help with this, we’ll write clean code, use secure login systems, and test for common security issues like SQL injections or cross-site scripting. The site will also be monitored for any issues, especially if it grows over time.

                                        Events that might involve sensitive information, like mental health workshops or support sessions, will be treated carefully so users feel safe signing up and attending.



                      </p>
                      <p>
                                                                  <strong>4. Copyright and Using Other People’s Work</strong><br/>

                                                                  When we use other people’s content – like images, icons, or parts of code – we’ll make sure it’s legal to use and we give proper credit. We’ll stick to open-source tools and follow their licence terms. All work created for this project will be shared fairly among the team, and any university rules around student projects and IP will be followed.

                          </p>
                      <p>
                                                                  <strong>5. Accessibility</strong><br/>

                                                                  The platform should be usable for everyone, including people with disabilities. That means making sure it works with screen readers, has good colour contrast, and can be navigated by keyboard. We want all students to be able to use the platform, not just those who can see and hear well or who use a mouse.


                          </p>
                          <p>
                                                                                                <strong>6. Future Planning</strong><br/>

                                                                                                Right now, this is a university project, but if the platform becomes public or commercial in the future, more rules and responsibilities could apply – like global privacy laws or moderation of user-generated content. So it’s worth planning ahead to make sure it’s scalable and stays ethical as it grows.

                              </p>
          </section>
        )}

      {activeSection === 'create' && (
        <section>
          <h2 style={{ textAlign: 'center' }}>Create a New Event</h2>
        <button
          onClick={() => navigate('/create-event')}
          style={{ color: 'white' }}
        >
          Go to Event Creation Page
        </button>

        </section>
      )}

        {activeSection === 'register' && (
          <section>
            <RegisterEvent />
          </section>
        )}

        {activeSection === 'events' && (
          <section>
                <h2 style={{ textAlign: 'center' }}>Upcoming Events</h2>
                  {upcomingEvents.length === 0 ? (
                    <p>No upcoming events.</p>
                  ) : (
       <div className="event-list">
         {upcomingEvents.map((event) => (
           <div className="event-card" key={event._id}>
             <h3>{event.name}</h3>
             <p><strong>➤Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
             <p><strong>➤Time:</strong> {event.time}</p>
             <p><strong>➤Place:</strong> {event.venue}</p>
             <p><strong>➤Description:</strong> {event.description}</p>
             <p><strong>➤Tickets:</strong> {event.tickets.join(', ')}</p>
             <p><strong>➤Organizer:</strong> {event.createdBy || 'Unknown'}</p>
           </div>
         ))}
       </div>
                  )}
          </section>
        )}
    {activeSection === 'myEvents' && (
      <section>
        <h2 style={{ textAlign: 'center' }}>My Events</h2>
        {role === 'organizer' ? (
          <OrganizerEvents />
        ) : (
          <AttendeeEvents />
        )}
      </section>
    )}
      </main>
    </div>
  );
}
