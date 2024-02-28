import React, {ReactElement, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import PropTypes from "prop-types";
import {Amplify, ResourcesConfig} from "aws-amplify";

import amplifyconfig from './amplifyconfiguration.json';
import aws_config from './aws-config';
import App from './@cori-risi/bead/App.tsx';

import mapboxgl from 'mapbox-gl';

import 'normalize.css';
import './fonts.css';
import './@cori-risi/bead/components/styles/images/loading.gif';
import './@cori-risi/bead/components/styles/CustomAmplifyAuthenticator.css';
// import { Map } from 'mapbox-gl';
// import { MapRef } from "react-map-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

Amplify.configure(amplifyconfig);

// const update_config: ResourcesConfig = {
Amplify.configure({
    // TODO: Why is this so ridiculous and how can these options be
    //       specified exclusively in amplifyconfiguration.json ???
    ...Amplify.getConfig(),
    Auth: {
        ...Amplify.getConfig().Auth!,
        Cognito: {
            ...Amplify.getConfig().Auth!.Cognito!,
            ...aws_config.Auth,
            loginWith: {
                ...Amplify.getConfig().Auth!.Cognito!.loginWith!,
                oauth: {
                    ...Amplify.getConfig().Auth!.Cognito!.loginWith!.oauth!,
                    ...aws_config.Auth.oauth,
                    redirectSignIn: [
                        aws_config.Auth.oauth.redirectSignIn
                    ],
                    redirectSignOut: [
                        aws_config.Auth.oauth.redirectSignOut
                    ],
                    responseType: (aws_config.Auth.oauth.responseType as "code"),
                    scopes: [
                        ...aws_config.Auth.oauth.scope
                    ]
                },
                username: true,
            },
            userPoolClientId: aws_config.Auth.clientId
        }
    }
});
// };
// console.log(update_config);
// Amplify.configure(update_config);


const init_event = new Event("Initialize frontend app!");

function initMain (evt: Event) {
    const react_app_id: string = 'react-app';
    const react_app_container: HTMLElement = document.getElementById(react_app_id) || document.createElement("div");
    react_app_container.id = 'react-app';
    const root_content: HTMLElement = document.createElement("div");


    if (document.getElementById("loader") !== null) {
        document.getElementById("loader")!.remove();
    }

    initHeader(evt);

    for (const elm of react_app_container.childNodes) {
        const innerElm: HTMLElement = elm as HTMLElement;
        if (elm.nodeType === 1) {
            // console.log("Found embedded content:", innerElm);

            // if (innerElm.id === "map") {
            //     //
            //     // MapBox test map
            //     //
            //     const map: Map = new mapboxgl.Map({
            //         container: 'map', // container ID
            //         style: 'mapbox://styles/ruralinno/clhgnms6802i701qn0c9y0pow', // style URL
            //         center: [-74.5, 40], // starting position [lng, lat]
            //         zoom: 9 // starting zoom
            //     });
            //
            //     (map as { [key: string]: any })["map"] = map;
            //
            //     (window as { [key: string]: any })["map"] = (map as unknown) as MapRef;
            // }

            root_content.appendChild(innerElm);
        }
    }

    console.log("Found embedded content:", root_content);

    const root = ReactDOM.createRoot(react_app_container!);
    root.render(
        <React.StrictMode>
            <OfflineNotification>
                <PrivacyAuthenticator>
                    {/*<App />*/}
                    <App app_id={react_app_id}
                         content={() => root_content} />
                </PrivacyAuthenticator>
            </OfflineNotification>
        </React.StrictMode>
    );

    react_app_container.style.opacity = "1.0";
};

/**TODO:
 * To enable the following React header component, go into the index.html file and change the id
 * of the first div to "react-header" and comment out the cori.apps "src/bundle.js" script tag
 * that is just before the "src/main.tsx" script tag near the closing body tag.
 */
function initHeader (evt: Event) {
    const header_id = 'react-header';
    const header: HTMLElement | null = document.getElementById(header_id);

    if (header !== null && header.constructor.name === "HTMLDivElement") {
        ReactDOM.createRoot(header)
            .render(
                <React.StrictMode>
                    <header style={{ position: "fixed", top: 0, left: 0, maxWidth: "100%", width: "100vw", maxHeight: "108px", height: "75px", zIndex: 1 }}>
                        <nav>
                            <div>
                                <div style={{ display: "inline-block" }}>
                                    <a href="/"><h2>{header.title}</h2></a>
                                </div>
                                <div title="Search" style={{ display: "inline-block", float: "right" }}>
                                    <div role="combobox" aria-expanded="false" aria-haspopup="listbox">
                                        <button type="button">
                                            <div style={{ display: "inline-block" }}><label>Search</label></div>
                                            <div style={{ display: "inline-block" }}>
                                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path></svg>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </header>
                </React.StrictMode>
            );
    }
}

function OfflineNotification (props: { children?: ReactElement }) {
    console.log(`VITE_OFFLINE_NOTIFICATION: ${import.meta.env.VITE_OFFLINE_NOTIFICATION}`)
    if (import.meta.env.VITE_OFFLINE_NOTIFICATION !== "false") {
        return <div className="offline-notification"
                    dangerouslySetInnerHTML={{
                        __html: import.meta.env.VITE_OFFLINE_NOTIFICATION
                    }}
                    style={{height: "calc(100vh - 290px)", padding: "25%"}} />
    } else return props.children;
}

OfflineNotification.propTypes = { children: PropTypes.node };

function PrivacyAuthenticator (props: { children?: ReactElement }) {

    useEffect(() => {
        // Logic derived from autoSignIn function
        console.log("Set credentials for auto sign in");

        setTimeout(() => {
            // form data-amplify-form="" data-amplify-authenticator-signin="" method="post"
            const amplifyAuthenticatorForm: HTMLFormElement | null = document.querySelector('form[data-amplify-form]');
            if (amplifyAuthenticatorForm !== null) {

                const signInButton: HTMLButtonElement | null = amplifyAuthenticatorForm.querySelector('.amplify-button[type="submit"]');
                if (signInButton !== null && signInButton.innerHTML === "Sign in") {
//                     signInButton.innerHTML = "OK";
//                     signInButton.style.display = "inline-flex";
//                     signInButton.style.color = "#16343e";
//                     signInButton.style.cursor = "pointer";
//                     signInButton.style.background = "#a3e2b5";
//                     signInButton.style.borderRadius = "50px";
//                     signInButton.style.padding = "13px 50px";
//                     signInButton.style.maxHeight = "48px";
//                     signInButton.style.minHeight = "48px";
//                     signInButton.style.maxWidth = "268px";
//                     signInButton.style.minWidth = "198px";
//                     signInButton.style.textDecoration = "none";
//
//                     // align-content: center;
//                     // justify-content: center;
//                     // justify-items: center;
//                     // align-items: center;
//                     // text-align: center;
//                     // white-space: nowrap;

                    const usernameInput: HTMLInputElement | null = amplifyAuthenticatorForm.querySelector('.amplify-textfield .amplify-field-group div .amplify-input[name="username"]');
                    if (usernameInput !== null) {
                        usernameInput.value = import.meta.env.VITE_APP_USERNAME;
                    }
                    const passwordInput: HTMLInputElement | null = amplifyAuthenticatorForm.querySelector('.amplify-textfield .amplify-field-group div .amplify-input[name="password"]');
                    if (passwordInput !== null) {
                        passwordInput.value = import.meta.env.VITE_APP_PASSWORD;
                    }

                    if (document.getElementById("privacy-info") === null) {
                        const privacyInformation = document.createElement("div");
                        privacyInformation.id = "privacy-info"
                        privacyInformation.innerHTML = `
                    <p></p>
                    <p>This Site uses cookies to offer you a better browsing experience and to analyze Site
                        traffic. By continuing to access the Site, you consent to our use of cookies and storage and use of
                        your data as provided in our <a href="http://ruralinnovation.us/privacy-policy/" target="_blank">Privacy Policy</a>.
                    </p>
                    <p></p>
`

                        const footerLoader: HTMLDivElement | null = document.querySelector('[data-amplify-footer]');
                        if (footerLoader !== null) {
                            footerLoader.style.background = "none";
                            (footerLoader).after(privacyInformation);
                        // } else {
                        //     // console.log(amplifyAuthenticatorForm.children[0].children[0]);
                        //     // (amplifyAuthenticatorForm.children[0].children[0]).after(privacyInformation);
                        }
                    }
                }
            }
        }, 1533);
    })

    // if (import.meta.env.VITE_OFFLINE_NOTIFICATION !== "false") {
        return (
            <div className={"app-with-authenticator"}>
                {props.children}
            </div>
        )
    // } else return props.children;
}

PrivacyAuthenticator.propTypes = { children: PropTypes.node };

initMain(init_event);
