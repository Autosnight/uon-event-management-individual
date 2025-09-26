// src/components/FormButton.jsx
import "./FormButton.css";

export default function FormButton({
  text,
  onClick,
  color = "green",
  type = "button",
}) {
  return (
    <button className={`form-button ${color}`} onClick={onClick} type={type}>
      {text}
    </button>
  );
}