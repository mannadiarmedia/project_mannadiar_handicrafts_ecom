import React, { createContext, useContext, useState, useEffect } from 'react';
import { logAnalyticsEvent } from '../firebase';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('mannadiar_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mannadiar_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        logAnalyticsEvent('remove_from_wishlist', {
          item_id: product.id,
          item_name: product.title
        });
        return prev.filter(item => item.id !== product.id);
      } else {
        logAnalyticsEvent('add_to_wishlist', {
          item_id: product.id,
          item_name: product.title,
          item_category: product.category,
          value: product.discounted_price || product.price,
          currency: 'INR'
        });
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount: wishlist.length,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
