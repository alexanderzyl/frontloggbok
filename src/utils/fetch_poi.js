import axios from "axios";
import {getAuthHeaders} from "./auth";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getAllUserPois = async () => {
    const headers = getAuthHeaders();
    return axios.get(`${backendUrl}/user/pois`, { headers });
}