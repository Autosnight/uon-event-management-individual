import { useEffect, useState } from "react";
import "./ValidatedInput.css";

/**
 * props:
 * - tagType: "input" | "select" | "textarea"
 * - type: type of input (e.g., password)
 * - value / onChange
 * - placeholder / children (for select/textarea)
 * - rules: array，support String（内置名）or [name, ...args] or self-defined function: (v)=>error|null
 * - validateOn: "change" | "blur" | "submit" ("change" in default)
 * - className: "form-input"
 * - onError: (errStr|null)=>void  (Optional：Father component could know current error)
 */
export default function ValidatedInput({
  tagType = "input",
  type = "text",
  value,
  onChange,
  placeholder,
  children,
  rules = [],
  validateOn = "change",
  className = "form-input",
  onError,
  name,
  originPassword,
  ...rest
}) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(null);

  const USERNAME_RE = /^(?=.*[A-Za-z])(?!\d)[A-Za-z0-9_]{3,15}$/;
  const EMAIL_RE = /\S+@\S+\.\S+$/;
  const validate = (val) => {
    //Returns a String as reminder
    const str = (val ?? "").toString();
    //NOTE: Why `??`: `(val ?? "")` will only return `""` when val is null (allows 0 and false)
    for (const rule of rules) {
      if (rule === "required" && str.trim() === "") {
        return "*Required";
      }
      if (rule === "email" && !/\S+@\S+\.\S+$/.test(str)) {
        return "Invalid email";
      }
      if (
        rule === "username" &&
        !/^(?=.*[A-Za-z])(?!\d)[A-Za-z0-9_]{3,15}$/.test(str)
      ) {
        return "3-15 chars; letters/digits/_; no leading digit; must have a letter";
      }

      if (
        rule === "userOrEmail" &&
        !(EMAIL_RE.test(str) || USERNAME_RE.test(str))
      ) {
        return "Enter a valid username or email";
      }

      if (rule === "password" && !/^[A-Za-z0-9]{6,12}$/.test(str)) {
        return "Password: 6-12 letters or digits only";
      }
      if (rule === "confirmPassword" && str !== originPassword) {
        return "Passwords do not match";
      }
    }
    return null;
  };

  // change/blur Validation
  const triggerValidate = (val, when) => {
    if (when === "change" && validateOn !== "change") return;
    if (when === "blur" && validateOn === "submit") return;
    const msg = validate(val);
    setError(msg);
    onError?.(msg);
  };

  useEffect(() => {
    if (validateOn === "change") {
      const msg = validate(value);
      setError(msg);
      onError?.(msg);
    }
  }, []);

  const FieldTag = tagType;
  const showErr = Boolean(error && touched);
  const tipId = name ? `${name}-error` : undefined;

  return (
    <div className={`vf-field ${showErr ? "has-error" : ""}`}>
      <FieldTag
        {...rest}
        name={name}
        type={tagType === "input" ? type : undefined}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => {
          const v = e?.target ? e.target.value : e;
          onChange?.(v);
          triggerValidate(v, "change");
        }}
        onBlur={() => {
          setTouched(true);
          triggerValidate(value, "blur");
        }}
        aria-invalid={showErr}
        aria-describedby={showErr ? tipId : undefined}
        className={`${className}${showErr ? " vf-error-border" : ""}`}
      >
        {children}
      </FieldTag>

      <span className={`vf-error-tip${!showErr ? " hidden" : ""}`}>
        {error || "\u00A0"}
      </span>
    </div>
  );
}
