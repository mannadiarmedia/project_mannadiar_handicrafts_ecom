import React, { createContext, useContext, useState, useEffect } from 'react';

const EnquiryContext = createContext();

export function EnquiryProvider({ children }) {
  const [enquiryItems, setEnquiryItems] = useState(() => {
    const saved = localStorage.getItem('mannadiar_enquiry');
    return saved ? JSON.parse(saved) : [];
  });

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('mannadiar_enquiry', JSON.stringify(enquiryItems));
  }, [enquiryItems]);

  const addToEnquiry = (product) => {
    setEnquiryItems((prev) => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev; // Avoid duplicates
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsEnquiryOpen(true); // Auto-open drawer to show feedback
  };

  const removeFromEnquiry = (productId) => {
    setEnquiryItems((prev) => prev.filter(item => item.id !== productId));
  };

  const clearEnquiry = () => {
    setEnquiryItems([]);
  };

  return (
    <EnquiryContext.Provider value={{ 
      enquiryItems, 
      addToEnquiry, 
      removeFromEnquiry, 
      clearEnquiry,
      isEnquiryOpen,
      setIsEnquiryOpen
    }}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  return useContext(EnquiryContext);
}
