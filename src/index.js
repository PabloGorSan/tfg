import React from "react"
import ReactDOM from "react-dom"
import {App} from './App'
import {AppAdmin} from "./AppAdmin"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import MainPage from "./MainPage"
import Classify from "./Classify"
import Upload from "./Upload"
import ModelPage from "./ModelPage"
import MainPageAdmin from "./MainPageAdmin"
import AlgorithmPage from "./AlgorithmPage"
import 'bootstrap/dist/css/bootstrap.min.css'
import CreateClasses from "./CreateClasses"
import ClassDetails from "./ClassDetails"
import Train from "./Train"
import Prueba from "./prueba"
import LandPage from "./LandPage"


ReactDOM.render(
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<App/>}>
            <Route path="" element={<LandPage/>}/>
            <Route path="main" element={<MainPage/>}/>
            <Route path="classify" element={<Classify/>}/>
            <Route path="upload" element={<Upload/>}/>
            <Route path="train" element={<Train/>}/>
            <Route path="model/:id" element={<ModelPage/>}/>
            <Route path="algorithm/:id" element={<AlgorithmPage/>}/>
            <Route path="createClasses" element={<CreateClasses/>}/>
            <Route path="classDetails/:id" element={<ClassDetails/>}/>
            <Route path="prueba" element={<Prueba/>}/>
            <Route path="admin" element={<MainPageAdmin/>}/>
        </Route>
    </Routes>
    </BrowserRouter>
, document.getElementById("root"))