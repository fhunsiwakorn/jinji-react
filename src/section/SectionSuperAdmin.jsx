import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import ErrorPage from "./ErrorPage";
import Logout from "../landing-page/Logout";
import Common from "../common";

import Candidate from "./component_superadmin/Candidate";
import CandidateDetail from "./component_superadmin/CandidateDetail";
import HrCompany from "./component_superadmin/HrCompany";
import MasterDataWork from "./component_superadmin/MasterDataWork";
import MasterDataSkill from "./component_superadmin/MasterDataSkill";
import MasterDataBusinessType from "./component_superadmin/MasterDataBusinessType";
import MasterDataInstitution from "./component_superadmin/MasterDataInstitution";
const app_name = Common.app_name;
const fullname =
  Common.getUserLoginData.firstname + " " + Common.getUserLoginData.lastname;
export default class SectionSuperAdmin extends Component {
  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
          <Container>
            <Navbar.Brand href="/" style={{ textTransform: "uppercase" }}>
              {" "}
              {app_name} Panel
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/candidate">Candidate</Nav.Link>
                {/* <NavDropdown title="Candidate" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/school-list">
                    Candidate
                  </NavDropdown.Item>
                </NavDropdown> */}
                <Nav.Link href="/hr">HR Company</Nav.Link>

                <NavDropdown title="Master Data" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/works">Works</NavDropdown.Item>
                  <NavDropdown.Item href="/skills">Skills</NavDropdown.Item>
                  <NavDropdown.Item href="/business_type">
                    Business Type
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/institution">
                    Institution
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>

              <Nav>
                <NavDropdown title={fullname} id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {/* Content */}
        <Container fluid>
          <p></p>
          <Router>
            <Routes>
              <Route path="/candidate" element={<Candidate />} />
              <Route path="/candidate/:user_id" element={<CandidateDetail />} />
              <Route path="/hr" element={<HrCompany />} />
              <Route path="/works" element={<MasterDataWork />} />
              <Route path="/skills" element={<MasterDataSkill />} />
              <Route path="/institution" element={<MasterDataInstitution />} />
              <Route
                path="/business_type"
                element={<MasterDataBusinessType />}
              />
              <Route path="/logout" element={<Logout />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Router>
        </Container>
      </div>
    );
  }
}
