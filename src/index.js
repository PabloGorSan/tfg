import React from "react"
import ReactDOM from "react-dom"
import {App} from './App'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import MainPage from "./MainPage"
import Classify from "./Classify"
import Upload from "./Upload"
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<App/>}>
            <Route path="main" element={<MainPage/>}/>
            <Route path="classify" element={<Classify/>}/>
            <Route path="upload" element={<Upload/>}/>
        </Route>
    </Routes>
    </BrowserRouter>
, document.getElementById("root"))