import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    // url,
    // ...options,
});

instance.interceptors.request.use(
    config => config,
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => {
        console.log(response);
        return response;
    },
    (error) => {
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
    }
);
export default instance;