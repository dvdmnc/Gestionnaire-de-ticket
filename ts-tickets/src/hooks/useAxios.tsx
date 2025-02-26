import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface UseAxiosResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

const useAxios = <T = any>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any,
    headers: Record<string, string> = {}
): UseAxiosResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const source = axios.CancelToken.source();
        setLoading(true);

        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token"); // Adjust if using cookies
                const config: AxiosRequestConfig = {
                    method,
                    url: `${API_BASE_URL}${url}`,
                    data: body,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                        ...headers,
                    },
                    cancelToken: source.token,
                };

                const response: AxiosResponse<T> = await axios(config);
                setData(response.data);
            } catch (err) {
                const axiosError = err as AxiosError;
                if (!axios.isCancel(err)) {
                    setError(axiosError.response?.data as string || "Something went wrong");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => source.cancel("Request canceled");
    }, [url, method, body, headers]);

    return { data, loading, error };
};

export default useAxios;
