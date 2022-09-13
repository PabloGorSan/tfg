import { Fragment, useState } from "react";
import { Card, Button, Container } from "react-bootstrap";
import { ClassifierList } from "./components/ClassifierList";
import { useNavigate } from "react-router-dom"
import useFetch

from "./components/useFetch";
import { TrainModal } from "./components/TrainModal";
export default function Train(){

    const navigate = useNavigate()

    const { data: modelsFetch, errorModel, isPendingModel } = useFetch('http://127.0.0.1:5000/findAllowedModels/'+localStorage['user']+"?forceValidated=false")
    
    const [selectedModel, setSelectedModel] = useState({id: ""})
	const [isModelPicked, setIsModelPicked] = useState(false)
    const [modalShow, setModalShow] = useState(false)

    function changeModelHandler(model) {
		setSelectedModel(model)
		setIsModelPicked(true)
	};

    function handleSubmit(datasetID){
        const formData = new FormData();
		formData.append('datasetID', datasetID)
        formData.append('modelID', selectedModel.id)
        setModalShow(true)

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

    function goToSearch(){
        navigate("/model/" + selectedModel.id)
    }

    return(
        <Fragment>
            <h2>Train your own model</h2>
            <Container id = "classify-container">
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
                        <Card.Title>ISIC_2020_shorted</Card.Title>
                        <Card.Text>Skin dataset with 2320 photos</Card.Text>
                        {selectedModel['datasets'].includes("OxAY0TGrGfi1OReQbHT2") && <Button variant="primary" onClick={() => handleSubmit("OxAY0TGrGfi1OReQbHT2")}>Train!</Button>}
                        {!selectedModel['datasets'].includes("OxAY0TGrGfi1OReQbHT2") && <Button variant="primary" disabled>Dataset Not Allowed</Button>}
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>ISIC_2020_complete</Card.Title>
                        <Card.Text>Skin dataset with 23189 photos</Card.Text>
                        {selectedModel['datasets'].includes("FBQmEEmaukLgFuD4Qdh9") && <Button variant="primary" onClick={() => handleSubmit("FBQmEEmaukLgFuD4Qdh9")}>Train!</Button>}
                        {!selectedModel['datasets'].includes("FBQmEEmaukLgFuD4Qdh9") && <Button variant="primary" disabled>Dataset Not Allowed</Button>}
                    </Card.Body>
                </Card>
            </div>}
            <br/>
            </Container>
            <TrainModal show={modalShow} onHide={()=>goToSearch()}/>
        </Fragment>
    )
}