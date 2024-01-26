import React, {createContext, ReactElement, useEffect, useState} from "react";
// import { AmplifyProvider } from "@aws-amplify/ui-react";
import axios, { AxiosInstance } from 'axios';
import queryString from 'query-string';
// import { autoSignIn } from "../utils";
import "./styles/ApiContextProvider.css";
import {fetchAuthSession, JWT} from "@aws-amplify/auth";
import {getCurrentUser} from "@aws-amplify/auth/cognito";
import {useDispatch, useSelector} from "react-redux";
import {
    updateUserId,
    updateUserName,
    selectUser
} from "../features";
import User from "../models/User";

const BASE_URL = `${import.meta.env.VITE_CORI_DATA_API}`;

interface ApiContextType {
    apiClient: AxiosInstance | null;
    authenticated_user: User | null;
    baseURL: string;
    token: JWT | null;
}

export const ApiContext = createContext<ApiContextType>({
    apiClient: null,
    authenticated_user: null,
    baseURL: BASE_URL,
    token: null,
});

let hasAuthSession = false;
let hasAuthUser = false;
let hasAuthClient = false;

export default function ApiContextProvider (props: { children?: ReactElement }) {
    const [ apiClient, setApiClient ] = useState<AxiosInstance | null>(null);
    const [ authenticated_user, setAuthenticatedUser ] = useState<User | null>(null);
    const [ token, setToken ] = useState<JWT | null>(null);

    const [ state, setState ] = useState({
        apiClient,
        authenticated_user,
        baseURL: BASE_URL,
        token
    });

    const session = fetchAuthSession();
    const user: Promise<User> = getCurrentUser();
    const userState: User = useSelector(selectUser);
    const dispatch = useDispatch();

    useEffect(() => {
        session.then((sess) => {

            if (!hasAuthSession) {

                hasAuthSession = true;

                console.log("API Session is authenticated:", hasAuthSession);
                console.log("API Session config:", sess);

                const tokens = sess.tokens!;

                console.log("API tokens:", tokens);

                setToken(tokens.idToken!);

                if (!!tokens.idToken && !hasAuthClient) {

                    hasAuthClient = true;

                    const accessToken = tokens.idToken.toString();

                    const client = axios.create({
                        baseURL: BASE_URL,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });

                    setState({
                        apiClient: client,
                        authenticated_user,
                        baseURL: BASE_URL,
                        token: tokens.idToken
                    });

                    setApiClient(client);

                    user.then((u) => {
                        if (!hasAuthUser) {

                            console.log("Initial userState:", userState);
                            console.log("user type:", u.constructor.name);

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
                                } catch (e: any) {
                                    console.error(e);
                                }

                                setAuthenticatedUser(u);

                                // if (!!hasAuthClient) {
                                //
                                //     setState({
                                //         apiClient: client,
                                //         authenticated_user: u,
                                //         baseURL: BASE_URL,
                                //         token: tokens.idToken
                                //     });
                                // }
                            }

                            updateUser(u);
                        }
                    });
                }
            }
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
