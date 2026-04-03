const BASE_URL = "https://uni-rent-backend.onrender.com";

export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
            ...options.headers,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.detail || "Something went wrong");
    }

    return data;
};