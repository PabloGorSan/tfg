import { Fragment, useState } from "react";
import {Form, Row, Col, Button, Collapse} from "react-bootstrap"
import Card from 'react-bootstrap/Card';

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
                    <Card style={{ width: '18rem' }}>
                    <Card.Body>
                    <Card.Title>{classFormData['name']}</Card.Title>
                    <Card.Text>{classFormData['description']}</Card.Text>
                </Card.Body>
            </Card>
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
                </Form>
                </Col>
            </Row>
        </Fragment>
    )

}