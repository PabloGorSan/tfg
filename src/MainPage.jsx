import React from 'react'
import { Fragment, useState, useRef } from "react";
import { ModelList } from "./components/ModelList";
import useFetch from './components/useFetch';



export default function MainPage() {


    const { data: modelsFetch, errorModel, isPendingModel } = useFetch('http://127.0.0.1:5000/getAllModels')
    const { data: algorithmsFetch, errorAlgorithms, isPendingAlgorithms } = useFetch('http://127.0.0.1:5000/getAllAlgorithms')

    return (
    <Fragment>
        <h2>MainPage</h2>
        <h3>Models</h3>
        {modelsFetch && <ModelList models={modelsFetch}/>}
        <h3>Algorithms</h3>
        {algorithmsFetch && <ModelList models={algorithmsFetch}/>}
        <br/>        
    </Fragment>
    )
}
