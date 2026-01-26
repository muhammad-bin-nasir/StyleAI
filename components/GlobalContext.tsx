import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define Types
type UserProfile = {
  gender: string;
  style: string;
};

type ContextData = {
  location: string;
  occasion: string;
  weather: string;
};

type AppContextType = {
  userProfile: UserProfile;
  setUserProfile: (p: UserProfile) => void;
  contextData: ContextData;
  setContextData: (c: ContextData) => void;
  wardrobe: string[];
  setWardrobe: (w: string[]) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({ gender: '', style: '' });
  const [contextData, setContextData] = useState<ContextData>({ location: '', occasion: 'Office', weather: 'Clear' });
  const [wardrobe, setWardrobe] = useState<string[]>([]);

  return (
    <AppContext.Provider value={{ userProfile, setUserProfile, contextData, setContextData, wardrobe, setWardrobe }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useGlobalContext must be used within AppProvider');
  return context;
};