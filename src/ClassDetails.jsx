import { Fragment, useState } from "react";
import {useNavigate, useLocation} from "react-router-dom"
import {Form, Row, Col, Button, Collapse} from "react-bootstrap"
import { useGlobalState } from "state-pool";
import { useParams } from "react-router-dom";
import useFetch from './components/useFetch';
import { PredictionClass } from "./components/PredictionClass";

export default function ClassDetails(){

    const { id } = useParams()

    return(
        <Fragment>
            <h2>Results</h2>
            <PredictionClass id={id}/>
        </Fragment>
    )
}