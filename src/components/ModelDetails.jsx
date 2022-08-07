import { Fragment, useState } from "react";
import {Button, Form} from "react-bootstrap"

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

    return(
        <Fragment>
            <h2>Datos del Modelo</h2>
            <div>
                <p>Nombre publico: {modelData['name']}</p>
                <p>Tipo de canal: {modelData['channel']}</p>
                <p>Tecnologia: {modelData['type']}</p>
                <p>Tamaño de imagenes: {modelData['x']}px, {modelData['y']}px</p>
            </div>
            {props.validateButton &&
            <div>
                {validated
                    ? <Button variant="danger" onClick={handleSubmit}>Unvalidate</Button>
                    : <Button variant="success" onClick={handleSubmit}>Validate</Button>
                }
            </div>
            }
        </Fragment>
    )
}