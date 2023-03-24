import axios from '../modules/axios';

const handleResponse = (response) => {
    if (response === undefined) return Promise.reject(new Error('Response is undefined. Backend may be down'))
    if (response.status !== 200) {
        if (response.status === 401) {
            console.warn('401 not authorized');
        };

        const error = (response.data && response.data.message) || response.statusText;
        return Promise.reject(error);
    }

    return { result: response.data };
};

export const checkUsernameExists = (username) => {
    const requestOptions = {
        method: 'GET',
    };
    console.log(username);
    return axios(`/user/username/${username}`, requestOptions).then(handleResponse);
};

export const checkEmailExists = (email) => {
    const requestOptions = {
        method: 'GET',
    };
    console.log(email);
    return axios(`/user/email/${email}`, requestOptions).then(handleResponse);
};
