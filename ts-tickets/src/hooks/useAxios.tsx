import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const useAxios = <T = unknown, B = unknown>() => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (
        url: string,
        method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
        body?: B,
        headers: Record<string, string> = {}
    ) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.request<T>({
                url: `${API_BASE_URL}${url}`,
                method,
                data: method !== "GET" ? body : undefined,
                headers,
            });
            setData(response.data);
            return response.data;
        } catch (error: any) {
            setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, fetchData };
};

export default useAxios;
