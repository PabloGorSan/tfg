import ListGroup from 'react-bootstrap/ListGroup'
import { PredictionClass } from './PredictionClass'

export function PredictionClassesList({classes}) {
    return (
        <ListGroup as="ul">
            {classes.map((id) => (
                <div>
                    <PredictionClass id={id}/>
                    <br/>
                </div>
            ))}
        </ListGroup>
      )
}