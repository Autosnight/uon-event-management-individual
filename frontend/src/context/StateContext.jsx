import { useContext, useState } from "react";
import { createContext } from "react";


const stateContext = createContext();

export function StateContextProvider({ children }) {
  const [activeSection, setActiveSection] = useState("home");
  const [sideBarOpen, setSideBarOpen] = useState(true);
  return (
    <stateContext.Provider value={{ activeSection, setActiveSection, sideBarOpen, setSideBarOpen }}>
      {children}
    </stateContext.Provider>
  );
}

export function useStateContext() {
  const context = useContext(stateContext);
  return context;
}