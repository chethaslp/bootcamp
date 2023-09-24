"use client";
import React from 'react';
import {
    onAuthStateChanged,
    getAuth,
} from 'firebase/auth';
import {auth} from '@/components/fb/auth';
import Loading from '@/app/loading';

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
    children,
}) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
                {loading ? <Loading/> : children}
        </AuthContext.Provider>
    );
};