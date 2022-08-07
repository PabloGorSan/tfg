import React, { Fragment } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";
export function AppAdmin(){
    return(
        <Fragment>
            <Navbar bg="dark" variant="dark" className="mb-3">
                <Container>
                    <Navbar.Brand as={Link} to="/admin/main">Home</Navbar.Brand>
                </Container>
            </Navbar>
            <Container>
                <Outlet/>
            </Container>
        </Fragment>
    )
}