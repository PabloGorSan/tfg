import {useState} from "react";
import {Form, Row, Col, Button, Collapse} from "react-bootstrap"
import { ClassifierList } from "./ClassifierList";

export function ModelFilter(props){

    const [filterFormData, setFilterFormData] = useState(
        {
            validated:true,
            nonValidated:true
        }
    )

    const [listContent, setListContent] = useState(props.models)
    
    function handleChange(event) {
        const {name, value, type, checked } = event.target
        setFilterFormData(prevFilterFormData => {
            return {
                ...prevFilterFormData,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    const handleSubmission = (event) => {
        event.preventDefault()
        const formData = new FormData();
        formData.append('validated', filterFormData['validated'])
        formData.append('nonValidated', filterFormData['nonValidated'])
        fetch("http://localhost:5000/filterModels",
            {
                method: 'POST',
                body: formData,
            }
        ).then(response => response.json())
        .then(data => setListContent(data))
    };
    
    return (
        <div>
            <Form onSubmit={handleSubmission}>
                <Form.Check onChange={handleChange}
                inline
                label="Validated Models"
                name="validated"
                checked={filterFormData.validated}
                />
                <Form.Check onChange={handleChange}
                inline
                label="Non-Validated Models"
                name="nonValidated"
                checked={filterFormData.nonValidated}
                />
                <Button variant="primary" type="submit">Apply</Button>
            </Form>
            <br/>
            <ClassifierList models={listContent} clickAction={props.clickAction} badge={props.badge}></ClassifierList>
        </div>
    )
}