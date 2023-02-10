import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Nav, NavDropdown, Navbar, Card } from "react-bootstrap";

import Profile from "./component_candidate/Profile";
import ViewAs from "./component_candidate/ViewAs";

import ErrorPage from "./ErrorPage";
import Logout from "../landing-page/Logout";
import Common from "../common";
import Functions from "../functions";
import EmptyImage from "../asset/images/profile.png";
import Logo from "../asset/images/Jinjijob4.png";
const BASE_IMAGE = Common.IMAGE_URL;
const app_name = Common.app_name;
const user_image_prifile = Common.getUserLoginData.user_image_prifile;
const fullname =
  Common.getUserLoginData.firstname + " " + Common.getUserLoginData.lastname;
const img_profile =
  Functions.check_empty_value(user_image_prifile) === true
    ? EmptyImage
    : BASE_IMAGE + user_image_prifile;
const navStyle = {
  fontSize: "24px",
  fontWeight: "bold",
};
const linkStyle = {
  color: "#0E4C81",
  paddingLeft: "50px",
};

export default class SectionSuperAdmin extends Component {
  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Container>
            <Navbar.Brand href="/">
              <Card.Img
                variant="top"
                src={Logo}
                style={{ width: "85px", height: "60px" }}
              />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto" style={navStyle}>
                <Nav.Link href="/" style={linkStyle}>
                  Home
                </Nav.Link>
                <Nav.Link href="#" style={linkStyle}>
                  Company
                </Nav.Link>
              </Nav>

              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Card.Img
                  variant="top"
                  src={img_profile}
                  style={{ width: "45px", height: "45px", borderRadius: "50%" }}
                />
                <NavDropdown title={fullname} id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {/* Content */}

        <Router>
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/view-as" element={<ViewAs />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>

        {/* Footer */}
        <div style={{ paddingTop: "50px" }}></div>
        <Navbar expand="lg" bg="secondary" variant="light">
          <Container>
            <Navbar.Brand>{app_name}</Navbar.Brand>
          </Container>
        </Navbar>
      </div>
    );
  }
}
