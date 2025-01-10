import React, { createContext, useState, useContext } from "react";

// Create Context
const TransportContext = createContext();

// Provider Component
export const TransportProvider = ({ children }) => {
  const [selectedTransport, setSelectedTransport] = useState({});

  return (
    <TransportContext.Provider
      value={{ selectedTransport, setSelectedTransport }}
    >
      {children}
    </TransportContext.Provider>
  );
};

// Custom Hook to Use Context
export const useTransport = () => {
  return useContext(TransportContext);
};
