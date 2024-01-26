import { useContext, useEffect } from "react";
import { Card } from "@aws-amplify/ui-react";
import { debounce } from "@mui/material/utils";
import { ApiContext } from "../../contexts/ApiContextProvider";
import { MDAPrinter } from "./MDAPrinter";
import { MDADownloader } from "./MDADownloader";
import "./styles/ApplicationMenu.scss";


function ApplicationMenu () {

    // const userState: User = useSelector(selectUser);

    const apiContext = useContext(ApiContext);

    useEffect(() => {

        if (apiContext.hasOwnProperty("apiClient") && apiContext.apiClient !== null) {
            // console.log("API Context state: ", apiContext);

            const apiClient = apiContext.apiClient!,
                authenticated_user = apiContext.authenticated_user!,
                token = apiContext.token!;

            // debounce(async () => {
                console.log("authenticated_user: ", authenticated_user);
                console.log("token: ", token);

                apiClient.get("/rest/bead/isp_tech/bl?geoid_bl=010010201001003")
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

            <h4>MDA (Map & Data Analysis) Options</h4>

            <br />

            <MDADownloader />

            <MDAPrinter />

        </Card>
    );
}

export default ApplicationMenu;
