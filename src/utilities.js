import moment from 'moment';

export const splitCamelCase = (s) => s.replace(/([a-z])([A-Z])/g, '$1 $2');

export const checkIsDate = (s) => moment(s, 'YYYY-MM-DD', true).isValid();

/**
 * Converts a datetime object or string into a string with the format 'DD/MM/YYYY' or a moment object
 * @param {Date} s 
 * @param {boolean} toString 
 * @returns 
 */
export const formatDate = (s, toString = true) => {
    const mmt = moment(s, 'YYYY-MM-DD')
    return toString ? mmt.format('DD/MM/YYYY') : mmt;
};

export const checkIsDateTime = (s) => moment(s, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid();

/**
 * Converts a datetime object or string into a string with the format 'DD/MM/YYYY HH:mm' or a moment object
 * @param {Date} s 
 * @param {boolean} toString 
 * @returns 
 */
export const formatDateTime = (s, toString = true) => {
    const mmt = moment(s, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    return toString ? mmt.format('DD/MM/YYYY HH:mm') : mmt;
};

/**
 * Obtain a value from a nested Object.  e.g.
 * 
 * `obj: { user: { id: 3, name: 'Tom' }, location: 'Office' }}`
 * 
 * `paths: ['user', 'name']`
 * 
 * `getNestedObject(obj, paths) -> 'Tom'`
 * @param {object} obj 
 * @param {string[]} paths 
 * @returns nested value
 */
export const getNestedObject = (obj, paths) => {
    let tmp = obj;
    paths.forEach((key) => {
        tmp = tmp[key];
    });
    return tmp;
};

export const compareStrings = (a, b) => a.localeCompare(b)
