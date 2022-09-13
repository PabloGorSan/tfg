import React from 'react'
import { Fragment, useState, useRef } from "react";
import { ClassifierList } from "./components/ClassifierList";
import useFetch from './components/useFetch';
import { useNavigate } from "react-router-dom";

export default function MainPage() {
    const { data: publicModelsFetch, errorPublicModel, isPendingPublicModel } = useFetch('http://127.0.0.1:5000/findPublicModels')
    const { data: userModelsFetch, errorModel, isPendingModel } = useFetch('http://127.0.0.1:5000/findModelsByUid/'+ localStorage.getItem('user'))

    const user = localStorage.getItem("user")

    const navigate = useNavigate()

    function goToModelDetails(model){
        navigate("/model/"+model.id)
    }
    
    return (
    <Fragment>
        <div className="web-content">
            <h1>Classifiers List</h1>
            <p>This is the list of classifiers you have access to. Click on any of them to view further details.</p>
            <h2>Your classifiers</h2>
            {userModelsFetch && 
            <div>
                <ClassifierList models={userModelsFetch} clickAction={goToModelDetails} badge={true}/>
            </div>
            }
            {localStorage.getItem('user') === 'null' && 
            <p>Log in to look at your uploaded classifiers.</p>
            }
            <h2>Public classifiers</h2>
            {publicModelsFetch && 
            <div>
                <ClassifierList models={publicModelsFetch} clickAction={goToModelDetails} badge={true}/>
            </div>
            }
        </div>
    </Fragment>
    )
}
