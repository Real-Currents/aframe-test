import { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "@aws-amplify/auth/cognito";
import {
    Button,
    Flex,
    // Heading,
    // Image,
    // Text,
    withAuthenticator,
    useAuthenticator,
    UseAuthenticator
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import ApplicationMenu from "./components/ApplicationMenu";
import './components/styles/ApplicationMenu.scss';

import Interface from './components/Interface';

import User from '../models/User';
import {
    updateUserId,
    updateUserName,
    selectUser
} from "../features";

function getUserLabel (u: User) {
    return (u.hasOwnProperty("signInUserSession")
        && !!u.signInUserSession
        && u.signInUserSession.hasOwnProperty("idToken")
        && u.signInUserSession?.idToken.hasOwnProperty("payload")
    ) ? (
            (u.signInUserSession?.idToken.payload.hasOwnProperty("name") && !!u.signInUserSession?.idToken.payload.name) ?
                u.signInUserSession?.idToken.payload.name :
                (u.signInUserSession?.idToken.payload.hasOwnProperty("email") && !!u.signInUserSession?.idToken.payload.email) ?
                    u.signInUserSession?.idToken.payload.email :
                    u.username
        ) :
        (u.hasOwnProperty("email") && !!u.email) ?
            u.email :
            u.username
}

function App ({ app_id, content, user }: { app_id: string, content: () => HTMLElement, user: Promise<User> }): ReactElement {

    (function init () {
        // Check access to react/vite environment variables
        console.log("Welcome to Amplify React app version:", import.meta.env.VITE_APP_VERSION);
        // console.log(aws_config);
    }());

    const allowMenuToBeClosed = false;
    const [ controlPanelOpen, setControlPanelOpen ] = useState<boolean>(!allowMenuToBeClosed);
    const [ showMenuButton, setShowMenuButton ] = useState<boolean>(!!allowMenuToBeClosed);

    let content_loaded = false;

    const [ windowWidth, setWidth ]   = useState<number>(0);
    const [ windowHeight, setHeight ] = useState<number>(0);
    const [ windowRatio, setRatio ] = useState<number>(0);

    const userState: User = useSelector(selectUser);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("Initial userState:", userState);
        console.log("user type:", user.constructor.name);
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
        }
        if (user.hasOwnProperty("then")) {
            user.then(u => updateUser(u));
        } else {
            const u = (user as unknown) as User;
            updateUser(u);
        }
    }, [ user ]);

    function addContentToCurrentComponent () {
        if (!content_loaded) {
            // Anything in here is fired on component mount.
            const app_container = document.getElementById(app_id) ;
            if (!!app_container) {
                const app_content = (typeof content === 'function') ?
                    content() :
                    { childNodes: [] };
                setTimeout((container) => {
                    // console.log("Will append content: ", app_content);
                    // container.append(app_content.childNodes);
                    app_content.childNodes.forEach((c: ChildNode) => {
                        if (c.nodeType === 1) {
                            const element: HTMLElement = c as HTMLElement;
                            container.insertAdjacentElement('beforeend', element);
                        }
                    });
                }, 53, app_container);
                content_loaded = true;
            }
        }
    }

    useEffect( addContentToCurrentComponent , []);

    function updateWindowDimensions () {
        if (!!window &&
            window.hasOwnProperty("innerWidth") &&
            window.hasOwnProperty("innerHeight")
        ) {
            console.log("Update width to: " + window.innerWidth);
            setWidth(window.innerWidth);
            console.log("Update height to: " + window.innerHeight);
            setHeight(window.innerHeight);
            console.log("Update height/width ratio to: " + window.innerHeight/window.innerWidth);
            setRatio(window.innerHeight/window.innerWidth);
            setTimeout(() => {
                console.log({windowWidth, windowHeight, windowRatio})
            });

            if (window.innerWidth < 960) {
                setShowMenuButton(true);

            } else if (!!allowMenuToBeClosed) {
                setShowMenuButton(true);

            } else {
                setControlPanelOpen(true);
                setShowMenuButton(false);
            }
        }
    }

    useEffect(() => {
        window.addEventListener("load", updateWindowDimensions);
        window.addEventListener("resize", updateWindowDimensions);
        return () => window.removeEventListener("resize", updateWindowDimensions);
    }, []);


    function toggleControlPanel () {
        setControlPanelOpen(!controlPanelOpen);
    }

    return (
        <>
            <div className="App">
                <Interface />         
            </div>

        </>
    );
}

// export default App;
export default withAuthenticator(App, {
    loginMechanisms: ['username']
});

function ControlPanel (props: {
    children?: ReactElement,
    open?: boolean | true,
    showMenuButton?: boolean | null,
    toggleFunction?: Function | null,
    signOut?: Function | null,
    user?: Promise<User> | null
}) {
    const authenticator: UseAuthenticator = useAuthenticator();
    const { signOut } = (props.hasOwnProperty("signOut") && props.signOut !== null) ?
        { signOut: props.signOut } :
        authenticator;
    const [ open, setOpen ] = (props.hasOwnProperty("open") && typeof props.open === "boolean") ?
        [ props.open, (v: boolean) => v ] :
        useState<boolean>(
            (props.hasOwnProperty("showMenuButton") && typeof props.showMenuButton === "boolean") ?
                !props.showMenuButton :
                false
        );
    const toggle: Function = (props.hasOwnProperty("toggleFunction") && props.toggleFunction !== null && !!props.toggleFunction) ?
        props.toggleFunction :
        () => {
            setOpen(!open);
        };
    const [ userState, setUserState ] = useState<User | null>(null);
    const user: Promise<User> = (props.hasOwnProperty("user") && props.user !== null && !!props.user) ?
        (props.hasOwnProperty("then")) ?
            props.user :
            Promise.resolve(props.user) :
        getCurrentUser();

    user.then(u => {
        if (userState === null) {
            console.log("AWS cognito user:", u);
            setUserState(u);
        }
    });

    return (
        <div className={open ? "control-panel": "control-panel closed"}>

            {(props.hasOwnProperty("showMenuButton") && !props.showMenuButton) ? (
                <div style={{ display: "none" }} />
            ): (

                <div className="menu-toggle col">
                    <a className="menu-toggle__control js-menu-control js-open-main-menu" role="button" >
                    <span id="mm-label" className="hamburger-control__label">
                      <span className="hamburger-control__open-label" aria-hidden={ (!open) } style={{ display: open ? "none" : "block" }} >
                        <span className="screen-reader-text"
                              onClick={() => toggle() }>Site Menu</span>
                      </span>
                      <span className="hamburger-control__close-label" aria-hidden={ open }>
                        <span className="screen-reader-text"
                              onClick={() => toggle() }>Close Menu</span>
                      </span>
                    </span>
                        <span className="hamburger-control" aria-hidden={ !open }>
                        <span className="hamburger-control__inner"/>
                        <span className="hamburger-control__inner"/>
                        <span className="hamburger-control__open" aria-hidden={ !open }
                              onClick={() => toggle() }
                              style={{ display: open ? "none" : "block"  }} >
                            <svg className="menu" width="20" height="18" viewBox="0 0 20 18" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g fill="#16343e">
                                    <rect y=".5" width="20" height="3" rx="1.5" />
                                    <rect y="7.5" width="20" height="3" rx="1.5" />
                                    <rect y="14.5" width="20" height="3" rx="1.5" />
                                </g><defs><clipPath id="clip0">
                                <path fill="#fff" transform="translate(0 .5)"
                                      d="M0 0h20v17H0z"/></clipPath></defs>
                            </svg>
                        </span>
                        <span className="hamburger-control__close" aria-hidden={ open }
                              onClick={() => toggle() }
                              style={{ display: open ? "block" : "none"  }} >
                            <svg className="menu-close" width="22" height="22" viewBox="0 0 22 22" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M3.304 20.801L11 13.104l7.698 7.697c.296.297.671.449 1.052.449.38 0 .756-.152 1.052-.449a1.459 1.459 0 000-2.104L13.104 11 20.8 3.303a1.459 1.459 0 000-2.104 1.46 1.46 0 00-2.104 0h0L11 8.898 3.301 1.2a1.46 1.46 0 00-2.103 0h0a1.46 1.46 0 000 2.104L8.834 11 1.2 18.697s0 0 0 0a1.458 1.458 0 00-.012 2.092c.255.326.713.461 1.064.461.38 0 .756-.152 1.052-.449h0z"
                                    fill="{!!light_on_dark ? '#fffff9' : '#16343e'}" stroke="#16343e"
                                />
                            </svg>
                        </span>
                    </span>
                    </a>
                </div>
            )}

            <div className={open ? "controls open": "controls"}
                 style={open ? {
                     maxWidth: "min-content",
                     paddingLeft: "56px",
                     paddingRight: "56px",
                     overflow: "scroll"
                 } : {
                     maxWidth: "0px",
                     padding: "0px",
                     overflow: "hidden"
                 }}>

                {(userState !== null) ? (
                    <div><span className={"form-label"}>User</span>: { getUserLabel(userState) }</div>
                ) : (
                    <div style={{ display: "none" }} />
                )}

                <p id="info">&nbsp;</p>

                { props.children }

                <div id={"auth-control"} className="row show">
                    {(signOut !== null && typeof signOut === "function") ? (
                        // <button id={"sign-out"} className={"amplify-button amplify-field-group__control amplify-button--primary amplify-button--fullwidth btn btn-primary btn-lg"} onClick={() => { autoSignIn(); signOut(); }}>Sign out</button>
                        <SignOutButton signOut={signOut} />
                    ) : (
                        <button>No Auth Controls</button>
                    )}
                </div>

            </div>
        </div>
    );
}

function SignOutButton ({ signOut }: { signOut: Function }) {
    return <Button className={"amplify-sign-out"} title="Sign Out" onClick={() => { signOut(); }}>Sign Out</Button>;
}
