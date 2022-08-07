import { Fragment, useState } from "react";
import {useNavigate, useLocation} from "react-router-dom"
import {Form, Row, Col, Button, Collapse} from "react-bootstrap"
import { useGlobalState } from "state-pool";
import Card from 'react-bootstrap/Card';

export function PredictionClass({data}){

    const {name, description, image} = data

    return(
        <Card style={{ width: '18rem' }}>
            {image && <Card.Img variant="top" src={URL.createObjectURL(image)} />}
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>{description}</Card.Text>
            </Card.Body>
        </Card>
    )

}