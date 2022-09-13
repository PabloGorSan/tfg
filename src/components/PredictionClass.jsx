
import Card from 'react-bootstrap/Card';
import useFetch from './useFetch';

export function PredictionClass({id}){

    const {data: classData, errorClass, isPendingClass } = useFetch('http://127.0.0.1:5000/findClassByID/' + id.toString())

    return(
        <div>
        {classData &&
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>{classData['name']}</Card.Title>
                    <Card.Text>{classData['description']}</Card.Text>
                </Card.Body>
            </Card>
        }
        </div>

    )

}