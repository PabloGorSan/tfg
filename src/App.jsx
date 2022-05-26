import React, { Fragment } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";
export function App() {

    return(
        <Fragment>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/main">Home</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-var" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/classify">Classify</Nav.Link>
                            <Nav.Link as={Link} to="/upload">Upload</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <Outlet/>
            </Container>
        </Fragment>
    )
}