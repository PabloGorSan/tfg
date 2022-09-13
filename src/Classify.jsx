import { Fragment, useState, useRef } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import Image from 'react-bootstrap/Image'
import useFetch from "./components/useFetch";
import { ClassifierList } from "./components/ClassifierList";
import {useNavigate} from "react-router-dom"
import { PredictionClass } from "./components/PredictionClass";

export default function Classify() {

    const navigate = useNavigate()

    const [selectedImage, setSelectedImage] = useState()
	const [isImagePicked, setIsImagePicked] = useState(false)

    const [selectedModel, setSelectedModel] = useState()
	const [isModelPicked, setIsModelPicked] = useState(false)

    const [classificationResult, setClassificationResult] = useState()

    const { data: modelsFetch, errorModel, isPendingModel } = useFetch('http://127.0.0.1:5000/findAllowedModels/'+localStorage['user']+"?forceValidated=true")

    const changeHandler = (event) => {
		setSelectedImage(event.target.files[0]);
		setIsImagePicked(true);
	};

    function changeModelHandler(model) {
		setSelectedModel(model)
		setIsModelPicked(true)
	};

    function submitClassify() {
        const formData = new FormData();
		formData.append('image', selectedImage)
        formData.append('modelID', selectedModel.id)

        fetch(
            "http://localhost:5000/classifyUsingModel",
            {
            method: 'POST',
            body: formData,
            }
        )
        .then(response => response.json())
        .then(data => setClassificationResult(data))
        
        //.then(data => navigate("/classDetails/"+data['classID'], {state:data}))

    }


    return(
        <Fragment>
            <h1>Classify</h1>
            <Row>

            <Col>
            <Container id = "classify-container">
                <Row>
                    <p>Here you can classify one image of your system using one of the classificators that are uploaded to the app.</p>
                    <p>If you want more information about them, go to the search option and select one to see it.</p>
                    <Col>
                    <h3>1. Select an image</h3>
                    <div>
                        <input type="file" name="image" accept="image/*" onChange={changeHandler} />
                        {isImagePicked &&
                            <div>
                                <Image src={URL.createObjectURL(selectedImage)} height={200} width={200} />
                            </div>                        
                        }
                    </div>
                    </Col>

                </Row>
                <Row id = "classify-row">
                    <Col>
                    {isImagePicked && (
                        <div>
                            <h3>2. Select a classificator</h3>
                            <ClassifierList models={modelsFetch} clickAction={changeModelHandler}/>
                        </div>
                    )}
                    </Col>
                </Row>
                <Row id = "classify-row">
                    <Col>
                    {isModelPicked && (
                        <div>
                            <h3>3. Selected model is {selectedModel.name}. </h3>
                            <Button onClick={submitClassify}>Classify</Button>
                        </div>
                    )}
                    </Col>
                </Row>
            </Container>
            </Col>
            <Col>         
            <h2>Classification results</h2>
            {classificationResult &&
            <div>
                <PredictionClass id={classificationResult['classID']}/>
                
            </div>
            }
            </Col>          
            </Row>
        </Fragment>
    )
}