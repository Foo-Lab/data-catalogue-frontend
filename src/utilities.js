import moment from 'moment';

export const splitCamelCase = (s) => s.replace(/([a-z])([A-Z])/g, '$1 $2');

export const checkIsDate = (s) => moment(s, 'YYYY-MM-DD', true).isValid();

export const formatDate = (s, toString=true) => {
    const mmt = moment(s, 'YYYY-MM-DD')
    return toString ? mmt.format('DD/MM/YYYY') : mmt;
};

export const checkIsDateTime = (s) => moment(s, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid();

export const formatDateTime = (s, toString=true) => {
    const mmt = moment(s, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    return toString ? mmt.format('DD/MM/YYYY HH:mm') : mmt;
};

export const getNestedObject = (obj, paths) => {
    let tmp = obj;
    paths.forEach((key)=> {
        tmp = tmp[key];
    });
    return tmp;
};

export const compareStrings = (a, b) => a.localeCompare(b)
