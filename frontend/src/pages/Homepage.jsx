export default function Homepage({ username, role }) {
  return (
          <section>
            <div className="dashboard-root">
              <div clasName="welcome-text">
                <h1>Hi {username}, welcome to NewyEvents!</h1>
                <h3>
                  Our trustworthy event management platform. Your experience
                  matters.
                </h3>
              </div>

              <div className="card-row">
                <div className="preview-card">
                  <h3>🔔 Upcoming Events Preview</h3>
                  <ul>
                    <li>
                      📅 UON Career Expo - <i>June 20</i>
                    </li>
                    <li>
                      📊 Strategy Planning - <i>July 3</i>
                    </li>
                    <li>
                      💡 Agile Workshop - <i>July 18</i>
                    </li>
                  </ul>
                  <button>Explore More →</button>
                </div>

                <div className="preview-card">
                  <h3>🔔 My events...</h3>
                  <ul>
                    <li>
                      🧑‍💻 Hackathon - <i>August 5</i>
                    </li>
                    <li>
                      📎 Resume Workshop - <i>August 12</i>
                    </li>
                    <li>
                      🗣️ Public Speaking - <i>August 19</i>
                    </li>
                  </ul>
                  <button>Explore More →</button>
                </div>

                <div className="preview-card">
                  <h3>🔔 Events you might like</h3>
                  <ul>
                    <li>
                      🔬 Research Showcase - <i>Sept 2</i>
                    </li>
                    <li>
                      🎨 Creative Expo - <i>Sept 10</i>
                    </li>
                    <li>
                      🎓 Graduate Pathways - <i>Sept 17</i>
                    </li>
                  </ul>
                  <button>Explore More →</button>
                </div>
              </div>

              <div style={{ textAlign: "left" }}>
                <h2>Our services</h2>

                {role === "organizer" ? (
                  <h3>
                    👉 As an organizer, you can create an Event, view upcoming
                    events, and check events created by you!
                  </h3>
                ) : (
                  <h3>
                    👉 As an attendee, you can register for an Event, view
                    upcoming events, and check events you joined in!
                  </h3>
                )}

                <h3>
                  📅 Event name, date, time, location & Detail… we’ve got you
                  covered!
                </h3>
                <h3>📌 Terms & Conditions are under section "About"</h3>
                <h3>📋 Manage and keep track of events easily</h3>

                {role === "organizer" ? (
                  <h3>🚀 Start your journey by creating your 1st event now!</h3>
                ) : (
                  <h3>
                    🚀 Start your journey by registering for your 1st event now!
                  </h3>
                )}

                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </div>

              <div className="signature-block">
                <img src="/imagege.png" alt="signature" />
                <div>
                  <strong>uon Event Management</strong>
                </div>
                <div>NewyEvents@newcastle.au</div>
              </div>
            </div>
          </section>
  );
}
