import {React, useState} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

export function ClassifierItem({ model, clickAction}) {
	const {id, name} = model

    return (
        <ListGroup.Item as="li" action onClick={() => clickAction(model)} >Nombre: {name}</ListGroup.Item>
    )
}

