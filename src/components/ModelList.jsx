import React from 'react'
import { ModelItem } from './ModelItem'
import ListGroup from 'react-bootstrap/ListGroup'

export function ModelList({models, clickAction}) {
  return (
    <ListGroup as="ul">
        {models.map((model) => (
            <ModelItem key={model.id} model={model} clickAction={clickAction}/>
        ))}
    </ListGroup>
  )
}

