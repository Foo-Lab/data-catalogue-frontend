import axios from '../modules/axios';

/**
 * Handles the axios response. If response.status === 200, return response object as `{ result: data, ... }`. 
 * Otherwise returns a rejected Promise with the error message.
 * @param {object} response the response object with shape `{ data, status, ... }`
 * @returns returns an object with the shape `{ result: response.data, count: response.headers['x-total-count'] }` or rejected Promise if error
 */
const handleResponse = (response) => {
    if (response === undefined) return Promise.reject(new Error('Response is undefined. Backend may be down'))
    if (response.status !== 200) {
        if (response.status === 401) {
            // logout();
            // location.reload(true);
            console.warn('401 not authorized');
        };
        if (response.status === 422) {
            // logout();
            // location.reload(true);
            console.warn('422 Forbidden');
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
 * @param {string} route The backend route to the table in the database, i.e. 'user'
 * @param {object} data The data to be inserted
 * @returns Will return the inserted row if successful, and Rejected Promise otherwise.
 */
const create = async (route, data) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': getToken(),
        },
        data,
    };
    const response = await axios(`/${route}`, requestOptions);
    return handleResponse(response);
};

/**
 * Runs the `SELECT * FROM table_name` query, given the table with route `route`, 
 * and some optional parameters to determine the number of rows and offset. 
 * 
 * @param {string} route The backend route to the table in the database, i.e. 'user'
 * @param {int} page The current page number?
 * @param {int} size The number of rows to be returned
 * @param {string} sort The column name by which the rows will be sorted
 * @param {string} dir The direction of the sorting, either `asc` or `desc`
 * @returns Will return an array of rows if successful, and Rejected Promise otherwise.
 */
const getAll = async (route, page, size, sort, dir) => {
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
    const response = await axios(`/${route}`, requestOptions);
    return handleResponse(response);
};

/**
 * Runs the `SELECT * FROM table_name WHERE foreign_key=referenceId` query, 
 * given the table to be queried, the table that is referenced by the foreign key, 
 * and the id to be matched.  
 * Should take some optional parameters to determine the number of rows and offset. 
 * 
 * @param {string} ref The backend route to the table in the database where id is fkey
 * @param {int} page The current page number?
 * @param {int} size The number of rows to be returned
 * @param {string} sort The column name by which the rows will be sorted
 * @param {string} dir The direction of the sorting, either `asc` or `desc`
 * @param {string} route route for the table where id is pkey, 
 * @param {int} id The foreign key value, 
 * i.e. 'experiment'
 * @returns Will return an array of rows if successful, and Rejected Promise otherwise.
 */
const getAllWhere = async (ref, page, size, sort, dir, { route, id }) => {
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
    const response = await axios(`/${route}/${ref}/${id}`, requestOptions);
    return handleResponse(response);
};

/**
 * Runs the `SELECT * FROM table_name WHERE pkey_id=id` query, i.e. the id provided is used in the WHERE clause.
 * @param {string} route backend route to the table in the database where id is fkey
 * @param {int} id pkey of the record
 * @returns Will return the matching row if successful, and Rejected Promise otherwise. 
 */
const getById = async (route, id) => {
    const requestOptions = {
        method: 'GET',
    };
    const response = await axios(`/${route}/${id}`, requestOptions);
    return handleResponse(response);
};

/**
 * Updates the provided columns of a record, given the route and the id of the record.
 * @param {string} route backend route to the table in the database containing the record
 * @param {int} id pkey of the record
 * @param {object} data object containing updated columns of the record
 * @returns  Will return the updated row if successful, and Rejected Promise otherwise.
 */
const update = async (route, id, data) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data,
    };
    const response = await axios(`/${route}/${id}`, requestOptions);
    return handleResponse(response);
};

/**
 * Deletes the record with pkey matching the provided id. 
 * @param {string} route backend route to the table in the database containing the record
 * @param {int} id pkey of the record
 * @returns 
 */
const remove = async (route, id) => {
    const requestOptions = {
        method: 'DELETE'
    };
    const response = await axios(`/${route}/${id}`, requestOptions);
    return handleResponse(response);
};

export default {
    create,
    getAll,
    getAllWhere,
    getById,
    update,
    remove,
};
