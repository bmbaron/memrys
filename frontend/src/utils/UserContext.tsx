import React, { createContext } from 'react';

type UserContextType = {
  currentUser: string;
  setCurrentUser: React.Dispatch<React.SetStateAction<string>>;
};
export const UserContext = createContext<UserContextType>({
  currentUser: '',
  setCurrentUser: () => ''
});
