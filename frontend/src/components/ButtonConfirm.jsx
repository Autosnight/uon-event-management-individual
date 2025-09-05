import { createRoot } from "react-dom/client";
// import * as React from "react";
import React, { useEffect} from "react";
import "./ButtonConfirm.css";

export default function ButtonConfirm(
  {
    title = "Confirm",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
  } = {} /*NOTE: If any property in the class is undefined (or the class being passed is empty), set this class property to empty*/
) {
  if (!message) throw new Error("confirm({ message }) is required");

  return new Promise((resolve) => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);

    const close = (result) => {
      //remove temporary root
      root.unmount();
      host.remove();
      //resolve the promise
      resolve(result);
    };

    function Modal() {
      //The var root refers to the temporary prompt
      useEffect(() => {
        const onKey = (e) => e.key === "Escape" && close(false); //If condition e.key === "Escape" is TRUE, execute close(false)

        document.addEventListener("keydown", onKey); // Listen on keydown event, pass the keydown event as a prop to execute function onKey
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden"; // lock scroll
        return () => {
          //When this component (Modal) is unmounted
          //ducoment is a global static class, thus temporary setting need to be reversed
          document.removeEventListener("keydown", onKey);
          document.body.style.overflow = prev;
        };
      }, []);

      return (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cm-title"
          className="cm-backdrop"
          onClick={() => close(false)}
        >
          <div className="cm-card" onClick={(e) => e.stopPropagation()}>
            {title && (
              <h3 id="cm-title" className="cm-title">
                {title}
              </h3>
            )}
            <p className="cm-message">{message}</p>
            <div className="cm-actions">
              <button className="cm-btn cm-ghost" onClick={() => close(false)}>
                {cancelText}
              </button>
              <button
                id="cm-ok"
                className="cm-btn cm-primary"
                onClick={() => close(true)}
                autoFocus
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      );
    }

    root.render(<Modal />);
  });
}
