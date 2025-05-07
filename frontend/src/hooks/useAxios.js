import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext"; // Adjust path if needed

const useAxios = () => {
    const { user } = useAuthContext();
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [controller, setController] = useState(null);

    const axiosFetch = async ({ axiosInstance, method, url, data, config = {} }) => {
        setLoading(true);
        const abortCtrl = new AbortController();
        setController(abortCtrl);

        try {
            console.log(url)

            // Add token to headers if available
            const tokenHeader = user?.accessToken
                ? { Authorization: `${user.tokenType} ${user.accessToken}` }
                : {};

            const finalConfig = {
                ...config,
                headers: {
                    ...tokenHeader,
                    ...(config.headers || {})
                },
                signal: abortCtrl.signal
            };

            let result;
            switch (method.toLowerCase()) {
                case "get":
                    console.log(url)
                    result = await axiosInstance.get(url, finalConfig);
                    break;
                case "post":
                    result = await axiosInstance.post(url, data, finalConfig);
                    break;
                case "put":
                    result = await axiosInstance.put(url, data, finalConfig);
                    break;
                case "delete":
                    result = await axiosInstance.delete(url, finalConfig);
                    break;
                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }


            setResponse(result.data);
            setError(null);
        } catch (err) {
            if (err.name !== "CanceledError") {
                console.error(err);
                setError(err?.response?.data?.message || "Something went wrong");
                setResponse(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => controller?.abort();
    }, [controller]);

    return { response, error, loading, axiosFetch };
};

export default useAxios;
