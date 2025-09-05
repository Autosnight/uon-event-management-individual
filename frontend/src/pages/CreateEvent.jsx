import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/CreateEvent.css";
import { useStateContext } from "../context/StateContext";
import iconLeft from "../assets/icons/left-arrow.ico";
import iconRight from "../assets/icons/right-arrow.ico";

import { useHeightVar } from "../components/UseHeightVar";
import { useSizeVars } from "../components/UseSizeVars";

import axios from "axios";

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
  const [step, setStep] = useState(0); // 0..5：name/date/time/venue/desc+images/tickets
  const totalSteps = 6;

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
    () => cleanTickets.length > 0, // step 5
  ];

  const canNext = validators[step]();
  const isLast = step === totalSteps - 1;

  const prev = () => setStep((s) => Math.max(0, s - 1));
  const next = () => canNext && setStep((s) => Math.min(totalSteps - 1, s + 1));

  const wizardMainRef = useRef(null);
  const wizardBodyRef = useRef(null);
  useSizeVars(wizardBodyRef, { wVar: "--body-width", hVar: "--body-height" }, wizardMainRef);
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
    <div className="wizard-wrap">
      <div className="wizard-aside">
        <ol className="v-steps">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <li
              key={i}
              className={`${i === step ? "active" : ""} ${
                i < step ? "done" : ""
              }`}
            >
              {i + 1}
            </li>
          ))}
        </ol>
      </div>

      <div ref={wizardMainRef} className="wizard-main">
        <div ref={wizardBodyRef} className="wizard-body">
          {step === 0 && (
            <div className="field field-inset">
              <label htmlFor="name" className="inset-label">
                Event Name :
              </label>
              <input
                id="name"
                className="big-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter event name"
                autoFocus
                required
              />
            </div>
          )}

          {step === 1 && (
            <div className="field field-inset">
              <label htmlFor="date" className="inset-label">
                Date :
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                autoFocus
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="field field-inset">
              <label htmlFor="time" className="inset-label">
                Time :
              </label>
              <input
                id="time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                autoFocus
                required
              />
            </div>
          )}

          {step === 3 && (
            <div className="field field-inset">
              <label htmlFor="venue" className="inset-label">
                Venue :
              </label>
              <input
                id="venue"
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Enter event venue"
                autoFocus
                required
              />
            </div>
          )}

          {step === 4 && (
            <>
              <div className="field field-inset">
                <label htmlFor="description" className="inset-label">
                  Description (optional) :
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                />
              </div>
              <div className="field field-inset">
                <label htmlFor="images" className="inset-label">
                  Event Images (optional) :
                </label>
                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  name="images"
                  onChange={onPickImages}
                />
              </div>
            </>
          )}

          {step === 5 && (
            <div className="field field-inset">
              <label className="inset-label">
                Ticket Types / Numbers / Price
              </label>
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
          )}
        </div>

        <div className="wizard-navrow">
          <div className="nav-left">
            <button
              type="button"
              className="arrow-btn"
              onClick={prev}
              disabled={step === 0}
              aria-label="Previous"
            >
              <img src={iconLeft} alt="" />
            </button>
            {/* <button
                  type="button"
                  className="link-cancel"
                  onClick={() => {
                    navigate("/dashboard");
                    setActiveSection("home");
                  }}
                >
                  Cancel
                </button> */}
          </div>

          <div className="nav-right">
            <button
              type="button"
              className={`arrow-btn`}
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
  );
}
