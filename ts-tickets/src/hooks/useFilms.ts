import useAxios from "@/hooks/useAxios";
import {Film} from "@/classes/Film";

const useFilms = () => {
    const { fetchData, data: films, loading, error } = useAxios<Film[] | Film>();

    const getAllFilms = async ():Promise<Film[]> => {
        return fetchData("/films") as Promise<Film[]>;
    }

    const getFilmById = async (id: number): Promise<Film> => {
        return fetchData(`/films/${id}`) as Promise<Film>;
    }

    const createFilm = async (film: Omit<Film, "id">) => {
        return fetchData("/films", "POST", film);
    };

    const updateFilm = async (id: number, film: Partial<Film>) => {
        return fetchData(`/films/${id}`, "PUT", film);
    };

    const deleteFilm = async (id: number) => {
        return fetchData(`/films/${id}`, "DELETE");
    };

    return {
        films,
        loading,
        error,
        fetch,
        createFilm,
        updateFilm,
        deleteFilm,
        getAllFilms
    };
};

export default useFilms;
