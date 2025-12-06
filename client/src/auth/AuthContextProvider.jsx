import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authRequestSender from './requests/index';

const AuthContext = createContext();

export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: null
    });
    const navigate = useNavigate();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: null
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: null
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async () => {
        const response = await authRequestSender.getLoggedIn();
        if (response.status === 200) {
            const data = await response.json();
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: data.loggedIn,
                    user: data.user
                }
            });
        }
    }
    auth.registerUser = async (profileImage, userName, email, password, passwordVerify) => {
        try {
            const response = await authRequestSender.registerUser(profileImage, userName, email, password, passwordVerify);
            if (response.status === 200) {
                const data = await response.json();
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: data.user,
                        loggedIn: true,
                        errorMessage: null
                    }
                });
                navigate("/login");
                auth.loginUser(email, password);
            } else
                throw new Error(data.errorMessage);
        } catch (err) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: auth.user,
                    loggedIn: false,
                    errorMessage: err.message
                }
            });
        }
    }
    auth.loginUser = async (email, password) => {
        try {
            const response = await authRequestSender.loginUser(email, password);
            if (response.status === 200) {
                const data = await response.json();
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: data.user,
                        loggedIn: true,
                        errorMessage: null
                    }
                });
                navigate("/playlists");
            } else
                throw new Error(data.errorMessage);
        } catch (err) {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: auth.user,
                    loggedIn: false,
                    errorMessage: err.message
                }
            });
        }
    }

    return (
        <AuthContext.Provider value={{auth}}>
            {props.children}
        </AuthContext.Provider>
    )
}
export default AuthContext;
export { AuthContextProvider };