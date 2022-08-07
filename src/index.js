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



ReactDOM.render(
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<App/>}>
            <Route path="main" element={<MainPage/>}/>
            <Route path="classify" element={<Classify/>}/>
            <Route path="upload" element={<Upload/>}/>
            <Route path="train" element={<Train/>}/>
            <Route path="model/:id" element={<ModelPage/>}/>
            <Route path="algorithm/:id" element={<AlgorithmPage/>}/>
            <Route path="createClasses" element={<CreateClasses/>}/>
            <Route path="classDetails/:id" element={<ClassDetails/>}/>
        </Route>
        <Route path="/admin/" element={<AppAdmin/>}>
            <Route path="main" element={<MainPageAdmin/>}/>
        </Route>
    </Routes>
    </BrowserRouter>
, document.getElementById("root"))