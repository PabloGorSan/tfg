import { Fragment, useState, useRef } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import Image from 'react-bootstrap/Image'
import useFetch from "./components/useFetch";
import { ModelList, ModelListClassify } from "./components/ModelList";

export default function Classify() {

    const [selectedImage, setSelectedImage] = useState()
	const [isImagePicked, setIsImagePicked] = useState(false)

    const [selectedModel, setSelectedModel] = useState()
	const [isModelPicked, setIsModelPicked] = useState(false)

    const [classificationResult, setClassificationResult] = useState()
    const [isClassified, setIsClassified] = useState(false)

    const { data: modelsFetch, errorModel, isPendingModel } = useFetch('http://127.0.0.1:5000/getAllModels')

    const changeHandler = (event) => {
		setSelectedImage(event.target.files[0]);
		setIsImagePicked(true);
	};

    function changeModelHandler(model) {
		setSelectedModel(model)
		setIsModelPicked(true)
	};

    const submitClassify = () => {
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
        .then(data => handleClassificationResult(data))

    }

    function handleClassificationResult(data){
        setClassificationResult(data)
        setIsClassified(true)
    }

    return(
        <Fragment>
            <h2>Classify</h2>
            <Container>
                <Row>
                    <Col>
                    <h3>Select an image</h3>
                    <div>
                        <input type="file" name="image" accept="image/*" onChange={changeHandler} />
                        {isImagePicked ? (
                            <div>
                                <Image src={URL.createObjectURL(selectedImage)} height={200} width={200} />
                            </div>
                        ) : (
                            <p>Select an image to upload</p>
                        )}
                    </div>
                    </Col>

                </Row>
                <Row>
                    <Col>
                    {isImagePicked && (
                        <div>
                            <h3>Select a model</h3>
                            <ModelList models={modelsFetch} clickAction={changeModelHandler}/>
                        </div>
                    )}
                    </Col>
                </Row>
                <Row>
                    <Col>
                    {isModelPicked && (
                        <div>
                            <h3>Selected model is {selectedModel.nombre}. Select your custom attributes</h3>
                            <p>Click this button to begin the classification</p>
                            <Button onClick={() => submitClassify()}>Classify</Button>
                        </div>
                    )}
                    </Col>
                </Row>
                <Row>
                    <Col>
                    {isClassified && (
                        <div>
                            <p>El resultado es: {classificationResult["result"]}</p>
                        </div>
                    )}
                    </Col>
                </Row>
            </Container>
            
        </Fragment>
    )
}