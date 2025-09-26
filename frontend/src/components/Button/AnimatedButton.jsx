// components/AnimatedButton.jsx
import "./AnimatedButton.css";
export default function AnimatedButton({
  label, // 按钮显示文字（必填）
  onClick, // 点击回调（可选）
  disabled = false, // 是否禁用（可选）
  title, // hover 提示（可选）
  wrapperClassName = "", // 额外包裹层 class（可选）
  buttonClassName = "", // 额外按钮 class（可选）
  type = "button", // 按钮类型（可选）
  danger = false,
}) {
  return (
    <div
      className={`btn-animate btn-animate__around  ${wrapperClassName}`}
      aria-disabled={disabled}
    >
      <svg aria-hidden="true" focusable="false">
        <rect
          x="0"
          y="0"
          fill="none"
          width="100%"
          height="100%"
          className={`${danger ? "danger" : ""}`}
        ></rect>
      </svg>

      <button
        type={type}
        className={`action-btn ${buttonClassName}`}
        onClick={onClick}
        disabled={disabled}
        title={title}
      >
        <span className="text">{label}</span>
      </button>
    </div>
  );
}
