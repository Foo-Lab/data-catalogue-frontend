import { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { refreshUser, selectUserInfo } from "./store/userSlice";
import axios from "./modules/axios";
import axiosPrivate from "./modules/axiosPrivate";

// export const useQueryParams = () => new URLSearchParams(useLocation().search);
export const useDefaultValue = (field) => {
    const searchParams = useSearchParams()[0];
    return searchParams.get(field);
}

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

export const useDataReducer = (
    reducerFunction = dataReducer,
    initialValues = { ok: null, errorMessage: 'Loading...' },
    initialFn
) => useReducer(reducerFunction, initialValues, initialFn);

export const useAuth = () => useSelector(selectUserInfo);

export const useRefreshToken = () => {
    const requestOptions = {
        method: 'GET',
        withCredentials: true,
    };
    const refresh = async () => {
        const response = await axios('/refresh', requestOptions);
        const { token } = response.data;
        refreshUser(response.data)
        return token
    }
    return refresh
};

export const usePrivateAxios = () => {
    const refresh = useRefreshToken();
    const auth = useAuth();
    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers.authorization) {
                    config.headers.authorization = `Bearer ${auth?.token}`
                }
                return config;
            },
            async (error) => {
                console.log('HOOKS', error, Object.keys(error))
                return Promise.reject(error)
            }
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            async (response) => { // error becomes response because of the intercept in axiosPrivate being applied first
                const prevRequest = response?.config;
                if (response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers.authorization = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return response
            },
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers.authorization = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error)
            }
        )
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosPrivate
}

// export default {
//     useQueryParams,
//     useDataReducer
// };
