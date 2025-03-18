import { useState } from "react";

type User = {
    id: string;
    name: string;
    email: string;
} | null; // User can be null when not logged in

const useAuth = () => {
    const [user, setUser] = useState<User>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    return { user, isLoggedIn };
};

export default useAuth;
