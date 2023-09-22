"use client";
import React from 'react';
import {
    onAuthStateChanged,
    getAuth,
} from 'firebase/auth';
import {auth} from '@/components/fb/auth';
import Loading from '@/app/loading';
import { motion } from 'framer-motion';

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
            <motion.div initial="pageInitial" animate="pageAnimate"  variants={{
                pageInitial: {
                opacity: 0
                },
                pageAnimate: {
                opacity: 1
                },
            }}>
                {loading ? <Loading/> : children}
            </motion.div>
        </AuthContext.Provider>
    );
};