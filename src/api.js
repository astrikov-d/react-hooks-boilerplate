import axios from 'axios';
import {getEnvConfig} from './env';

const config = getEnvConfig();

const api = axios.create({
    baseURL: config.API_URL,
    timeout: 600000
});

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user')) || {};

    if (user.token) {
        const headers = {
            ...config.headers,
            Authorization: 'Token ' + user.token
        };
        return {...config, headers};
    }

    return config;
});

export default api;


export function getErrorsFromResponse(error) {
    console.error(error);

    if (error.message === 'Canceled') {
        return;
    }

    const {response} = error;
    let errors = {};

    if (response.data.detail) {
        errors.non_field_errors = [response.data.detail];
    } else {
        errors = response ? response.data.errors || response.data : error;
    }

    return errors;
}