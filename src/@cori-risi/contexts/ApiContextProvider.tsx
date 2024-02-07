import React, {createContext, ReactElement, useEffect, useState} from "react";
import axios, { AxiosInstance } from 'axios';
import { fetchAuthSession, JWT } from "@aws-amplify/auth";
import { getCurrentUser } from "@aws-amplify/auth/cognito";
import { useAuthenticator, UseAuthenticator } from "@aws-amplify/ui-react";
import { useDispatch, useSelector } from "react-redux";
import {
    updateUserId,
    updateUserName,
    updateUserTokens,
    selectUser
} from "../features/index";
import User from '../models/User';

import "./styles/ApiContextProvider.css";

const BASE_URL = `${import.meta.env.VITE_CORI_DATA_API}`;

const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

interface ApiContextType {
    apiClient: AxiosInstance;
    authenticated: boolean;
    authenticated_user: User | null;
    autoSignOut: () => void;
    baseURL: string;
    token: JWT | null;
}

export const ApiContext = createContext<ApiContextType>({
    apiClient: apiClient,
    authenticated: false,
    authenticated_user: null,
    autoSignOut: () => { console.log("API Session signOut()!") },
    baseURL: BASE_URL,
    token: null,
});

let hasAuthSession = false;
let hasAuthUser = false;
let hasAuthClient = false;

export default function ApiContextProvider (props: { children?: ReactElement }) {

    const authenticator: UseAuthenticator = useAuthenticator();
    const userState: User = useSelector(selectUser);
    const dispatch = useDispatch();

    const [ authenticated_user, setAuthenticatedUser ] = useState<User>(userState);
    const [ token, setToken ] = useState<JWT | null>(null);

    const [ state, setState ] = useState({
        apiClient: apiClient,
        authenticated: false,
        authenticated_user: userState,
        autoSignOut: () => { console.log("API Session signOut()!") },
        baseURL: BASE_URL,
        token: token
    });

    useEffect(() => {
        const session = fetchAuthSession();
        const user: Promise<User> = getCurrentUser();

        session
            .then((sess) => {

                if (!hasAuthSession) {

                    hasAuthSession = true;

                    console.log("API Session is authenticated:", hasAuthSession);
                    console.log("API Session config:", sess);

                    const {
                        // signIn,
                        // signUp,
                        // forceNewPassword,
                        // confirmResetPassword,
                        // confirmSignIn,
                        // confirmSignUp,
                        // confirmVerifyUser,
                        // forgotPassword,
                        // setupTotp,
                        // verifyUser,
                        signOut
                    } = authenticator;

                    const tokens = sess.tokens!;

                    console.log("API tokens:", tokens);

                    setToken(tokens.idToken!);

                    if (!!tokens.idToken && !hasAuthClient) {

                        hasAuthClient = true;

                        try {

                            apiClient.interceptors.request.use(
                                (config) => {
                                    const accessToken = tokens.idToken!.toString();
                                    if (accessToken) {
                                        config.headers.Authorization = `Bearer ${accessToken}`;
                                    }
                                    return config;
                                },
                                (error) => Promise.reject(error)
                            );

                            setState({
                                apiClient: apiClient,
                                authenticated: true,
                                authenticated_user: authenticated_user,
                                autoSignOut: signOut,
                                baseURL: BASE_URL,
                                token: tokens.idToken
                            });

                        } catch (e: any) {
                            console.log("Axios Error:", e);
                        }

                        user.then((u) => {
                            if (!hasAuthUser) {

                                // console.log("Initial userState:", userState);
                                // console.log("user type:", u.constructor.name);

                                hasAuthUser = true;

                                console.log("API User is authenticated:", hasAuthSession);
                                console.log("API User:", u);

                                function updateUser (u: User) {
                                    try {
                                        if (!!u.userId) {
                                            console.log("Update userId:", u.userId);
                                            dispatch(updateUserId(u.userId));
                                        }
                                        if (!!u.userId && !!u.username) {
                                            console.log("Update username:", u.username);
                                            dispatch(updateUserName(u.username));
                                        }

                                        if (!!tokens.idToken) {
                                            console.log("Update user tokens:", tokens);
                                            dispatch(updateUserTokens(JSON.stringify(tokens)));
                                        }

                                    } catch (e: any) {
                                        console.error(e);
                                    }

                                    // setState({
                                    //     apiClient: (!!hasAuthClient) ? apiClient : axios.create({
                                    //         baseURL: BASE_URL,
                                    //         headers: {
                                    //             'Content-Type': 'application/json',
                                    //             'Authorization': `Bearer ${accessToken}`,
                                    //         },
                                    //     }),
                                    //     authenticated: true,
                                    //     authenticated_user: u,
                                    //     baseURL: BASE_URL,
                                    //     autoSignOut: signOut,
                                    //     token: tokens.idToken
                                    // });

                                    setAuthenticatedUser(u);

                                }

                                updateUser(u);
                            }
                        });
                    }
                }
            })
            .catch((e: any) => {
                console.log("API Session ERROR:", e);
            });
    }, []);

    return (
        <ApiContext.Provider value={state}>
            {/*<ApolloGraphQLProviderRedux aws_amplify_token={token} setReady={setReady}>*/}
                {props.children}
            {/*</ApolloGraphQLProviderRedux>*/}
        </ApiContext.Provider>
    );
}
