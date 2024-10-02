import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined') {
        // Redirect to login if no token
        // window.location.href = '/';
        return;
    }
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
}

export const getNonAuthHeaders = () => {
    return {
        'Content-Type': 'application/json',
    };
}

export const fetchUser = async () => {
    const headers = getAuthHeaders();
    return  axios.get(`${backendUrl}/user/me`, { headers });
};