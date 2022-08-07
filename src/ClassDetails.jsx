import { Fragment, useState } from "react";
import {useNavigate, useLocation} from "react-router-dom"
import {Form, Row, Col, Button, Collapse} from "react-bootstrap"
import { useGlobalState } from "state-pool";
import { useParams } from "react-router-dom";
import useFetch from './components/useFetch';
import { PredictionClass } from "./components/PredictionClass";

export default function ClassDetails(){

    const { id } = useParams()
    const data = useLocation().state
    const { data: classData, errorClass, isPendingClass } = useFetch('http://127.0.0.1:5000/findClassByID/' + id.toString())

    return(
        <Fragment>
            <h2>Results</h2>
            {data['result']}
            {classData &&
                <PredictionClass data={classData}/>
            }
        </Fragment>
    )
}