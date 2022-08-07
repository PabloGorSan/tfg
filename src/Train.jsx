import { Fragment, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { ClassifierList } from "./components/ClassifierList";
import { useNavigate } from "react-router-dom"
import useFetch

from "./components/useFetch";
export default function Train(){

    const navigate = useNavigate()

    const { data: modelsFetch, errorModel, isPendingModel } = useFetch('http://127.0.0.1:5000/findAllowedModels/'+localStorage['user']+"?forceValidated=false")
    
    const [selectedModel, setSelectedModel] = useState({id: ""})
	const [isModelPicked, setIsModelPicked] = useState(false)

    function changeModelHandler(model) {
		setSelectedModel(model)
		setIsModelPicked(true)
	};

    function handleSubmit(datasetID){
        const formData = new FormData();
		formData.append('datasetID', datasetID)
        formData.append('modelID', selectedModel.id)

        fetch(
            "http://localhost:5000/trainModel",
            {
            method: 'POST',
            body: formData,
            }
        )
        .then(response => response.json())
        .then(data => console.log(data))
    }

    return(
        <Fragment>
            <h2>Train your own model</h2>
            <p>Select the model yout want to train. It will display the available datasets for it. It may occur that your model is not suitable to be train with any of our datasets.</p>

            { modelsFetch && 
            <div>
                <h3>Select a model</h3>
                {<ClassifierList models={modelsFetch} clickAction={changeModelHandler}/> }
            </div>
            }
            <br/>
            {isModelPicked && 
            <div>
                <h3>Select a dataset</h3>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>ISIC_2020_corrected</Card.Title>
                        <Card.Text>El dataset basico</Card.Text>
                        {selectedModel['datasets'].includes("OxAY0TGrGfi1OReQbHT2") && <Button variant="primary" onClick={() => handleSubmit("OxAY0TGrGfi1OReQbHT2")}>Train!</Button>}
                        {!selectedModel['datasets'].includes("OxAY0TGrGfi1OReQbHT2") && <Button variant="primary" disabled>Dataset Not Allowed</Button>}
                    </Card.Body>
                </Card>
            </div>}
        </Fragment>
    )
}