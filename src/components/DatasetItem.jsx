import {React, useState} from 'react'
import { Form } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup'

export function DatasetItem({ dataset, modelID, activated}) {
	const {id, name} = dataset

    const [activate, setActivate] = useState(activated)

    function handleChange(){
        setActivate(!activate)
        var fetchURL = "http://localhost:5000/activateDataset?datasetID=" + id +"&modelID=" + modelID + "&activated=" + !activate
        fetch(fetchURL,
            {
                method: 'GET'
            }
        )
    }

    return (
        <ListGroup.Item as="li">
            <div>
                Dataset: {name}
            </div>
            <Form.Check type="switch" id="custom-switch" label="Allow Dataset" onChange={handleChange} defaultChecked={activated}>
            </Form.Check>
        </ListGroup.Item>
    )
}
