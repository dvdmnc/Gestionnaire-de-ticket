import useAxios from "@/hooks/useAxios";
import {Film} from "@/classes/Film";
import {User} from "@/classes/User";
export interface registerUserInterface {
    nom: string;
    email: string;
    password: string;
}
const useUser = () => {
    const { fetchData, data: users, loading, error } = useAxios<User[] | User>();

/*    const getAllFilms = async ():Promise<Film[]> => {
        return fetchData("/films") as Promise<Film[]>;
    }*/


    const getAllUsers = async ():Promise<User[]> => {
        return fetchData("/users") as Promise<User[]>;
    }

    const registerUser = async (user: registerUserInterface) => {
        return fetchData("/users", "POST", user);
    }

    return {
        users,
        loading,
        error,
        fetch,
        registerUser
    };
};

export default useUser;
