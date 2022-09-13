import { Fragment } from "react"
import { Row, Col, Button } from "react-bootstrap"
import image from "./images/2802783.jpg"
import { Login } from "./components/Login.jsx"
import { useNavigate } from "react-router-dom";
export default function LandPage(){

    const user = localStorage.getItem("user")
    const navigate = useNavigate()

    function logOut(){
        localStorage.setItem("user", null)
        navigate("/")
    }

    return(
        <Fragment>
            <div class="landing">
            <div class="header"> 
            <Row id="rowlanding">
                <Col id="left-side-land">
                    <div class = "text-box">
                    <h1>Welcome to our image classification app</h1>
                    <h3 class="heading">It will help you classificate images of all kinds</h3>
                    <p>Thank you to our Deep Learning technology, we are able to recognise patterns and objects in your images. Just go to the Classify option to start, or log in with a Google account to upload your own classifiers.</p>
                    </div>
                    <div class="buttonland">
                    {user === "null" && <Login/>}
                    {user !== "null" && <Button onClick={logOut}>Log Out</Button>}
                    </div>
                </Col>
                <Col id="second-col">
                <img src={image} class="icon-landing"></img>
                </Col>
            </Row>
               
                
            </div>
           </div>
        </Fragment>
    )
}