import React from 'react'
import { Fragment, useState, useRef } from "react";
import { ClassifierList } from "./components/ClassifierList";
import useFetch from './components/useFetch';
import { useNavigate } from "react-router-dom";

export default function MainPage() {
    const { data: modelsFetch, errorModel, isPendingModel } = useFetch('http://127.0.0.1:5000/findModelsByUid/'+ localStorage.getItem('user'))
    const { data: algorithmsFetch, errorAlgorithms, isPendingAlgorithms } = useFetch('http://127.0.0.1:5000/getAllAlgorithms')

    const user = localStorage.getItem("user")

    const navigate = useNavigate()

    function goToModelDetails(model){
        navigate("/model/"+model.id)
    }

    function goToAlgorithmDetails(model){
        navigate("/algorithm/"+model.id)
    }
    
    return (
    <Fragment>
        {user}
        <h2>MainPage</h2>
        <h3>My Models</h3>
        {modelsFetch && <ClassifierList models={modelsFetch} clickAction={goToModelDetails}/>}
        <h3>My Algorithms</h3>
        {algorithmsFetch && <ClassifierList models={algorithmsFetch} clickAction={goToAlgorithmDetails}/>}
    </Fragment>
    )
}
