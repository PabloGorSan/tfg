import {React, useState} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

export function ModelItem({ model, clickAction}) {
	const {id, nombre} = model

    return (
        <ListGroup.Item as="li" action onClick={() => clickAction(model)} >Nombre: {nombre}</ListGroup.Item>
    )
}

