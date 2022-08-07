import { Fragment, useState } from "react";
import {useNavigate} from "react-router-dom"
import {Form, Row, Col, Button, Collapse} from "react-bootstrap"

export default function Upload(){

    //webkitdirectory="" mozdirectory=""

    const navigate = useNavigate()
    
    const [openModel, setOpenModel] = useState(false);
    const [openAlg, setOpenAlg] = useState(false);

    const [modelFormData, setModelFormData] = useState(
        {
            name: "",
            type: 0,
            file: null,
            x: 0,
            y: 0,
            channel: 0,
            predictionFormat: 0,
            numberClasses: 0,
            public: 0,
            trained: 0
        }
    )


    function handleChange(event) {
        const {name, value, type, files} = event.target
        console.log(modelFormData)
        if(openModel){
            setModelFormData(prevModelFormData => {
                return {
                    ...prevModelFormData,
                    [name]: type === "file" ? files : value
                }
            })
        } else if(openAlg){
            setModelFormData(prevModelFormData => {
                return {
                    ...prevModelFormData,
                    [name]: type === "file" ? files[0] : value
                }
            })
        }

    }
    const handleSubmission = (event) => {
        event.preventDefault()
        const formData = new FormData();
        formData.append('name', modelFormData['name'])
        formData.append('type', modelFormData['type'])
        formData.append('x', modelFormData['x'])
        formData.append('y', modelFormData['y'])
        formData.append('channel', modelFormData['channel'])
        formData.append('predictionFormat', modelFormData['predictionFormat'])
        formData.append('numberClasses', modelFormData['numberClasses'])
        formData.append('public', modelFormData['public'])
        formData.append('trained', modelFormData['trained'])
        formData.append('userID', localStorage.getItem('user'))
        var requestURL = ""
        var nextURL = ""

        if(openModel){
            for (let i = 0; i < modelFormData['file'].length; i++) {
                formData.append(`file[${i}]`, modelFormData['file'][i])
            }
            requestURL = "http://localhost:5000/uploadModel"
            nextURL = "/model/"
        } else if(openAlg){
            formData.append('file', modelFormData['file'])
            requestURL = "http://localhost:5000/uploadAlgorithm"
            nextURL = "/algorithm/"
        }
        fetch(requestURL,
            {
                method: 'POST',
                body: formData,
            }
        ).then(response => response.json())
        .then(data => navigate(nextURL+data['id']))
	};

    function funcOpenModel(){
        setModelFormData({
            name: "",
            type: 0,
            file: null,
            x: 0,
            y: 0,
            channel: 0,
            predictionFormat:0,
            numberClasses:2,
            public: 0,
            trained: 0
        })

        setOpenModel(true)
        setOpenAlg(false)
    }
    function funcOpenAlg(){
        setModelFormData({
            name: "",
            type: 0,
            file: null,
            x: 0,
            y: 0,
            channel: 0
        })

        setOpenModel(false)
        setOpenAlg(true)
    }

    function nextStep(){
        navigate("/createClasses", {state:modelFormData})
    }
    return(
        <Fragment>
            <h2 className="mb-3">Upload a new Classifier</h2>
            <Row className="mb-4">
                <Col>
                <Button
                    onClick={() => funcOpenModel()}
                    aria-controls="collapseModel"
                    aria-expanded={openModel}
                >
                    Upload new Model
                </Button>
                </Col>
                <Col>
                <Button
                    onClick={() => funcOpenAlg()}
                    aria-controls="collapseAlg"
                    aria-expanded={openAlg}
                >
                    Upload new Algorithm
                </Button>
                </Col>
            </Row>
            <Row>
            <Collapse in={openModel}>
                <Form>
                    <Row>
                        
                        <Form.Group className="mb-3" controlId="modelName">
                            <Form.Label>Public model name</Form.Label>
                            <Form.Control name="name" onChange={handleChange} type="text"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="modelType">
                            <Form.Label>Technology</Form.Label>
                            <Form.Select name="type" onChange={handleChange}>
                                    <option value="0">Select model technology</option>
                                    <option value="1">TensorFlow</option>
                            </Form.Select>
                        </Form.Group> 
                        <Form.Group className="mb-3" controlId="modelFiles">
                            <Form.Label>Model</Form.Label>
                            <Form.Control onChange={handleChange} type="file" name="file" multiple/>
                        </Form.Group>

                        <Row>
                        <Form.Label>Size of images accepted</Form.Label>
                            <Col>
                            <Form.Group className="mb-3" controlId="modelXValue">
                                <Form.Label>X</Form.Label>
                                <Form.Control name="x" onChange={handleChange} type="number"/>
                            </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3" controlId="modelYValue">
                                <Form.Label>Y</Form.Label>
                                <Form.Control name="y" onChange={handleChange} type="number"/>
                            </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="modelChannel">
                            <Form.Label>Channel used</Form.Label>
                            <Form.Select name="channel" onChange={handleChange}>
                                <option value="0">Select the channel</option>
                                <option value="1">GrayScale</option>
                                <option value="2">RGB</option>
                                <option value="3">BGR</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="predictionFormat">
                            <Form.Label>Prediction format</Form.Label>
                            <Form.Select name="predictionFormat" onChange={handleChange}>
                                <option value="0">Select the prediction format</option>
                                <option value="1">Binary probability</option>
                                <option value="2">Multicategorical probability</option>
                                <option value="3">Integer encoding</option>
                                <option value="4">One Hot encoding</option>
                            </Form.Select>
                        </Form.Group>
                        {modelFormData['predictionFormat'] != 0 && 
                        <Form.Group className="mb-3" controlId="numberClasses">
                            <Form.Label>Number of classes</Form.Label>
                            {modelFormData['predictionFormat'] == 1 && <Form.Control name="numberClasses" onChange={handleChange} type="number" value='2' readOnly/>}
                            {modelFormData['predictionFormat'] != 1 && <Form.Control name="numberClasses" onChange={handleChange} type="number" min='2'/>}
                        </Form.Group> }
                        <Form.Group className="mb-3" controlId="public">
                            <Form.Check onChange={handleChange}
                                inline
                                label="private"
                                name="public"
                                type='radio'
                                value="0"
                            />
                            <Form.Check onChange={handleChange}
                                inline
                                label="public"
                                name="public"
                                type='radio'
                                value="1"
                            />   
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="trained">
                            <Form.Check onChange={handleChange}
                                inline
                                label="Model not trained"
                                name="trained"
                                type='radio'
                                value="0"
                            />
                            <Form.Check onChange={handleChange}
                                inline
                                label="Model trained"
                                name="trained"
                                type='radio'
                                value="1"
                            />   
                        </Form.Group>
  
                        
                    </Row>
                    {modelFormData['trained'] == 0 && <Button onClick={handleSubmission}>Next</Button>}
                    {modelFormData['trained'] == 1 && <Button onClick={nextStep}>Next</Button>}
                </Form>
            </Collapse>
            

            <Collapse in={openAlg}>
                <Form onSubmit={handleSubmission}>
                    <Row>
                        <Form.Group className="mb-3" controlId="algName">
                            <Form.Label>Public algorithm name</Form.Label>
                            <Form.Control name="name" onChange={handleChange} type="text"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="algType">
                            <Form.Label>Programming language</Form.Label>
                            <Form.Select name="type" onChange={handleChange}>
                                    <option>Select programming language</option>
                                    <option value="1">Python</option>
                                    <option value="2">Java</option>
                            </Form.Select>
                        </Form.Group> 
                        <Form.Group className="mb-3" controlId="algFiles">
                            <Form.Label>Algorithm</Form.Label>
                            <Form.Control onChange={handleChange} type="file" name="file"/>
                        </Form.Group>
                        <Row>
                        <Form.Label>Size of images accepted</Form.Label>
                            <Col>
                            <Form.Group className="mb-3" controlId="algXValue">
                                <Form.Label>X</Form.Label>
                                <Form.Control name="x" onChange={handleChange} type="number"/>
                            </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3" controlId="algYValue">
                                <Form.Label>Y</Form.Label>
                                <Form.Control name="y" onChange={handleChange} type="number"/>
                            </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="algChannel">
                            <Form.Label>Channel used</Form.Label>
                            <Form.Select name="channel" onChange={handleChange}>
                                <option>Select the channel</option>
                                <option value="1">GrayScale</option>
                                <option value="2">RGB</option>
                                <option value="3">BGR</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit">Upload</Button>
                    </Row>
                </Form>
            </Collapse>
            </Row>
        </Fragment>
    )
}