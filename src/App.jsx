import React, { Fragment } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";
import { Login } from "./components/Login.jsx"

export function App() {

    const user = localStorage.getItem("user")

    function logOut(){
        localStorage.setItem("user", null)
        window.location.reload()
    }

    return(
        <Fragment>
            <Navbar bg="dark" variant="dark" className="mb-3">
                <Container>
                    <Navbar.Brand as={Link} to="/main">Home</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-var" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/classify">Classify</Nav.Link>
                            <Nav.Link as={Link} to="/upload">Upload</Nav.Link>
                            <Nav.Link as={Link} to="/train">Train your model</Nav.Link>
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