// pages/EditEvent.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

/*TODO: 
1. make the event card middle of the edition page
2. use Animated button
3. Redesign the (+/-) buttons for both edition page and Event creation page
*/
function toInputDate(d) {
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

export default function EditEvent() {
  const { id } = useParams();
  const { state } = useLocation(); // 可能有 { event }
  const navigate = useNavigate();

  // 1) 初始数据（优先用 state 里的 event）
  const initial = useMemo(() => {
    const e = state?.event ?? null;
    if (!e) return null;
    return {
      name: e.name || "",
      date: toInputDate(e.date),
      time: e.time || "",
      venue: e.venue || "",
      description: e.description || "",
      tickets: Array.isArray(e.tickets)
        ? e.tickets.map((t) => ({
            type: t.type || "",
            count: t.count ?? 0,
            price: t.price ?? 0,
          }))
        : [{ type: "", count: 0, price: 0 }],
      images: Array.isArray(e.images) ? e.images : [],
    };
  }, [state]);

  const [form, setForm] = useState(
    initial || {
      name: "",
      date: "",
      time: "",
      venue: "",
      description: "",
      tickets: [{ type: "", count: 0, price: 0 }],
      images: [],
    }
  );
  const [loading, setLoading] = useState(!initial);
  const [saving, setSaving] = useState(false);

  // 2) 刷新时兜底拉一次
  useEffect(() => {
    if (initial) return; // 有就不拉
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/auth/organizer/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const e = res.data;
        setForm({
          name: e.name || "",
          date: toInputDate(e.date),
          time: e.time || "",
          venue: e.venue || "",
          description: e.description || "",
          tickets: Array.isArray(e.tickets)
            ? e.tickets.map((t) => ({
                type: t.type || "",
                count: t.count ?? 0,
                price: t.price ?? 0,
              }))
            : [{ type: "", count: 0, price: 0 }],
          images: Array.isArray(e.images) ? e.images : [],
        });
      })
      .catch((err) => {
        console.error("Failed to fetch event", err);
        alert("Failed to load event.");
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [id, initial, navigate]);

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  // ticket 行编辑
  const setTicket = (i, key, val) => {
    setForm((prev) => {
      const next = prev.tickets.slice();
      next[i] = { ...next[i], [key]: key === "type" ? val : Number(val) || 0 };
      return { ...prev, tickets: next };
    });
  };
  const addTicket = () =>
    setForm((p) => ({
      ...p,
      tickets: [...p.tickets, { type: "", count: 0, price: 0 }],
    }));
  const removeTicket = (i) =>
    setForm((p) => ({
      ...p,
      tickets: p.tickets.filter((_, idx) => idx !== i),
    }));

  const canSave =
    form.name.trim() && form.date && form.time && form.venue.trim();

  const onCancel = () => navigate(-1);

  const onSave = async () => {
    if (!canSave) {
      alert("Please fill in required fields.");
      return;
    }
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      // 如果你的后端更新接口需要 FormData（例如带图片），就改成 FormData。
      await axios.put(
        `http://localhost:5000/api/auth/organizer/update-event/${id}`,
        {
          name: form.name,
          date: form.date,
          time: form.time,
          venue: form.venue,
          description: form.description,
          tickets: form.tickets,
          // images: form.images, // 看你是否支持更新图片
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Event updated.");
      navigate(-1); // 返回列表页
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.error || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;

  return (
    <div className="event-card" style={{ maxWidth: 800, margin: "32px auto" }}>
      <h3>Edit Event</h3>

      <p>
        <label>
          <strong>➤Name: </strong>
        </label>
        <input
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          required
        />
      </p>

      <p>
        <label>
          <strong>➤Date: </strong>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setField("date", e.target.value)}
            required
          />
        </label>
      </p>

      <p>
        <label>
          <strong>➤Time: </strong>
          <input
            type="time"
            value={form.time}
            onChange={(e) => setField("time", e.target.value)}
            required
          />
        </label>
      </p>

      <p>
        <label>
          <strong>➤Venue: </strong>
          <input
            value={form.venue}
            onChange={(e) => setField("venue", e.target.value)}
            required
          />
        </label>
      </p>

      <p>
        <label>
          <strong>➤Description: </strong>
        </label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
        />
      </p>

      <p>
        <label>
          <strong>➤Tickets: </strong>
        </label>
        <div className="ticket-grid">
          <div className="th">Type</div>
          <div className="th">Qty</div>
          <div className="th">Price</div>
          <div className="th"></div>
          {form.tickets.map((t, i) => (
            <React.Fragment key={i}>
              <input
                className="td"
                value={t.type}
                onChange={(e) => setTicket(i, "type", e.target.value)}
                placeholder="General / VIP"
              />
              <input
                className="td"
                type="number"
                min="0"
                step="1"
                value={t.count}
                onChange={(e) => setTicket(i, "count", e.target.value)}
              />
              <input
                className="td"
                type="number"
                min="0"
                step="0.5"
                value={t.price}
                onChange={(e) => setTicket(i, "price", e.target.value)}
              />
              <div className="td actions">
                {form.tickets.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => removeTicket(i)}
                  >
                    −
                  </button>
                )}
                {i === form.tickets.length - 1 && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={addTicket}
                  >
                    +
                  </button>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </p>

      <div className="event-actions">
        <div className="button-wrapper">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        </div>
        <div className="button-wrapper">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onSave}
            disabled={!canSave || saving}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
