import React from 'react'
import { ClassifierItem } from './ClassifierItem'
import ListGroup from 'react-bootstrap/ListGroup'

export function ClassifierList({models, clickAction, badge}) {
  return (
    <div>
      {models.length === 0 &&
        <p>There are no classifiers.</p>
      }
      {models.length !== 0 &&
        <ListGroup as="ul">
            {models.map((model) => (
                <ClassifierItem key={model.id} model={model} clickAction={clickAction} badge={badge}/>
            ))}
        </ListGroup>
      }
    </div>
  )
}

