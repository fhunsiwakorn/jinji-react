import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import axios from "axios";
import Common from "../common";
import Swal from "sweetalert2";

import Logo from "../asset/images/Jinjijob4.png";
const textbox_radius = { borderRadius: "40px" };
const CardStyle = styled.div`
  .animate {
    background-image: url("https://i.pinimg.com/736x/26/af/cc/26afcc461a3b9832cc9ab3a478f28f87.jpg");
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;
    z-index: 1;
  }
  .animate::before {
    content: "";
    display: block;
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.1);
  }
`;

const navStyle = {
  fontSize: "24px",
  fontWeight: "bold",
};
const linkStyle = {
  color: "#0E4C81",
  paddingLeft: "50px",
};
// https://i.pinimg.com/736x/26/af/cc/26afcc461a3b9832cc9ab3a478f28f87.jpg
export default class RegisterCandidate extends Component {
  state = {
    country_id: 19,
    list_country: [],
    defaultCountry: {
      value: 19,
      label: "Thailand - ไทย",
    },
    msg: "",
    password_confirm: "",
    email_confirm: "",
    // main
    user_id: 0,
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    user_image_prifile: "",
    user_image_cover: "",
    user_image_cover_position: "",
    user_type: 3,
    active: 1,

    // detail
    ud_bio: "",
    ud_birhday: Date,
    ud_phone: "",
    email: "",
    ud_address: "",
  };
  getCountry = (newValue) => {
    // console.log(newValue);
    try {
      axios
        .post(
          Common.API_URL + "masterdata/country",
          {
            page: 1,
            per_page: 25,
            search_value: newValue,
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          //   console.log(res.data);
          let list = res.data;
          var arr = [];
          for (let i = 0; i < list.length; i++) {
            let obj = list[i];
            arr.push({
              value: obj.country_id,
              label:
                obj.country_name_eng + " - " + obj.country_official_name_eng,
            });
          }
          //   console.log(arr);
          this.setState({
            list_country: arr,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  setCountry_id = async (e) => {
    this.setState({ country_id: e.value, defaultCountry: e });
  };
  handleSubmit = () => {
    if (this.state.password === "" || this.state.email === "") {
      // this.setState({ msg: "Invalid data" });
      Swal.fire({
        title: "Error!",
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "Continue",
      });
      return false;
    }
    if (this.state.password !== this.state.password_confirm) {
      // this.setState({ msg: "Passwords did not match" });
      Swal.fire({
        title: "Error!",
        text: "Passwords did not match",
        icon: "error",
        confirmButtonText: "Continue",
      });
      return false;
    }
    if (this.state.email !== this.state.email_confirm) {
      // this.setState({ msg: "Passwords did not match" });
      Swal.fire({
        title: "Error!",
        text: "Passwords did not match",
        icon: "error",
        confirmButtonText: "Continue",
      });
      return false;
    }

    try {
      axios
        .post(
          Common.API_URL + `user/create`,
          {
            username: this.state.email,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            user_image_prifile: this.state.user_image_prifile,
            user_image_cover: this.state.user_image_cover,
            user_image_cover_position: this.state.user_image_cover_position,
            user_type: this.state.user_type,
            active: 0,
          },
          Common.options
        )
        .then((res) => {
          window.location = "/login";
        });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    //
  }

  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Container>
            <Navbar.Brand href="/">
              <Image
                variant="top"
                src={Logo}
                style={{ width: "85px", height: "60px" }}
              />
            </Navbar.Brand>

            <Nav className="justify-content-end" style={navStyle}>
              <Nav.Link href="#" style={linkStyle}>
                Test
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Container>
          <CardStyle>
            <Row>
              <Col lg="6" md="12" sm="12">
                <div className="animate"></div>
              </Col>
              <Col lg="6" md="12" sm="12">
                <div style={{ paddingTop: "25%" }}>
                  <div align="center">
                    <Alert variant="info">
                      <h1>Register for Candidate</h1>
                    </Alert>
                  </div>

                  <Form.Group className="mb-3">
                    <div className="form-inside left-inner-addon">
                      <Form.Control
                        type="text"
                        placeholder="Email"
                        id="email"
                        style={textbox_radius}
                        onChange={(e) =>
                          this.setState({ email: e.target.value })
                        }
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-envelope icon-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                      </svg>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="form-inside left-inner-addon">
                      <Form.Control
                        type="text"
                        placeholder="Confirm Email"
                        id="email_confirm"
                        style={textbox_radius}
                        onChange={(e) =>
                          this.setState({ email_confirm: e.target.value })
                        }
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-envelope icon-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                      </svg>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="form-inside left-inner-addon">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        id="password"
                        style={textbox_radius}
                        onChange={(e) =>
                          this.setState({ password: e.target.value })
                        }
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-lock-fill icon-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                      </svg>
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <div className="form-inside left-inner-addon">
                      <Form.Control
                        type="password"
                        id="password_confirm"
                        placeholder="Confirm Password"
                        style={textbox_radius}
                        onChange={(e) =>
                          this.setState({ password_confirm: e.target.value })
                        }
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-lock-fill icon-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                      </svg>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3" align="center">
                    <Button variant="success" onClick={this.handleSubmit}>
                      Register
                    </Button>
                  </Form.Group>
                </div>
              </Col>
            </Row>
          </CardStyle>
        </Container>
      </div>
    );
  }
}
