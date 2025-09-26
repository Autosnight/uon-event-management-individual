// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer
      className="signature-block"
      style={{
        color: "#fff", // 白字
        padding: "16px 0",
        display: "grid",
        placeItems: "center",
        gap: "6px",
      }}
    >
      <img src="/imagege.png" alt="signature" />
      <div>
        <strong>uon Event Management</strong>
      </div>
      <div style={{ opacity: 0.85, color: "#fff" }}>NewyEvents@newcastle.au</div>
    </footer>
  );
}
