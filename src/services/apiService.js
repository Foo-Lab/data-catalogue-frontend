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

/**
 * Creates a new row, given a backend route and the data to be inserted
 * @param {string} name The backend route to the table in the database, i.e. 'user'
 * @param {object} data The data to be inserted
 * @returns Will return the inserted row if successful, and Rejected Promise otherwise.
 */
const create = (name, data) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data,
    };
    return axios(`/${name}`, requestOptions).then(handleResponse);
};

/**
 * Runs the `SELECT * FROM table_name` query, given the table, 
 * and some optional parameters to determine the number of rows and offset. 
 * 
 * @param {string} name The backend route to the table in the database, i.e. 'user'
 * @param {int} page The current page number?
 * @param {int} size The number of rows to be returned
 * @param {string} sort The column name by which the rows will be sorted
 * @param {string} dir The direction of the sorting, either `asc` or `desc`
 * @returns Will return an array of rows if successful, and Rejected Promise otherwise.
 */
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

/**
 * Runs the `SELECT * FROM table_name WHERE foreign_key=referenceId` query, 
 * given the table to be queried, the table that is referenced by the foreign key, 
 * and the id to be matched.  
 * Should take some optional parameters to determine the number of rows and offset. 
 * 
 * @param {string} name The backend route to the table in the database, i.e. 'sample'
 * @param {int} page The current page number?
 * @param {int} size The number of rows to be returned
 * @param {string} sort The column name by which the rows will be sorted
 * @param {string} dir The direction of the sorting, either `asc` or `desc`
 * @param {object} reference The backend route to the referenced table in the database, 
 * i.e. 'experiment'
 * @returns Will return an array of rows if successful, and Rejected Promise otherwise.
 */
const getAllWhere = (name, page, size, sort, dir, {route, id}) => {
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
    return axios(`/${route}/${name}/${id}`, requestOptions).then(handleResponse);
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
