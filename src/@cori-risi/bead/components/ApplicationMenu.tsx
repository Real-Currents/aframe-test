import { useContext, useEffect } from "react";
import { Card } from "@aws-amplify/ui-react";
import { debounce } from "@mui/material/utils";
import { ApiContext } from "../../contexts/ApiContextProvider";
import { MDAPrinter } from "./MDAPrinter";
import { MDADownloader } from "./MDADownloader";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/index";
import User from '../../models/User';

import "./styles/ApplicationMenu.scss";


function ApplicationMenu () {

    const apiContext = useContext(ApiContext);
    const userState: User | null = useSelector(selectUser);

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

    useEffect(() => {

        if (apiContext.hasOwnProperty("apiClient") && apiContext.apiClient !== null
            && apiContext.hasOwnProperty("token") && apiContext.token !== null
        ) {
            // console.log("API Context state: ", apiContext);

            const apiClient = apiContext.apiClient!,
                authenticated_user = apiContext.authenticated_user!,
                token = apiContext.token!;

            // debounce(async () => {
                console.log("authenticated_user: ", authenticated_user);
                console.log("token: ", token);

                apiClient.get("/rest/bead/isp_tech?geoid_bl=010010201001003")
                    .then(response => {
                        console.log("API responds to RESTful request for all isp tech available at given block ID:", response.data);
                    })
                    .catch(error => {
                        if (error.code === 'ERR_NAME_NOT_RESOLVED') {
                            console.error('Invalid baseURL:', apiClient.defaults.baseURL);
                            // Handle invalid baseURL error
                        } else {
                            console.log(error.toString());
                        }
                    });
            // });
        }
    }, [ apiContext ]);


            return (
        <Card id={"application-menu"} style={{ minWidth: "254px" }}>

            {(userState !== null) ? (
                <div><span className={"form-label"}>User</span>: { getUserLabel(userState) }</div>
            ) : (
                <div style={{ display: "none" }} />
            )}

            <h4>MDA (Map & Data Analysis) Options</h4>

            <br />

            <MDADownloader />

            <MDAPrinter />

        </Card>
    );
}

export default ApplicationMenu;
