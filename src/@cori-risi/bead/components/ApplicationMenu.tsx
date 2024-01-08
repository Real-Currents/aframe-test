import {Button, Card} from "@aws-amplify/ui-react";
import "./styles/ApplicationMenu.scss";
import {useState} from "react";
import { MDAPrinter } from "./MDAPrinter";
import { MDADownloader } from "./MDADownloader";


function ApplicationMenu () {

    // const userState: User = useSelector(selectUser);

    function convertScoreToRating(score) {

        if (score === 100) {
            return 5;
        }

        let value = Math.floor(score/20) + 1;
        return value;
    }

    function scrollToTop() {
        window.scrollTo(0, 0);
    }

    function convertToCSV(arr) {
        const array = [Object.keys(arr[0])].concat(arr)

        return array.map(it => {
            return Object.values(it).toString()
        }).join('\n')
    }

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
