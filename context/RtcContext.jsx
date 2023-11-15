"use client";
import {useEffect, useState, useContext} from 'react';
import {auth} from '@/components/fb/auth';
import Loading from '@/app/loading';


export const AuthContext = React.createContext({});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({children}) => {

    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        

    return (
        <AuthContext.Provider value={{  }}>
                {loading ? <Loading msg="Connecting..."/> : children}
        </AuthContext.Provider>
    );
};