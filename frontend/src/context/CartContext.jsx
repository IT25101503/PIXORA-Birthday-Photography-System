import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState(() => {
    try {
      const saved = localStorage.getItem('pixora_cart_package');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [bookingDetails, setBookingDetails] = useState(() => {
    try {
      const saved = localStorage.getItem('pixora_cart_booking');
      return saved ? JSON.parse(saved) : {
        eventDate: '',
        eventTime: '14:00',
        venueAddress: '',
        photographerId: null,
        photographerName: '',
      };
    } catch {
      return {
        eventDate: '',
        eventTime: '14:00',
        venueAddress: '',
        photographerId: null,
        photographerName: '',
      };
    }
  });

  useEffect(() => {
    if (selectedPackage) {
      localStorage.setItem('pixora_cart_package', JSON.stringify(selectedPackage));
    } else {
      localStorage.removeItem('pixora_cart_package');
    }
  }, [selectedPackage]);

  useEffect(() => {
    localStorage.setItem('pixora_cart_booking', JSON.stringify(bookingDetails));
  }, [bookingDetails]);

  const selectPackage = (pkg) => {
    setSelectedPackage(pkg);
  };

  const updateBookingDetails = (updates) => {
    setBookingDetails((prev) => ({ ...prev, ...updates }));
  };

  const clearCart = () => {
    setSelectedPackage(null);
    setBookingDetails({
      eventDate: '',
      eventTime: '14:00',
      venueAddress: '',
      photographerId: null,
      photographerName: '',
    });
    localStorage.removeItem('pixora_cart_package');
    localStorage.removeItem('pixora_cart_booking');
  };

  const totalAmount = selectedPackage ? selectedPackage.priceLkr : 0;

  const value = {
    selectedPackage,
    bookingDetails,
    itemCount: selectedPackage ? 1 : 0,
    totalAmount,
    selectPackage,
    updateBookingDetails,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
