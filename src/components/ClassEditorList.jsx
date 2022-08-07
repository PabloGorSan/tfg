import { Fragment, useState } from "react";
import {useNavigate, useLocation} from "react-router-dom"
import {Form, Row, Col, Button, Collapse, ListGroup} from "react-bootstrap"
import { useGlobalState } from "state-pool";
import { ClassEditor } from "./ClassEditor";

export function ClassEditorList({model, changeName, changeDesc}){

    const {numberClasses, predictionFormat} = model
    return(
        <Fragment>
            {Array.from({ length: numberClasses }, (_, i) => <ClassEditor key={i} number={i} changeName={changeName} changeDesc={changeDesc}/>)}
        </Fragment>
    )
}