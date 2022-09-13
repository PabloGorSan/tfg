import { Fragment, useState } from "react";
import {useNavigate, useLocation} from "react-router-dom"
import {Form, Row, Col, Button, Collapse} from "react-bootstrap"
import { useGlobalState } from "state-pool";
import { ClassEditorList } from "./components/ClassEditorList";

export default function CreateClasses(){

    const navigate = useNavigate()
    const model = useLocation().state

    const [classesFormData, setClassesFormData] = useState(
        {
            threshold:null,
            names: Array(useLocation().state['numberClasses']).fill(1),
            descs: Array(useLocation().state['numberClasses']).fill(1)
        }
    )

    function handleChangeThreshold(event){
        setClassesFormData(prevClassesFormData => {
            return {
                ...prevClassesFormData,
                threshold: event.target.value
            }
        })
    }

    function handleChangeName(name, position){
        var currentNames = classesFormData['names']
        currentNames[position] = name
        setClassesFormData(prevClassesFormData => {
            return {
                ...prevClassesFormData,
                names: currentNames
            }
        })
    }

    function handleChangeDesc(desc, position){
        var currentDescs = classesFormData['descs']
        currentDescs[position] = desc +"/nd"
        setClassesFormData(prevClassesFormData => {
            return {
                ...prevClassesFormData,
                descs: currentDescs
            }
        })
    }

    const handleSubmission = (event) => {
        event.preventDefault()
        const formData = new FormData();
        formData.append('name', model['name'])
        formData.append('type', model['type'])
        formData.append('x', model['x'])
        formData.append('y', model['y'])
        formData.append('channel', model['channel'])
        formData.append('predictionFormat', model['predictionFormat'])
        formData.append('numberClasses', model['numberClasses'])
        formData.append('public', model['public'])
        formData.append('trained', model['trained'])
        formData.append('threshold', classesFormData['threshold'])
        formData.append('classesNames', classesFormData['names'])
        formData.append('classesDescs', classesFormData['descs'])
        formData.append('userID', localStorage.getItem('user'))
        

        for (let i = 0; i < model['file'].length; i++) {
            formData.append(`file[${i}]`, model['file'][i])
        }
        var requestURL = "http://localhost:5000/uploadModel"
        var nextURL = "/model/"

        fetch(requestURL,
            {
                method: 'POST',
                body: formData,
            }
        ).then(response => response.json())
        .then(data => navigate(nextURL+data['id']))
	};

    return(
        <Fragment>
            <h1>Create the classes that your model returns</h1>
            {model['predictionFormat'] == 1 && 
            <div className="create-name">
                <b>Binary probability</b>
                <p>Because this is a binary probability model, you have to describe two classes and the threshold that will be used to interpret your model output. If the model returns a value under that threshold, it will be cataloged as class 0. If the model returns a greater value, it will be cataloged as class 1.</p>
                <Form.Group className="mb-3" controlId="threshold">
                    <Form.Label>Threshold</Form.Label>
                    <Form.Control name="threshold" onChange={handleChangeThreshold} type="number"/>
                </Form.Group>
            </div>
            }
            {model['predictionFormat'] == 2 && 
            <div>
                <b>Multicategorical probability</b>
                <p>Because this is a multicategorical probability model, you have to describe x classes. Keep in mind that they have to be in the same order as in your model’s output. The image will be catalogued as the index of the greater value returned by the model.</p>
            </div>
            }
            {model['predictionFormat'] == 3 && 
            <div>
                <b>Integer encoding</b>
                <p>Because this is a integer encoding model, you have to describe x classes. Keep in mind that they have to be in the same order as in your model’s output. The image will be catalogued as the index returned by the model, starting with index 0.</p>
            </div>
            }
            {model['predictionFormat'] == 4 && 
            <div>
                <b>One Hot encoding</b>
                <p>Because this is a One Hot encoding model, you have to describe x classes. Keep in mind that they have to be in the same order as in your model’s output. The image will be catalogued as the index of the ‘1’ value returned by the model, starting with index 0.</p>
            </div>
            }
            <ClassEditorList model={model} changeName={handleChangeName} changeDesc={handleChangeDesc}/>
            <Button onClick={handleSubmission}>Upload</Button>
        </Fragment>
    )
}