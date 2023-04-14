import axios from '../modules/axios';

const handleResponse = (response) => {
    console.log(response)
    if (response.status === 200) return response;
    if (response.status === 401) {
        // logout();
        // location.reload(true);
        console.error('401 not authorized')
    }
    return Promise.reject(response);
};

const login = (data) => {
    const requestOptions = {
        // method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,

        // data,
    };
    return axios.post('/auth/login', data, requestOptions).then(handleResponse);
}

const logout = () => {
    // localStorage.removeItem('user');
}


export default {
    login,
    logout,
};
