import {React, useState} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'

export function ClassifierItem({ model, clickAction, badge}) {
	const {id, name} = model

    return (
        <ListGroup.Item as="li" id="listgroup-item" style={{cursor:'pointer'}} action onClick={() => clickAction(model)} >
            <div style={{margin:'auto'}}>
            <p>{name}{badge && <Badge id="badge-list" bg="success" pill>View details</Badge>}</p>
            
            </div>
            
        </ListGroup.Item>
    )
}

