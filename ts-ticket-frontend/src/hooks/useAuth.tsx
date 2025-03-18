import { useState, useEffect } from "react";
import useUser, {registerUserInterface} from "@/hooks/useUser";
type User = {
    id: string;
    name: string;
    email: string;
} | null; // User can be null when not logged in

const useAuth = () => {
    const [user, setUser] = useState<User>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem("user"));
    const {registerUser} = useUser();
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    const login = (userData: User) => {
        setUser(userData);
        setIsLoggedIn(true);
    };
    const register = (userData: User) => {


        registerUser({
            nom:userData?.name,
            email:userData?.email,
            password:userData?.email} as registerUserInterface).then((res) => {
            console.log("📩 Incoming Request:", { userData });
        });

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("user");
    };

    return { user, isLoggedIn, login, logout ,register};
};

export default useAuth;
