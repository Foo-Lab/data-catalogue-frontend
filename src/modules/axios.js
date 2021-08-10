import axios from 'axios';

export default async (url, options) => {
    try {
        const res = await axios({
            baseURL: process.env.REACT_APP_BACKEND_URL,
            url,
            ...options,
        });
        return res.data;
    } catch (err) {
        if (err.response) {
            console.error(err.response.data);
            console.error(err.response.status);
            console.error(err.response.headers);
        } else if (err.request) {
            console.error(err.request);
        } else {
            console.error(err.message);
        }
        console.error(err.config);
        return null;
    }
};
