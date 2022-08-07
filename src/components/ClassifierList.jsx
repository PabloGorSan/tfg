import React from 'react'
import { ClassifierItem } from './ClassifierItem'
import ListGroup from 'react-bootstrap/ListGroup'

export function ClassifierList({models, clickAction}) {
  return (
    <ListGroup as="ul">
        {models.map((model) => (
            <ClassifierItem key={model.id} model={model} clickAction={clickAction}/>
        ))}
    </ListGroup>
  )
}

