import { createContext, useContext, ReactNode } from "react";
import useAuth from "../hooks/useAuth";

type AuthContextType = {
    user: { id: string; name: string; email: string } | null;
    isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = useAuth();

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};
