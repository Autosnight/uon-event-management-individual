import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/CreateEvent.css";
import { useStateContext } from "../context/StateContext";
import iconRight from "../assets/icons/right-arrow.ico";
import { useSizeVars } from "../components/UseSizeVars";
import axios from "axios";

//TODO: Change the input box into an input line; retain the textarea and date/time; redesign tickets page
export default function CreateEvent() {
  const { setActiveSection } = useStateContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    ticketTypes: "",
  });
  const [ticketTypes, setTicketTypes] = useState([
    { type: "", count: 0, price: 0 },
  ]);

  const [images, setImages] = useState([]);
  const [step, setStep] = useState(0); // 0..6：name/date/time/venue/desc/images/tickets
  const totalSteps = 7;
  const stepLabels = [
    "Event Name",
    "Date",
    "Time",
    "Venue",
    "Description (Optional)",
    "Images (Optional)",
    "Tickets",
  ];

  const stepFields = [
    {
      tag: "input",
      type: "text",
      key: "name",
      placeholder: "Enter event name",
      value: formData.name,
    },
    { tag: "input", type: "date", key: "date", value: formData.date },
    { tag: "input", type: "time", key: "time", value: formData.time },
    {
      tag: "input",
      type: "text",
      key: "venue",
      placeholder: "Enter event venue",
      value: formData.venue,
    },
    {
      tag: "textarea",
      type: "text",
      key: "description",
      value: formData.description,
    },
    { tag: "input", type: "text", key: "tickets", value: formData.ticketTypes },
  ];

  const cleanTickets = useMemo(
    () => ticketTypes.filter((t) => t.type.trim() && t.count > 0),
    [ticketTypes]
  );

  // 每步的最小校验
  const validators = [
    () => formData.name.trim().length > 0, // step 0
    () => !!formData.date, // step 1
    () => !!formData.time, // step 2
    () => formData.venue.trim().length > 0, // step 3
    () => true, // step 4 (说明/图片可选)
    () => true,
    () => cleanTickets.length > 0, // step 5
  ];

  const canNext = validators[step]();
  const isLast = step === totalSteps - 1;

  const prev = () => setStep((s) => Math.max(0, s - 1));
  const next = () => canNext && setStep((s) => Math.min(totalSteps - 1, s + 1));

  const ParentRef = useRef(null);
  const ChildRef = useRef(null);
  useSizeVars(
    ChildRef,
    { wVar: "--body-width", hVar: "--body-height" },
    ParentRef
  );
  const onPickImages = (e) => {
    setImages(Array.from(e.target.files || []));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized");
      navigate("/");
    }
  }, [navigate]);

  const handleTicketTypeChange = (index, value) => {
    const updated = [...ticketTypes];
    updated[index].type = value;
    setTicketTypes(updated);
  };

  const handleTicketCountChange = (index, value) => {
    const updated = [...ticketTypes];
    updated[index].count = Math.max(0, parseInt(value || "0", 10));
    setTicketTypes(updated);
  };

  const handleTicketPriceChange = (index, value) => {
    const updated = [...ticketTypes];
    updated[index].price = Math.max(0, parseFloat(value || "0"));
    setTicketTypes(updated);
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { type: "", count: 0, price: 0 }]);
  };

  const removeTicketType = (index) => {
    const updated = [...ticketTypes];
    updated.splice(index, 1);
    setTicketTypes(updated);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const cleanTickets = ticketTypes.filter(
      (t) => t.type.trim() !== "" && t.count > 0
    );

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("date", formData.date);
    fd.append("time", formData.time);
    fd.append("venue", formData.venue);
    fd.append("description", formData.description);
    fd.append("createdBy", username);
    fd.append("tickets", JSON.stringify(cleanTickets));

    images.forEach((file) => fd.append("images", file)); // 字段名必须与 multer 的 upload.array("images") 一致

    try {
      await axios.post("http://localhost:5000/api/auth/create-event", fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Event submitted successfully!");
      setActiveSection("home");
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.error || "Failed to submit event.");
    }
  };
  function clickHandler() {
    navigate("/dashboard");
    setActiveSection("home");
  }

  return (
    <div id="main-content">
      <div className="wizard-wrap">
        <div className="wizard-aside">
          <ul>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <React.Fragment key={i}>
                <li key={i} className="menu-item">
                  <span className="menu-text">{stepLabels[i]}</span>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>

        <div className="wizard-main" ref={ParentRef}>
          {step < 4 && (
            <React.Fragment>
              <label
                htmlFor={stepFields[step].key}
                className="inset-label"
                ref={ChildRef}
              >
                {step === 0 && <h1>Event Name</h1>}
                {step === 1 && <h1>Date</h1>}
                {step === 2 && <h1>Time</h1>}
                {step === 3 && <h1>Venue</h1>}
              </label>
              <div className="input-box">
                <input
                  id={stepFields[step].key}
                  className="big-input"
                  type={stepFields[step].type}
                  name={stepFields[step].key}
                  value={stepFields[step].value}
                  onChange={handleChange}
                  placeholder={stepFields[step].placeholder}
                  autoFocus
                  required
                />
              </div>
            </React.Fragment>
          )}

          {step === 4 && (
            <React.Fragment>
              <label
                htmlFor="description"
                className="inset-label"
                ref={ChildRef}
              >
                <h1>Description (optional)</h1>
              </label>
              <div className="input-box">
                <textarea
                  id="description"
                  className="big-input"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                />
              </div>
            </React.Fragment>
          )}

          {step === 5 && (
            <React.Fragment>
              <label htmlFor="images" className="inset-label" ref={ChildRef}>
                <h1>Event Images (optional)</h1>
              </label>
              <div className="input-box">
                <input
                  id="images"
                  className="big-input"
                  type="file"
                  accept="image/*"
                  multiple
                  name="images"
                  onChange={onPickImages}
                />
              </div>
            </React.Fragment>
          )}

          {step === 6 && (
            <React.Fragment>
              <label className="inset-label">
                <h1>Ticket Info</h1>
              </label>
              <div className="input-box">
                <div className="ticket-grid">
                  <div className="th">Type</div>
                  <div className="th">Qty</div>
                  <div className="th">Price</div>
                  <div className="th"></div>

                  {ticketTypes.map((t, i) => (
                    <React.Fragment key={i}>
                      <input
                        className="td"
                        type="text"
                        value={t.type}
                        onChange={(e) =>
                          handleTicketTypeChange(i, e.target.value)
                        }
                        placeholder="e.g. General, VIP"
                      />
                      <input
                        className="td"
                        type="number"
                        min="0"
                        step="1"
                        value={t.count}
                        onChange={(e) =>
                          handleTicketCountChange(i, e.target.value)
                        }
                        placeholder="Qty"
                      />
                      <input
                        className="td"
                        type="number"
                        min="0"
                        step="0.5"
                        value={t.price}
                        onChange={(e) =>
                          handleTicketPriceChange(i, e.target.value)
                        }
                        placeholder="Price"
                      />
                      <div className="td actions">
                        {ticketTypes.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => removeTicketType(i)}
                          >
                            −
                          </button>
                        )}
                        {i === ticketTypes.length - 1 && (
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={addTicketType}
                          >
                            +
                          </button>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </React.Fragment>
          )}

          <div className="nav-bottom-wrapper">
            {" "}
            <div className="nav-bottom">
              <button
                type="button"
                className="arrow-btn"
                onClick={prev}
                disabled={step === 0}
                aria-label="Previous"
              >
                <img className="flip-x" src={iconRight} alt="" />
              </button>

              <div className="step-indicator" aria-live="polite">
                {step + 1} / {totalSteps}
              </div>

              <button
                type="button"
                className={`arrow-btn ${isLast ? "primary submit" : ""}`}
                onClick={() => (isLast ? handleSubmit() : next())}
                disabled={!canNext}
                aria-label={isLast ? "Submit" : "Next"}
              >
                {isLast ? "Submit" : <img src={iconRight} alt="" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
