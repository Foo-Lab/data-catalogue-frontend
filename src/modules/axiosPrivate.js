import axios from 'axios';

const axiosPrivate = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    // headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});
axiosPrivate.interceptors.request.use(
    config => config,
    (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
    (response) => response,
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
/* 
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
    });
 */
export default axiosPrivate;