import { useReducer } from "react";
import { useLocation } from "react-router-dom";

export const useQueryParams = () => new URLSearchParams(useLocation().search);

const dataReducer = (state, action) => {
    if (action.type === "SET_DATA") {
        return { ok: true, value: action.value }
    }
    if (action.type === "DELETE_RECORD") {
        return { ok: true, value: state.value.filter(item => item.id !== action.value) }
    }
    if (action.type === "ERROR") {
        return { ok: false, errorMessage: action.value }
    }
    return { ok: null, value: null }
};

export const useDataReducer = (reducerFunction = dataReducer, initialValues = { ok: null, errorMessage: 'Loading...' }, initialFn) => useReducer(reducerFunction, initialValues, initialFn);

export default {
    useQueryParams,
    useDataReducer
};
