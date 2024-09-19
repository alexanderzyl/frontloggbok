import axios from "axios";
import {getAuthHeaders, getNonAuthHeaders} from "./auth";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getAllUserPois = async () => {
    const headers = getAuthHeaders();
    return axios.get(`${backendUrl}/user/pois`, { headers });
}

export const getAllGroups = async () => {
    const headers = getAuthHeaders();
    return axios.get(`${backendUrl}/user/groups`, { headers });
}

export const getGroup = async (shortId) => {
    const headers = getNonAuthHeaders();
    return axios.get(`${backendUrl}/group/${shortId}`, { headers });
};