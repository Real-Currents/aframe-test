import React, {createContext, ReactElement, useEffect, useState} from "react";
// import { AmplifyProvider } from "@aws-amplify/ui-react";
import axios, { AxiosInstance } from 'axios';
// import queryString from 'query-string';
// import { autoSignIn } from "../utils";
import "./styles/ApiContextProvider.css";
import { fetchAuthSession, JWT } from "@aws-amplify/auth";
import { getCurrentUser } from "@aws-amplify/auth/cognito";
import { useAuthenticator, UseAuthenticator } from "@aws-amplify/ui-react";
import { useDispatch, useSelector } from "react-redux";
import store from "../app/store";
import {
    updateUserId,
    updateUserName,
    updateUserTokens,
    selectUser
} from "../../features/index";
import User from '../../models/User';

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

                                console.log("Initial userState:", userState);
                                console.log("user type:", u.constructor.name);

                                hasAuthUser = true;

                                console.log("API User is authenticated:", hasAuthSession);
                                console.log("API User:", u);

                                function updateUser (u: User) {
                                    var userTokens = JSON.stringify(tokens);

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
                                            dispatch(updateUserTokens(userTokens));
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

    /** OLD STUFF (from BCAT and Connect Humanity)... will cleanup soon **/

    // const [ config, setConfig ] = useState(null);
    // const [ cognito, setCognito ] = useState({
    //     clientId: '',
    //     identityPoolId: '',
    //     userPoolId: '',
    //     domain: '',
    //     hostedAuthenticationUrl: '',
    //     logoutUrl: '',
    // });

    // const [ ready, setReady ] = useState(false);
    // const [ signOut, setSignOut ] = useState(null);

    // const init_geoid = queryString.parse(location.search).geoid;              //<- This is not constant because of search bar
    // const init_location_label = queryString.parse(location.search).location;  //<- ...same
    // const [init_path, setInitPath] = useState(location.pathname + "")
    // const [geoid, setGeoid] = useState(init_geoid);
    // const [location_label, setLocationLabel] = useState(init_location_label);

    // window.AmplifyService = AmplifyService;

    // useEffect(() => {
    //
    //     console.log('Init Amplify config:', config);
    //
    //     if (config === null) {
    //         const cfg = AmplifyService.configure(props.aws_config, setConfig);
    //         const cognito_cfg = {};
    //
    //         for (const c in cognito) {
    //             if (cfg.Auth.hasOwnProperty(c)) {
    //                 cognito_cfg[c] = cfg.Auth[c];
    //             }
    //         }
    //
    //         setCognito(cognito_cfg);
    //
    //     } else {
    //
    //         AmplifyService.setHubListener(setAuthenticatedUser)
    //             .then(() => {
    //                 console.log("Passed setAuthenticatedUser to AmplifyService");
    //             });
    //
    //         AmplifyService.isAuthenticated()
    //             .then(authenticated => {
    //                 console.log('Authenticated ', authenticated);
    //
    //                 if (authenticated) {
    //                     console.log("Get Amplify claims...");
    //
    //                     AmplifyService.getClaims()
    //                         .then(claims => {
    //                             const saved = localStorage.getItem("redirect_after_auth");
    //                             console.log(JSON.parse(saved));
    //
    //                             if (!claims) {
    //                                 console.log('No claims found');
    //                                 // AmplifyService.federatedLogin('Google');
    //                             } else {
    //
    //                                 if (authenticated_user === null) {
    //                                     setAuthenticatedUser({
    //                                         username: claims.username,
    //                                         userType: 'admin',
    //                                         groups: claims.groups,
    //                                         email: claims.email
    //                                     });
    //                                 } else {
    //                                     setAuthenticatedUser({
    //                                         ...authenticated_user,
    //                                         username: claims.username,
    //                                         userType: 'admin',
    //                                         groups: claims.groups,
    //                                         email: claims.email
    //                                     });
    //                                 }
    //
    //                                 setReady(true);
    //                             }
    //                         })
    //                         .catch(err => {
    //                             console.log(err);
    //                             setAuthenticatedUser(null);
    //                         });
    //
    //                 } else {
    //                     // AmplifyService.federatedLogin('Google');
    //                     setAuthenticatedUser({
    //                         username: "",
    //                         userType: "",
    //                         groups: [],
    //                         email: "",
    //                     });
    //                 }
    //             })
    //             .catch(err => {
    //                 console.log('ERROR', err);
    //             });
    //     }
    //
    // }, [ config ]);
    //
    // useEffect(() => {
    //
    //     if (!ready) {
    //         console.log('Init Amplify cognito: ', cognito);
    //
    //         if (!!cognito.clientId) {
    //
    //             console.log("If not authenticated, save initial path to localStorage.");
    //             console.log("GEOID: ", geoid);
    //             console.log("LOCATION: ", location_label);
    //             console.log("PATH: ", init_path);
    //             localStorage.setItem("redirect_after_auth", {
    //                 init_path,
    //                 geoid,
    //                 location_label
    //             })
    //
    //             // Allow auto sign-in by clicking "Continue"
    //             autoSignIn();
    //
    //             setReady(true);
    //             return;
    //
    //         } else if (config !== null) {
    //             const cognito_cfg = {};
    //
    //             for (const c in cognito) {
    //                 if (config.Auth.hasOwnProperty(c)) {
    //                     cognito_cfg[c] = config.Auth[c];
    //                 }
    //             }
    //
    //             setCognito(cognito_cfg);
    //             setReady(true);
    //         }
    //     }
    //
    // }, [ cognito ]);

    // useEffect(() => {
    //     if (!!authenticated_user && authenticated_user !== null && token === null) {
    //         console.log("Attempt to get access token");
    //
    //         setState({
    //             authenticated_user,
    //             token
    //         });
    //
    //         AmplifyService.getIdToken()
    //             .then((t) => {
    //                 console.log("token:", t);
    //
    //                 // TODO: set token and connect ApolloGraphQLProvider to CORI Data API /graphql endpoint
    //                 setToken(t);
    //                 // setReady(true);
    //             })
    //             .catch(error => {
    //                 console.log(error);
    //             });
    //     }
    // }, [authenticated_user]);

    // useEffect(() => {
    //     setState({
    //         authenticated_user,
    //         token
    //     });
    // }, [ token ]);

    return (
        // <AmplifyProvider>
            <ApiContext.Provider value={state}>
                 {/*<CustomAmplifyAuthenticator*/}
                 {/*    authenticated_user={authenticated_user}*/}
                 {/*    setAuthenticatedUser={setAuthenticatedUser}>*/}
                 {/*    {(!!ready) ? (*/}
                 {/*           // <ApolloGraphQLProviderRedux aws_amplify_token={token} setReady={setReady}>{*/}
                               {props.children}
                 {/*           // }</ApolloGraphQLProviderRedux>*/}
                 {/*    ) : (*/}
                 {/*        <span>LOADING</span>*/}
                 {/*    )}*/}
                 {/*</CustomAmplifyAuthenticator>*/}
            </ApiContext.Provider>
        // </AmplifyProvider>
    );
}
