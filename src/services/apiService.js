import axios from '../modules/axios';

const handleResponse = (response) => {
    if (response === undefined) {
        const error = 'Response is undefined. Backend may be down';
        return Promise.reject(error);
    }
    if (response.status !== 200) {
        if (response.status === 401) {
            // logout();
            // location.reload(true);
            console.warn('401 not authorized');
        };

        const error = (response.data && response.data.message) || response.statusText;
        return Promise.reject(error);
    }

    let res = {
        result: response.data,
    };

    if (response.headers['x-total-count']) {
        res = {
            ...res,
            count: response.headers['x-total-count'],
        };
    }

    return res;
};

const create = (name, data) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data,
    };
    return axios(`/${name}`, requestOptions).then(handleResponse);
};

const getAll = (name, page, size, sort, dir) => {
    let params = {};
    if (page && size) {
        params = {
            page,
            size,
            sort,
            dir,
        };
    }

    const requestOptions = {
        method: 'GET',
        params
    };
    return axios(`/${name}`, requestOptions).then(handleResponse);
};

const getAllWhere = (name, referenceName, referenceId) => {
    const requestOptions = {
        method: 'GET',
    };
    return axios(`/${name}/${referenceName}/${referenceId}`, requestOptions).then(handleResponse);
};

const getById = (name, id) => {
    const requestOptions = {
        method: 'GET',
    };
    return axios(`/${name}/${id}`, requestOptions).then(handleResponse);
};

const update = (name, id, data) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data,
    };
    return axios(`/${name}/${id}`, requestOptions).then(handleResponse);
};

const remove = (name, id) => {
    const requestOptions = {
        method: 'DELETE'
    };
    return axios(`/${name}/${id}`, requestOptions).then(handleResponse);
};

export default {
    create,
    getAll,
    getAllWhere,
    getById,
    update,
    remove,
};
