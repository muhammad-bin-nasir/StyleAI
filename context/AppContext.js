import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({ name: '', gender: '', style: '' });
  
  // ADDED 'time' HERE
  const [contextData, setContextData] = useState({ 
    location: '', 
    occasion: '', 
    time: 'Afternoon', 
    weather: 'Clear' 
  });
  
  const [wardrobe, setWardrobe] = useState([]); 

  return (
    <AppContext.Provider value={{ 
      userProfile, setUserProfile, 
      contextData, setContextData,
      wardrobe, setWardrobe 
    }}>
      {children}
    </AppContext.Provider>
  );
};