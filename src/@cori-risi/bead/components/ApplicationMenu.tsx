import { Card } from "@aws-amplify/ui-react";
import { MDAPrinter } from "./MDAPrinter";
import { MDADownloader } from "./MDADownloader";
import "./styles/ApplicationMenu.scss";


function ApplicationMenu () {

    // const userState: User = useSelector(selectUser);

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
