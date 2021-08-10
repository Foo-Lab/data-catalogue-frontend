import axios from '../modules/axios';

const create = (name, data) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data,
    };
    return axios(`/${name}`, requestOptions);
}

const getAll = (name) => {
    const requestOptions = {
        method: 'GET',
    };
    return axios(`/${name}`, requestOptions);
}

const getById = (name, id) => {
    const requestOptions = {
        method: 'GET',
    };
    return axios(`/${name}/${id}`, requestOptions);
}

const update = (name, id, data) => {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json' },
        data,
    };
    return axios(`/${name}/${id}`, requestOptions);
}

const remove = (name, id) => {
    const requestOptions = {
        method: 'DELETE'
    };
    return axios(`/${name}/${id}`, requestOptions);
}

export default {
    create,
    getAll,
    getById,
    update,
    remove,
};
