import { useContext, useState } from 'react';
import { createContext } from 'react';

const stateContext = createContext();

export function StateContextProvider({children}) {
  const [activeSection, setActiveSection] = useState('home');
  return <stateContext.Provider value = {{activeSection, setActiveSection}}>
    {children}
  </stateContext.Provider>
  }

  export function useStateContext() {
    const context = useContext(stateContext);
    return context;
  }