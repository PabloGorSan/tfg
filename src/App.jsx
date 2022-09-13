import React, { Fragment } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";
import { Login } from "./components/Login.jsx"
import {useNavigate, useLocation} from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

export function App() {

    const user = localStorage.getItem("user")

    const navigate = useNavigate()

    function logOut(){
        localStorage.setItem("user", null)
        navigate("")
    }

    return(
        <Fragment>
            <Navbar bg="dark" variant="dark" className="mb-3">
                <Container>
                    {user === "null" && <Navbar.Brand as={Link} to=""><FontAwesomeIcon icon={faHome} /></Navbar.Brand>}
                    {user !== "null" && <Navbar.Brand as={Link} to="main"><FontAwesomeIcon icon={faHome} /></Navbar.Brand>}
                    <Navbar.Toggle aria-controls="basic-navbar-var" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/main">Search</Nav.Link>
                            <Nav.Link as={Link} to="/classify">Classify</Nav.Link>
                            {user !== "null" && <Nav.Link as={Link} to="/upload">Upload</Nav.Link>}
                            {user !== "null" && <Nav.Link as={Link} to="/train">Train your model</Nav.Link>}
                        </Nav>
                    </Navbar.Collapse>
                    {user === "null" && <Login/>}
                    {user !== "null" && <Button onClick={logOut}>Log Out</Button>}
                </Container>
            </Navbar>
            <Container>
                <Outlet/>
            </Container>
        </Fragment>
    )
}