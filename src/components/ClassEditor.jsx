import { Fragment, useState } from "react";
import {useNavigate, useLocation} from "react-router-dom"
import {Form, Row, Col, Button, Collapse} from "react-bootstrap"
import { useGlobalState } from "state-pool";
import { PredictionClass } from "./PredictionClass";

export function ClassEditor({number, changeName, changeDesc}){

    const [classFormData, setClassFormData] = useState(
        {
            name: "Class name",
            description: "Write a description for this class",
            image: null
        }
    )

    function handleChange(event) {
        const {name, value, type, files} = event.target
        setClassFormData(prevClassFormData => {
            return {
                ...prevClassFormData,
                [name]: type === "file" ? files[0] : value
            }
        })
        if(name == "name"){
            changeName(value, number)
        } else if (name == 'description'){
            changeDesc(value, number)
        }
        
    }

    return(
        <Fragment>
            <Row>
                <h2>Class {number}</h2>
                <Col>
                    <PredictionClass data={classFormData}/>
                </Col>
                <Col>
                <Form>
                    <Form.Group className="mb-3" controlId="className">
                        <Form.Label>Class name</Form.Label>
                        <Form.Control name="name" onChange={handleChange} type="text"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="classDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="description" onChange={handleChange} type="text"/>
                    </Form.Group>
                    <Form.Control type="file" name="image" accept="image/*" onChange={handleChange} />
                </Form>
                </Col>
            </Row>
        </Fragment>
    )

}