import React, { createContext } from 'react';

type UserContextType = {
  currentUser: string | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<string | null>>;
};
export const UserContext = createContext<UserContextType>({
  currentUser: '',
  setCurrentUser: () => ''
});
