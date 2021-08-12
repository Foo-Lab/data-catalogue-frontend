import axios from 'axios';

export default async (url, options) => (
    axios({
        baseURL: process.env.REACT_APP_BACKEND_URL,
        url,
        ...options,
    })
        .then((response) => {
            console.log(response);
            return response;
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
            return error.response;
        })
);
