import React from 'react'
import {DatasetItem} from "./DatasetItem"
import ListGroup from 'react-bootstrap/ListGroup'

export function DatasetList({datasets, modelID, activatedDatasets}) {
  return (
    <ListGroup as="ul">
        {datasets.map((dataset) => (
            <DatasetItem key={dataset.id} dataset={dataset} modelID={modelID} activated={activatedDatasets.includes(dataset.id)}/>
        ))}
    </ListGroup>
  )
}
