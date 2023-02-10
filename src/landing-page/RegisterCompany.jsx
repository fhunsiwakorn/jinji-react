import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Navbar,
  Button,
  Alert,
  Form,
  Image,
} from "react-bootstrap";
import styled from "styled-components";
import Select from "react-select";
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
const customStyles = {
  control: (base) => ({
    ...base,
    height: 80,
    minHeight: 80,
    borderRadius: "40px",
    paddingLeft: "60px !important",
  }),
};

const navStyle = {
  fontSize: "24px",
  fontWeight: "bold",
};
const linkStyle = {
  color: "#0E4C81",
  paddingLeft: "50px",
};
// https://i.pinimg.com/736x/26/af/cc/26afcc461a3b9832cc9ab3a478f28f87.jpg
export default class RegisterCompany extends Component {
  state = {
    country_id: 19,
    list_country: [],
    defaultCountry: {
      value: 19,
      label: "Thailand - ไทย",
    },
    msg: "",
    password_confirm: "",
    // main
    user_id: 0,
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    user_image_prifile: "",
    user_image_cover: "",
    user_image_cover_position: "",
    user_type: 2,
    active: 1,

    // detail
    ud_bio: "",
    ud_birhday: Date,
    ud_phone: "",
    email: "",
    ud_address: "",
    tambon_id: 1,

    // company
    uc_company_name: "",
    uc_company_website: "",
    uc_company_remark1: "",
    uc_company_remark2: "",
    uc_company_cover: "",
    bt_id: 0,
    bt_data: [],

    list_business: [],
    defaultBusiness: {
      value: 0,
      label: "Business Type",
    },
  };

  getBusinessType = async () => {
    try {
      await axios
        .get(Common.API_URL + "masterdata/business_type", Common.options)
        .then((response) => {
          let list = response.data;
          var arr = [];
          for (let i = 0; i < list.length; i++) {
            let obj = list[i];
            arr.push({
              value: obj.bt_id,
              label: obj.bt_name,
            });
          }
          //   console.log(arr);
          this.setState({
            list_business: arr,
          });
        });
    } catch (error) {
      console.log(error);
    }
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
              label: obj.country_name_eng + " - " + obj.country_name_th,
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
  setBt_id = async (e) => {
    this.setState({ bt_id: e.value, defaultBusiness: e });
  };
  handleSubmit = () => {
    if (
      this.state.username === "" ||
      this.state.password === "" ||
      this.state.firstname === "" ||
      this.state.lastname === "" ||
      this.state.ud_phone === "" ||
      this.state.email === "" ||
      this.state.country_id === "" ||
      this.state.bt_id === 0 ||
      this.state.uc_company_name === ""
    ) {
      console.log(this.state.bt_id);
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

    try {
      axios
        .post(
          Common.API_URL + "userpart2/register/company/create",
          {
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            detail: {
              ud_bio: this.state.ud_bio,
              ud_birhday: this.state.ud_birhday,
              ud_gender: 0,
              ud_phone: this.state.ud_phone,
              ud_address: this.state.ud_address,
              tambon_id: this.state.tambon_id,
              country_id: this.state.country_id,
            },
            company: {
              uc_company_name: this.state.uc_company_name,
              uc_company_website: this.state.uc_company_website,
              uc_company_remark1: this.state.uc_company_remark1,
              uc_company_remark2: this.state.uc_company_remark2,
              uc_company_cover: this.state.uc_company_cover,
              bt_id: this.state.bt_id,
            },
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
    this.getBusinessType();
  }

  render() {
    const { list_country } = this.state;
    const { defaultCountry } = this.state;
    const { list_business } = this.state;
    const { defaultBusiness } = this.state;

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
                      <h1>Register for Company</h1>
                    </Alert>
                  </div>

                  <Form.Group className="mb-3">
                    <div className="form-inside left-inner-addon">
                      <Form.Control
                        type="text"
                        id="username"
                        placeholder="Username"
                        style={textbox_radius}
                        onChange={(e) =>
                          this.setState({ username: e.target.value })
                        }
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-person-fill icon-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
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
                  <Form.Group className="mb-3">
                    <div className="form-inside left-inner-addon">
                      <Form.Control
                        type="text"
                        placeholder="Company name"
                        id="uc_company_name"
                        style={textbox_radius}
                        onChange={(e) =>
                          this.setState({ uc_company_name: e.target.value })
                        }
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-buildings-fill icon-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15 .5a.5.5 0 0 0-.724-.447l-8 4A.5.5 0 0 0 6 4.5v3.14L.342 9.526A.5.5 0 0 0 0 10v5.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V14h1v1.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5V.5ZM2 11h1v1H2v-1Zm2 0h1v1H4v-1Zm-1 2v1H2v-1h1Zm1 0h1v1H4v-1Zm9-10v1h-1V3h1ZM8 5h1v1H8V5Zm1 2v1H8V7h1ZM8 9h1v1H8V9Zm2 0h1v1h-1V9Zm-1 2v1H8v-1h1Zm1 0h1v1h-1v-1Zm3-2v1h-1V9h1Zm-1 2h1v1h-1v-1Zm-2-4h1v1h-1V7Zm3 0v1h-1V7h1Zm-2-2v1h-1V5h1Zm1 0h1v1h-1V5Z" />
                      </svg>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3" style={{ paddingTop: "30px" }}>
                    <div className="form-inside">
                      <Select
                        id="bt_id"
                        options={list_business}
                        styles={customStyles}
                        onChange={this.setBt_id}
                        value={defaultBusiness}
                        // placeholder="test"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-box-fill icon-circle"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001 6.971 2.789Zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z"
                        />
                      </svg>
                    </div>
                  </Form.Group>

                  <div style={{ paddingTop: "25px" }}>
                    <hr />
                    <label>Contact Person</label>
                  </div>

                  <Form.Group className="mb-3">
                    <div className="form-inside left-inner-addon">
                      <Form.Control
                        type="text"
                        placeholder="Firstname"
                        id="firstname"
                        style={textbox_radius}
                        onChange={(e) =>
                          this.setState({ firstname: e.target.value })
                        }
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-person-circle icon-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path
                          fillRule="evenodd"
                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                        />
                      </svg>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="form-inside left-inner-addon">
                      <Form.Control
                        type="text"
                        placeholder="Lastname"
                        id="lastname"
                        style={textbox_radius}
                        onChange={(e) =>
                          this.setState({ lastname: e.target.value })
                        }
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-person-circle icon-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path
                          fillRule="evenodd"
                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                        />
                      </svg>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="form-inside left-inner-addon">
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        id="ud_phone"
                        style={textbox_radius}
                        onChange={(e) =>
                          this.setState({ ud_phone: e.target.value })
                        }
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-telephone-fill icon-circle"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                        />
                      </svg>
                    </div>
                  </Form.Group>

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

                  <Form.Group className="mb-3" style={{ paddingTop: "30px" }}>
                    <div className="form-inside">
                      <Select
                        id="country_id"
                        options={list_country}
                        styles={customStyles}
                        onInputChange={this.getCountry}
                        onChange={this.setCountry_id}
                        value={defaultCountry}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-flag-fill icon-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
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
