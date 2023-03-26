import { useReducer } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectUserInfo } from "./store/userSlice";

export const useQueryParams = () => new URLSearchParams(useLocation().search);

const dataReducer = (state, action) => {
    if (action.type === "SET_DATA") {
        return { ok: true, value: action.value }
    }
    if (action.type === "UPDATE_VALUE") {
        return { ok: true, value: Object.assign(state.action, action.value) }
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

export const useAuth = () => useSelector(selectUserInfo);

/*
    // use userSlice as token
    // TODO change to using access token
    // const user = useSelector(selectUserInfo);
    // const nameValid = user.name !== '';
    // const usernameValid = user.username !== '';
    // const emailValid = user.email !== '';
    // return { auth: nameValid && usernameValid && emailValid }
*/;


export default {
    useQueryParams,
    useDataReducer
};
