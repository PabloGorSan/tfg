import { Fragment, useState } from "react";
import {Button, Form} from "react-bootstrap"

export function AlgorithmDetails(props){

    const [validated, setValidated] = useState(props.data['validated'])

    const [algorithmData, setAlgorithmData] = useState(props.data)
    
    function handleSubmit(){
        setValidated(!validated)
        var fetchURL = "http://localhost:5000/changeValidation?id=" + props.algorithmID + "&validated=" + !validated + "&table=algorithms"
        fetch(fetchURL,
            {
                method: 'GET'
            }
        ).then(response => response.json())
        .then(data => setAlgorithmData(data))
    }
    
    return(
        <Fragment>
            <h2>Datos del algorithmo</h2>
            <div>
                <p>Nombre publico: {algorithmData['name']}</p>
                <p>Nombre del archivo: {algorithmData['filename']}</p>
                <p>Tipo de canal: {algorithmData['channel']}</p>
                <p>Tecnologia: {algorithmData['type']}</p>
                <p>Tamaño de imagenes: {algorithmData['x']}px, {algorithmData['y']}px</p>
                <p>Validado: {algorithmData['validated'] === true ? "Si" : "No"}</p>
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