import {Button, Card} from "@aws-amplify/ui-react";
import "./styles/ApplicationMenu.scss";
import {useState} from "react";


function ApplicationMenu () {

    // const userState: User = useSelector(selectUser);

    function showPrintOptions() {
        try {
            const print_config_form = document.getElementById("print-config")!;
            print_config_form.className = "show";
            const print_config_button = document.getElementById("print-config-btn")!;
            print_config_button.className = "amplify-button hide";
        } catch (e: unknown) {}
    }

    /*
     * High-res map rendering
     * based on ...
     *
     * mpetroff/print-maps
     * https://github.com/mpetroff/print-maps
     *
     * -----LICENSE------
     * Print Maps - High-resolution maps in the browser, for printing
     * Copyright (c) 2015-2020 Matthew Petroff
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */

    //
    // Inputs
    //

    type Inputs = {
        width: string,
        height: string,
        dpi: string,
        // format: string,
        // unit: string,
        // style: string
    };
    const [ inputs, setInputs ] = useState<Inputs>({
        width: "8",
        height: "6",
        dpi: "300",
        // format: "png",
        // unit: "in",
        // style: "mapbox://styles/ruralinno/clhgnms6802i701qn0c9y0pow"
    });

    //
    // Errors
    //

    // const errors: Errors = {
    //     width: {
    //         state: false,
    //         msg: 'Width must be a positive number!',
    //         grp: 'widthGroup'
    //     },
    //     height: {
    //         state: false,
    //         grp: 'heightGroup'
    //     },
    //     dpi: {
    //         state: false,
    //         msg: 'DPI must be a positive number!',
    //         grp: 'dpiGroup'
    //     }
    // };

    type ErrorState = {
        state: boolean,
        msg: string,
        grp: string
    };
    type InputErrors = {
        [input: string]: ErrorState,
        width: ErrorState,
        height: ErrorState,
        dpi: ErrorState
    };
    type Errors = Partial<Record<keyof InputErrors, string>>;
    const [ errors, setErrors ] = useState<Errors>(validate(inputs));
    // const errors: Errors ={
    //     width:  {
    //         state: false,
    //         msg: 'Width must be a positive number!',
    //         grp: 'widthGroup'
    //     },
    //     height: {
    //         state: false,
    //         msg: 'Height must be a positive number!',
    //         grp: 'heightGroup'
    //     },
    //     dpi: {
    //         state: false,
    //         msg: 'DPI must be a positive number!',
    //         grp: 'dpiGroup'
    //     }
    // };

    function isError(inputName?: string): boolean {
        'use strict';

        if (!!inputName) {
            return (errors[inputName] && !! errors[inputName].state && touched[inputName]) ?
                <p className={"form-error"}>{errors[inputName].msg}</p> :
                null
        } else for (let e in errors) {
            if (errors[e].state) {
                return true;
            }
        }
        return false;
    }

    //
    // Validate "touched" inputs
    //

    type Touched = Partial<Record<keyof Inputs, boolean>>;
    const [ touched, setTouched ] = useState<Touched>({});

    function validate (newInputs: Inputs): Errors {
        const newErrors: Errors = {};

        newErrors.width = {
            state: (parseInt(newInputs.width) !== parseInt(newInputs.width)
                || parseInt(newInputs.width) < 0
            ),
            msg: 'Width must be a positive number!',
            grp: 'widthGroup'
        };

        newErrors.height = {
            state: (parseInt(newInputs.height) !== parseInt(newInputs.height)
                || parseInt(newInputs.height) < 0
            ),
            msg: 'Height must be a positive number!',
            grp: 'heightGroup'
        };

        newErrors.dpi = {
            state: (parseInt(newInputs.dpi) !== parseInt(newInputs.dpi)
                || parseInt(newInputs.dpi) < 0
            ),
            msg: 'DPI must be a positive number!',
            grp: 'dpiGroup'
        };

        console.log("Errors: ", newErrors);

        return newErrors;
    }

    //
    // Generate printable map rendering
    //

    function generatePrintMap (element, map) {

        if (isError()) {
            console.error('The current configuration is invalid! Please ' +
                'correct the errors and try again.');
            return;
        }

        const form = document.getElementById('print-config');

        // document.getElementById('spinner').style.display = 'inline-block';
        document.getElementById('generate-btn').classList.add('disabled');

        const width = Number(form.widthInput.value);
        const height = Number(form.heightInput.value);

        const dpi = Number(form.dpiInput.value);

        const format = form.outputOptions[0].checked ? 'png' : 'pdf';

        const unit = form.unitOptions[0].checked ? 'in' : 'mm';

        const style = form.styleSelect.value;

        const zoom = map.getZoom();
        const center = map.getCenter();
        const bearing = map.getBearing();
        const pitch = map.getPitch();

        const printHandler = () => {
            createPrintMap(map, width, height, dpi, format, unit, zoom, center,
                bearing, style, pitch, element);
            map.off('idle', printHandler);
        };

        map.on('idle', printHandler);

        map.flyTo({ // flyTo is a shortcut for zoomTo + panTo
            center: center,
            zoom: zoom
        });
    }

//
// Helper function
//

    function toPixels(length) {
        'use strict';

        const form = document.getElementById('print-config');
        const unit = form.unitOptions[0].checked ? 'in' : 'mm';
        let conversionFactor = 96;
        if (unit == 'mm') {
            conversionFactor /= 25.4;
        }

        return conversionFactor * length + 'px';
    }

    function createPrintMap(map, width, height, dpi, format, unit, zoom, center,
                                   bearing, style, pitch, element) {
        'use strict';

        // Calculate pixel ratio
        const actualPixelRatio = window.devicePixelRatio;
        Object.defineProperty(window, 'devicePixelRatio', {
            get: function() {return dpi / 96}
        });

        // Create map container
        const hidden = document.createElement('div');
        hidden.className = 'hidden-map';
        document.body.appendChild(hidden);
        const container = document.createElement('div');
        container.style.width = toPixels(width);
        container.style.height = toPixels(height);
        hidden.appendChild(container);

        map.getCanvas().toBlob(function(blob) {

            const map_container = document.getElementsByClassName("mapboxgl-canvas-container")[0];
            const url = URL.createObjectURL(blob);

            const newImg = document.createElement("img");

            newImg.id = "image";

            // console.log(newImg.src);

            if (!!newImg.src) {

                newImg.src = url;

            } else {

                newImg.onload = () => {

                    // window.saveAs(blob, 'map.png');

                    // no longer need to read the blob so it's revoked
                    URL.revokeObjectURL(url);
                };
                newImg.style = "width: 100%;"

                newImg.src = url;
            }

            element.prepend(newImg);

            map_container.style = "display:none";
            window.addEventListener("afterprint", (event) => {
                console.log("After print");
                map_container.style = "display: block";
                newImg.remove();
            });

            setTimeout(print, 253);
        });
    }

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

            <a id={"data-download-link"}>
                <button type="submit" className={"amplify-button amplify-field-group__control amplify-button--primary amplify-button--fullwidth btn btn-primary btn-lg"} id={"data-download-btn"}>
                    Download data
                </button>
            </a>

            <div id={"print-exec"} className="row">
                <Button type="submit"  id={"print-config-btn"}
                        className={"amplify-button amplify-field-group__control amplify-button--primary amplify-button--fullwidth btn btn-primary btn-lg"}
                        onClick={showPrintOptions}>
                    Show print options
                </Button>

                {/* Print config form */}

                <form id={"print-config"}>
                    <fieldset id="config-fields">
                        <div style={{ display: "none" }}>
                            <br/>
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <label className={"form-label"}>Unit: </label>{/*<br />*/}
                                    <label className="radio-inline">
                                        <input type="radio" name="unitOptions" value="in" id="inUnit" checked readOnly /> Inch
                                    </label>
                                    <label className="radio-inline">
                                        <input type="radio" name="unitOptions" value="mm" id="mmUnit" readOnly /> Millimeter
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="form-group">
                                    <label className={"form-label"}>Output: </label>{/*<br />*/}
                                    <label className="radio-inline">
                                        <input type="radio" name="outputOptions" value="png" checked readOnly /> PNG
                                    </label>
                                    <label className="radio-inline">
                                        <input type="radio" name="outputOptions" value="pdf" readOnly /> PDF
                                    </label>
                                </div>
                            </div>
                        </div>

                        <br />

                        <div className="col-sm-5">
                            <div className={"form-group"}>
                                <label className={"form-label"} htmlFor="styleSelect">Map style</label>
                                <select id="styleSelect" className="form-control">
                                    <option value="mapbox://styles/ruralinno/clhgnms6802i701qn0c9y0pow">CORI/RISI Assessment Map</option>
                                    <option value="mapbox://styles/ruralinno/cjyhquqe607y91cmjkhg30fa4">CORI Light Map</option>
                                    <option value="mapbox://styles/ruralinno/ck8gnm7b70eo21jp29fvcq1k1">CORI Monochrome Map</option>
                                    <option value="mapbox://styles/ruralinno/ckmxgvwii0tn317o6nt0reg27">CORI Satellite Fade/Zoom</option>
                                    <option value="mapbox://styles/mapbox/light-v9">Mapbox Light</option>
                                    <option value="mapbox://styles/mapbox/streets-v10">Mapbox Streets</option>
                                    {/*<option value="https://tiles.stadiamaps.com/styles/alidade_smooth.json">Stadia Maps Alidade Smooth</option>*/}
                                    {/*<option value="https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json">Stadia Maps Alidade Smooth Dark</option>*/}
                                    {/*<option value="https://tiles.stadiamaps.com/styles/outdoors.json">Stadia Maps Outdoors</option>*/}
                                    {/*<option value="https://tiles.stadiamaps.com/styles/osm_bright.json">Stadia Maps OSM Bright</option>*/}
                                </select>
                            </div>
                            <div className={"form-group"}>
                                <div className="col-sm-4">
                                    <div className="form-group" id="latGroup">
                                        <label className={"form-label"} htmlFor="latInput">Latitude</label>
                                        <input type="text" className="form-control" id="latInput" autoComplete="off"
                                               readOnly value="" />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group" id="lonGroup">
                                        <label className={"form-label"} htmlFor="lonInput">Longitude</label>
                                        <input type="text" className="form-control" id="lonInput" autoComplete="off"
                                               readOnly value="" />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group" id="zoomGroup">
                                        <label className={"form-label"} htmlFor="zoomInput">Zoom</label>
                                        <input type="text" className="form-control" id="zoomInput" autoComplete="off"
                                               readOnly value="" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <br />

                        <div>
                            <div className="col-sm-4">
                                <div className="form-group" id="widthGroup">
                                    <label className={"form-label"} htmlFor="widthInput">Width (inches)</label>
                                    <input type="text" className="form-control" id="widthInput" autoComplete="off"
                                           minLength="1" maxLength="2"
                                           onBlur={ (event) => {
                                               setTouched({ ...touched, width: true })
                                           }}
                                           onChange={event => {
                                               setInputs({ ...inputs, width: event.target.value })
                                               setErrors(
                                                   validate({ ...inputs, width: event.target.value })
                                               )
                                           }}
                                           value={inputs.width} />
                                    { isError("width") }
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="form-group" id="heightGroup">
                                    <label className={"form-label"} htmlFor="heightInput">Height (inches)</label>
                                    <input type="text" className="form-control" id="heightInput" autoComplete="off"
                                           minLength="1" maxLength="2"
                                           onBlur={ (event) => {
                                               setTouched({ ...touched, height: true })
                                           }}
                                           onChange={event => {
                                               setInputs({ ...inputs, height: event.target.value })
                                               setErrors(
                                                   validate({ ...inputs, height: event.target.value })
                                               )
                                           }}
                                           value={inputs.height} />
                                    { isError("height") }
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="form-group" id="dpiGroup">
                                    <label className={"form-label"} htmlFor="dpiInput">DPI</label>
                                    <input type="text" className="form-control" id="dpiInput" autoComplete="off"
                                           minLength="2" maxLength="3"
                                           onBlur={ (event) => {
                                               setTouched({ ...touched, dpi: true })
                                           }}
                                           onChange={event => {
                                               setInputs({ ...inputs, dpi: event.target.value })
                                               setErrors(
                                                   validate({ ...inputs, dpi: event.target.value })
                                               )
                                           }}
                                           value={inputs.dpi} />
                                    { isError("dpi") }
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>

                <button type="submit" className={"amplify-button amplify-field-group__control amplify-button--primary amplify-button--fullwidth btn btn-primary btn-lg"} id={"generate-btn"}>
                    Print Map & Data Analysis
                </button>
                <div id='spinner' />
            </div>

        </Card>
    );
}

export default ApplicationMenu;
