import { Fragment, useState } from "react";
import {Button, Form, ListGroup, ListGroupItem} from "react-bootstrap"

export function ModelDetails(props){

    const [validated, setValidated] = useState(props.data['validated'])

    const [modelData, setModelData] = useState(props.data)

    function handleSubmit(){
        setValidated(!validated)
        var fetchURL = "http://localhost:5000/changeValidation?id=" + props.modelID + "&validated=" + !validated + "&table=models"
        fetch(fetchURL,
            {
                method: 'GET'
            }
        ).then(response => response.json())
        .then(data => setModelData(data))
    }

    function handleText(key, value){
        var resp = ""
        if(key == "channel"){
            switch(value){
                case 1: resp = "Grey Scale"; break;
                case 2: resp = "RGB"; break;
                case 3: resp = "BGR"; break;
            }
        }else if(key == "type") {
            switch(value){
                case 1: resp = "TensorFlow"; break;
            }
        } else if(key == "predictionFormat"){
            switch(value){
                case 1: resp = "Binary probability"; break;
                case 2: resp = "Multicategorical probability"; break;
                case 3: resp = "Integer encoding"; break;
                case 4: resp = "One-Hot encoding"; break;
            }
        } else if(key == "trained"){
            switch(value){
                case 2: resp = "Under Training"; break;
                case 1: resp = "Yes!"; break;
                case 0: resp = "No"; break;
            }
        } else if(key=="validated"){
            switch(value){
                case true: resp = "Yes!"; break;
                case false: resp = "Unvalidated";break;
            }
        } else if(key=="public"){
            switch(value){
                case 1: resp = "Public"; break;
                case 0: resp = "Private"; break;
            }
        }




        return resp
    }

    return(
        <Fragment>
            <div >
                <ListGroup as="ul">
                    <li>Public name: {modelData['name']}</li>
                    <li>Canal color: {handleText("channel", modelData['channel'])}</li>
                    <li>Technology: {handleText("type", modelData['type'])}</li>
                    <li>Prediction format: {handleText("predictionFormat", modelData['predictionFormat'])}</li>
                    <li>Is trained: {handleText("trained", modelData['trained'])}</li>
                    <li>Is validated: {handleText("validated", validated)}</li>
                    <li>Privacy: {handleText("public", modelData['public'])}</li>
                    <li>Image size: {modelData['x']}px, {modelData['y']}px</li>
                </ListGroup>
            </div>
            {props.validateButton &&
            <div className="validate-button">
                <hr></hr>
                <p>Classifier Validation</p>
                {validated
                    ? <Button variant="danger" onClick={handleSubmit}>Unvalidate</Button>
                    : <Button variant="success" onClick={handleSubmit}>Validate</Button>
                }
            </div>
            }
        </Fragment>
    )
}