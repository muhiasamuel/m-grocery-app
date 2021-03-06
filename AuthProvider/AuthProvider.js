import React, { useState, createContext } from 'react';

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [AuthUserRole, setAuthUserRole] = useState(null)
  const [catData, setCatData] =useState([]);
  const [storeData, setStoreData] = useState([]); 
  const [Products, setProducts] = useState([]); 
  const [Orders, setOrders] = useState([]); 
  const [storeid, setstoreid] = useState(null);

  return (
    <AuthenticatedUserContext.Provider value={{
       user, setUser,
       storeid, setstoreid,
       AuthUserRole, setAuthUserRole,
       storeData, setStoreData,
       catData, setCatData,
       Products, setProducts,
       Orders,setOrders
       }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};