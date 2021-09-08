import React, { useState, createContext } from 'react';

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [AuthUserRole, setAuthUserRole] = useState(null)

  return (
    <AuthenticatedUserContext.Provider value={{
       user, setUser,
       AuthUserRole, setAuthUserRole
       }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};