import React, { Component } from "react";
import {
  Card,
  Badge,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Image,
} from "react-bootstrap";

import axios from "axios";
import Select from "react-select";
import styled from "styled-components";
import Swal from "sweetalert2";

import Common from "../../common";
import Functions from "../../functions";
import karmaIcon from "../../asset/images/icon-karma.svg";

const degree_list = Functions.degree_type;
const d = new Date();
const year_present = d.getFullYear();
const list_year = Functions.get_year_option(year_present - 25, year_present);
const user_id = Common.getUserLoginData.user_id;
const textbox_radius = { borderRadius: "40px" };
const button_radius = { borderRadius: "25px" };
const customStyles = {
  control: (base) => ({
    ...base,
    height: 80,
    minHeight: 80,
    borderRadius: "40px",
    paddingLeft: "60px !important",
  }),
};

const CardStyle = styled.div`
  .feature {
    position: relative;
    max-width: 42rem;
    height: 32rem;
    margin: 2rem auto;
    padding: 2em;
    border-radius: 0.75em;
    box-shadow: 5px 5px 20px rgba(0 0 0/0.15);
    text-align: left;
    transition: transform 200ms ease-in;
  }

  .feature:hover {
    transform: scale(1.03);
  }

  .feature__desc {
    margin-top: 0.5em;
    color: #a3adc9;
  }

  .feature__img {
    position: absolute;
    bottom: 10%;
    right: 10%;
  }

  .feature-one {
    border-top: 5px solid #fcaf4a;
  }

  /* media queries */

  @media (min-width: 1000px) {
    body {
      align-items: center;
      min-height: 100vh;
    }

    section {
      max-width: 200rem;
    }

    .section__title {
      margin: 0 auto;
      max-width: 40%;
      font-size: 2rem;
    }

    .section__desc {
      max-width: 55ch;
      margin: 1rem auto 1rem;
    }

    .features {
      display: flex;
      gap: 2rem;
    }

    .feature-one {
      margin: auto 0;
    }
  }
`;

export default class Education extends Component {
  state = {
    edu_id: 0,
    edu_degree: 0,
    edu_faculty: "",
    edu_major: "",
    edu_graduation_year: "",
    edu_gpa: 0,
    active: 1,

    institution_id: 0,

    defaultInstitution: {
      value: 0,
      label: "Search  institution",
    },
    list_institution: [],
    data: [],
    isOpenModal: false,
    isOpenModalDelete: false,

    isOpenTextBox: false,
    institution_name: "",
  };

  refreshData = async () => {
    try {
      await axios
        .get(Common.API_URL + `user/education/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ data: res });
        });
    } catch (error) {
      console.log(error);
    }
  };

  getInstitution = (newValue) => {
    // console.log(newValue);
    try {
      axios
        .post(
          Common.API_URL + "masterdata/institution/get/all",
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
              value: obj.institution_id,
              label: obj.institution_name,
            });
          }
          //   console.log(arr);

          new Promise((accept) => {
            setTimeout(() => {
              this.setState(
                {
                  list_institution: arr,
                },
                accept
              );
            }, 1000);
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  filterDegree = (id) => {
    if (id === 0 || id === undefined || id === null) {
      return false;
    }
    var r = degree_list.filter(function (entry) {
      return entry.degree_id === id;
    });

    return r;
  };

  setInstitution = async (e) => {
    this.setState({ institution_id: e.value, defaultInstitution: e });
  };

  handleSubmit = () => {
    if (
      this.state.edu_degree === 0 ||
      this.state.edu_faculty === "" ||
      this.state.edu_major === "" ||
      this.state.edu_graduation_year === 0 ||
      this.state.edu_gpa === 0 ||
      this.state.institution_id === 0
    ) {
      Swal.fire({
        title: "Error!",
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "Continue",
      });

      return false;
    }

    try {
      axios
        .post(
          Common.API_URL + "user/education/create",
          {
            edu_degree: this.state.edu_degree,
            edu_faculty: this.state.edu_faculty,
            edu_major: this.state.edu_major,
            edu_graduation_year: this.state.edu_graduation_year,
            edu_gpa: this.state.edu_gpa,
            active: this.state.active,
            institution_id: this.state.institution_id,
            user_id: user_id,
          },
          Common.options
        )
        .then((res) => {
          this.clearState();
          this.refreshData();
          Swal.fire({
            title: "Successfully",
            text: "Do you want to continue",
            icon: "success",
            confirmButtonText: "OK",
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: "Do you want to continue",
            icon: "error",
            confirmButtonText: "Continue",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  handleEditClick = (res) => {
    this.setState({
      edu_id: res.edu_id,
      edu_degree: res.edu_degree,
      edu_faculty: res.edu_faculty,
      edu_major: res.edu_major,
      edu_graduation_year: res.edu_graduation_year,
      edu_gpa: res.edu_gpa,
      active: res.active,
      institution_id: res.institution_id,

      defaultInstitution: {
        value: res.institution_id,
        label: res.edu_institution.institution_name,
      },
    });
  };
  handleUpdateSubmit = () => {
    if (
      this.state.edu_degree === 0 ||
      this.state.edu_faculty === "" ||
      this.state.edu_major === "" ||
      this.state.edu_graduation_year === 0 ||
      this.state.edu_gpa === 0 ||
      this.state.institution_id === 0
    ) {
      Swal.fire({
        title: "Error!",
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "Continue",
      });
      return false;
    }
    // console.log(this.state.edu_faculty);
    try {
      axios
        .put(
          Common.API_URL + `user/education/${this.state.edu_id}`,
          {
            edu_degree: this.state.edu_degree,
            edu_faculty: this.state.edu_faculty,
            edu_major: this.state.edu_major,
            edu_graduation_year: this.state.edu_graduation_year,
            edu_gpa: this.state.edu_gpa,
            active: this.state.active,
            institution_id: this.state.institution_id,
            user_id: user_id,
          },
          Common.options
        )
        .then((res) => {
          this.clearState();
          this.refreshData();
          Swal.fire({
            title: "Successfully",
            text: "Do you want to continue",
            icon: "success",
            confirmButtonText: "OK",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleDeleteSubmit = () => {
    try {
      axios
        .delete(
          Common.API_URL + `user/education/${this.state.edu_id}`,
          Common.options
        )
        .then((res) => {
          this.clearState();
          this.refreshData();
          Swal.fire({
            title: "Successfully",
            text: "Do you want to continue",
            icon: "success",
            confirmButtonText: "OK",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleAddInstitution = () => {
    if (this.state.institution_name === "") {
      Swal.fire({
        title: "Error!",
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "Continue",
      });
      return false;
    }
    try {
      axios
        .post(
          Common.API_URL + "masterdata/institution/create",
          {
            institution_name: this.state.institution_name,
            active: 1,
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({
            institution_id: res.institution_id,
            isOpenTextBox: false,
            defaultInstitution: {
              value: res.institution_id,
              label: res.institution_name,
            },
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  editOpenTextBox = (id_text, id_value) => {
    document.getElementById(id_text).style.display = "none";
    document.getElementById(id_value).style.display = "block";
  };
  editCloseTextBox = (id_text, id_value) => {
    document.getElementById(id_text).style.display = "block";
    document.getElementById(id_value).style.display = "none";
  };
  clearState = () => {
    this.setState({
      edu_id: 0,
      edu_degree: "",
      edu_faculty: "",
      edu_major: "",
      edu_graduation_year: "",
      edu_gpa: 0,
      active: 1,
      isOpenModal: false,
      isOpenModalDelete: false,
      isOpenTextBox: false,
      defaultInstitution: {
        value: 0,
        label: "Search  institution",
      },
      list_institution: [],
    });
    document.getElementById("edu_degree").value = "";
    document.getElementById("edu_faculty").value = "";
    document.getElementById("edu_major").value = "";
    document.getElementById("edu_graduation_year").value = "";
    document.getElementById("edu_gpa").value = "";
  };

  editPrivacy = async (res, active) => {
    // console.log(active);
    await new Promise((accept) =>
      this.setState(
        {
          edu_id: res.edu_id,
          edu_degree: res.edu_degree,
          edu_faculty: res.edu_faculty,
          edu_major: res.edu_major,
          edu_graduation_year: res.edu_graduation_year,
          edu_gpa: res.edu_gpa,
          active: active,
          institution_id: res.institution_id,
        },
        accept
      )
    );
    this.handleUpdateSubmit();
  };

  componentDidMount() {
    this.refreshData();
  }

  render() {
    // const { isOpenModal } = this.state;
    const { isOpenModalDelete } = this.state;
    const { isOpenTextBox } = this.state;

    const { data } = this.state;
    const { list_institution } = this.state;
    const { defaultInstitution } = this.state;

    return (
      <div>
        <h1>Education</h1>
        <Card>
          <Card.Body>
            <Card.Title>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-plus-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
              </svg>{" "}
              New Education
            </Card.Title>

            <Row>
              <Col lg="6">
                <Form.Group className="mb-3">
                  <div className="form-inside left-inner-addon">
                    <Form.Select
                      onChange={(e) =>
                        this.setState({ edu_degree: e.target.value })
                      }
                      // value={this.state.edu_degree}
                      id="edu_degree"
                      style={textbox_radius}
                    >
                      <option value="0">--Open this select degree--</option>
                      {degree_list.map((v, i) => (
                        <option key={i} value={v.degree_id}>
                          {v.degree_name_eng}
                        </option>
                      ))}
                    </Form.Select>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="currentColor"
                      className="bi bi-mortarboard-fill icon-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z" />
                      <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z" />
                    </svg>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="mb-3">
                  {isOpenTextBox === true && (
                    <div className="form-inside left-inner-addon">
                      <Form.Control
                        placeholder="Institution name"
                        onChange={(e) =>
                          this.setState({ institution_name: e.target.value })
                        }
                        style={textbox_radius}
                        autoComplete="off"
                        maxLength="64"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-building-fill-add icon-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Z" />
                        <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7.256A4.493 4.493 0 0 0 12.5 8a4.493 4.493 0 0 0-3.59 1.787A.498.498 0 0 0 9 9.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .39-.187A4.476 4.476 0 0 0 8.027 12H6.5a.5.5 0 0 0-.5.5V16H3a1 1 0 0 1-1-1V1Zm2 1.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5Zm3 0v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5Zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1ZM4 5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5ZM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Zm2.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5ZM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Z" />
                      </svg>
                    </div>
                  )}
                  {isOpenTextBox === false && (
                    <div className="form-inside">
                      <Select
                        id="institution_id"
                        options={list_institution}
                        onInputChange={this.getInstitution}
                        styles={customStyles}
                        onChange={this.setInstitution}
                        value={defaultInstitution}
                        cacheOptions
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-building-fill icon-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3v-3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V16h3a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H3Zm1 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5ZM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM7.5 5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM4.5 8h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Z" />
                      </svg>
                    </div>
                  )}

                  <div align="right">
                    {isOpenTextBox === false && (
                      <Badge
                        bg="success"
                        onClick={() => this.setState({ isOpenTextBox: true })}
                        style={{ cursor: "pointer" }}
                      >
                        Add Institution
                      </Badge>
                    )}
                    {isOpenTextBox === true && (
                      <div>
                        <Badge
                          bg="success"
                          onClick={this.handleAddInstitution}
                          style={{ cursor: "pointer" }}
                        >
                          Save
                        </Badge>{" "}
                        <Badge
                          bg="danger"
                          onClick={() =>
                            this.setState({ isOpenTextBox: false })
                          }
                          style={{ cursor: "pointer" }}
                        >
                          Cancle
                        </Badge>
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="mb-3">
                  <div className="form-inside left-inner-addon">
                    <Form.Control
                      type="text"
                      id="edu_faculty"
                      onChange={(e) =>
                        this.setState({ edu_faculty: e.target.value })
                      }
                      // defaultValue={this.state.edu_faculty}
                      style={textbox_radius}
                      placeholder="Faculty"
                      autoComplete="off"
                      maxLength="72"
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
              </Col>

              <Col lg="6">
                <Form.Group className="mb-3">
                  <div className="form-inside left-inner-addon">
                    <Form.Control
                      type="text"
                      id="edu_major"
                      onChange={(e) =>
                        this.setState({ edu_major: e.target.value })
                      }
                      // defaultValue={this.state.edu_major}
                      placeholder="Major"
                      style={textbox_radius}
                      autoComplete="off"
                      maxLength="72"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-book-fill icon-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
                    </svg>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="mb-3">
                  <div className="form-inside left-inner-addon">
                    <Form.Select
                      onChange={(e) =>
                        this.setState({ edu_graduation_year: e.target.value })
                      }
                      // value={this.state.edu_graduation_year}
                      style={textbox_radius}
                      id="edu_graduation_year"
                    >
                      <option value="">--Graduation Year--</option>
                      {list_year.map((value, index) => (
                        <option value={value} key={index}>
                          {value}
                        </option>
                      ))}
                    </Form.Select>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-calendar-check-fill icon-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-5.146-5.146-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                    </svg>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <div className="form-inside left-inner-addon">
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      id="edu_gpa"
                      onChange={(e) =>
                        this.setState({ edu_gpa: e.target.value })
                      }
                      // defaultValue={this.state.edu_gpa}
                      style={textbox_radius}
                      placeholder="GPA"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-award-fill icon-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z" />
                      <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z" />
                    </svg>
                  </Form.Group>
                </div>
              </Col>
            </Row>
            <div align="center">
              <Button
                variant="primary"
                onClick={this.handleSubmit}
                style={button_radius}
              >
                Save
              </Button>
            </div>
          </Card.Body>
        </Card>
        <div style={{ paddingTop: "25px" }}>
          <CardStyle>
            <Row>
              {data.map((rs, index) => (
                <Col lg="6" md="6" sm="12" key={index}>
                  <div className="feature feature-one">
                    <h2 className="feature__title">
                      {rs.edu_institution.institution_name}
                    </h2>
                    {/* Year */}
                    <div align="left">
                      <span
                        className="mb-2 text-muted"
                        id={`edu_graduation_year_text_${rs.edu_id}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => [
                          this.editOpenTextBox(
                            `edu_graduation_year_text_${rs.edu_id}`,
                            `edu_graduation_year_value_${rs.edu_id}`
                          ),
                          this.handleEditClick(rs),
                        ]}
                      >
                        <Badge bg="secondary">
                          Graduation Year : {rs.edu_graduation_year}
                        </Badge>
                      </span>
                      <div
                        id={`edu_graduation_year_value_${rs.edu_id}`}
                        style={{ display: "none" }}
                        align="right"
                      >
                        <Form.Select
                          onChange={(e) =>
                            this.setState({
                              edu_graduation_year: e.target.value,
                            })
                          }
                          value={this.state.edu_graduation_year}
                          style={textbox_radius}
                        >
                          <option value="">--Graduation Year--</option>
                          {list_year.map((value, index) => (
                            <option value={value} key={index}>
                              {value}
                            </option>
                          ))}
                        </Form.Select>
                        <Badge
                          bg="success"
                          style={{ cursor: "pointer" }}
                          onClick={() => [
                            this.editCloseTextBox(
                              `edu_graduation_year_text_${rs.edu_id}`,
                              `edu_graduation_year_value_${rs.edu_id}`
                            ),
                            this.handleUpdateSubmit(),
                          ]}
                        >
                          Save
                        </Badge>{" "}
                        <Badge
                          bg="danger"
                          onClick={() =>
                            this.editCloseTextBox(
                              `edu_graduation_year_text_${rs.edu_id}`,
                              `edu_graduation_year_value_${rs.edu_id}`
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          Cancle
                        </Badge>
                      </div>
                    </div>
                    {/*End Year */}
                    <div className="feature__desc">
                      {/* Faculty */}
                      <div style={{ paddingTop: "5px" }}>
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
                        <strong className="mb-2 text-muted"> Faculty : </strong>{" "}
                        <span
                          className="mb-2 text-muted"
                          id={`edu_faculty_text_${rs.edu_id}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => [
                            this.editOpenTextBox(
                              `edu_faculty_text_${rs.edu_id}`,
                              `edu_faculty_value_${rs.edu_id}`
                            ),
                            this.handleEditClick(rs),
                          ]}
                        >
                          {rs.edu_faculty}
                        </span>
                        <div
                          id={`edu_faculty_value_${rs.edu_id}`}
                          style={{ display: "none" }}
                          align="right"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Faculty"
                            defaultValue={rs.edu_faculty}
                            onChange={(e) =>
                              this.setState({ edu_faculty: e.target.value })
                            }
                            style={textbox_radius}
                            maxLength="72"
                          />
                          <Badge
                            bg="success"
                            style={{ cursor: "pointer" }}
                            onClick={() => [
                              this.editCloseTextBox(
                                `edu_faculty_text_${rs.edu_id}`,
                                `edu_faculty_value_${rs.edu_id}`
                              ),
                              this.handleUpdateSubmit(),
                            ]}
                          >
                            Save
                          </Badge>{" "}
                          <Badge
                            bg="danger"
                            onClick={() =>
                              this.editCloseTextBox(
                                `edu_faculty_text_${rs.edu_id}`,
                                `edu_faculty_value_${rs.edu_id}`
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            Cancle
                          </Badge>
                        </div>
                      </div>
                      {/*End Faculty */}
                      {/* Major */}
                      <div style={{ paddingTop: "5px" }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-book-fill icon-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
                        </svg>{" "}
                        <strong className="mb-2 text-muted">Major : </strong>
                        <span
                          className="mb-2 text-muted"
                          id={`edu_major_text_${rs.edu_id}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => [
                            this.editOpenTextBox(
                              `edu_major_text_${rs.edu_id}`,
                              `edu_major_value_${rs.edu_id}`
                            ),
                            this.handleEditClick(rs),
                          ]}
                        >
                          {rs.edu_major}
                        </span>
                        <div
                          id={`edu_major_value_${rs.edu_id}`}
                          style={{ display: "none" }}
                          align="right"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Faculty"
                            defaultValue={rs.edu_major}
                            onChange={(e) =>
                              this.setState({ edu_major: e.target.value })
                            }
                            style={textbox_radius}
                            maxLength="72"
                          />
                          <Badge
                            bg="success"
                            style={{ cursor: "pointer" }}
                            onClick={() => [
                              this.editCloseTextBox(
                                `edu_major_text_${rs.edu_id}`,
                                `edu_major_value_${rs.edu_id}`
                              ),
                              this.handleUpdateSubmit(),
                            ]}
                          >
                            Save
                          </Badge>{" "}
                          <Badge
                            bg="danger"
                            onClick={() =>
                              this.editCloseTextBox(
                                `edu_major_text_${rs.edu_id}`,
                                `edu_major_value_${rs.edu_id}`
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            Cancle
                          </Badge>
                        </div>
                      </div>
                      {/*End Major */}
                      {/* Degree */}
                      <div style={{ paddingTop: "5px" }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-mortarboard-fill icon-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z" />
                          <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z" />
                        </svg>{" "}
                        <strong className="mb-2 text-muted">Degree : </strong>{" "}
                        <span
                          className="mb-2 text-muted"
                          id={`edu_degree_text_${rs.edu_id}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => [
                            this.editOpenTextBox(
                              `edu_degree_text_${rs.edu_id}`,
                              `edu_degree_value_${rs.edu_id}`
                            ),
                            this.handleEditClick(rs),
                          ]}
                        >
                          {
                            this.filterDegree(parseInt(rs.edu_degree))[0]
                              .degree_name_eng
                          }
                        </span>
                        <div
                          id={`edu_degree_value_${rs.edu_id}`}
                          style={{ display: "none" }}
                          align="right"
                        >
                          <Form.Select
                            onChange={(e) =>
                              this.setState({ edu_degree: e.target.value })
                            }
                            value={this.state.edu_degree}
                            id="edu_degree"
                            style={textbox_radius}
                          >
                            {degree_list.map((v, i) => (
                              <option key={i} value={v.degree_id}>
                                {v.degree_name_eng}
                              </option>
                            ))}
                          </Form.Select>
                          <Badge
                            bg="success"
                            style={{ cursor: "pointer" }}
                            onClick={() => [
                              this.editCloseTextBox(
                                `edu_degree_text_${rs.edu_id}`,
                                `edu_degree_value_${rs.edu_id}`
                              ),
                              this.handleUpdateSubmit(),
                            ]}
                          >
                            Save
                          </Badge>{" "}
                          <Badge
                            bg="danger"
                            onClick={() =>
                              this.editCloseTextBox(
                                `edu_degree_text_${rs.edu_id}`,
                                `edu_degree_value_${rs.edu_id}`
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            Cancle
                          </Badge>
                        </div>
                      </div>
                      {/*End Degree */}
                      {/* GPA */}
                      <div style={{ paddingTop: "5px" }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-award-fill icon-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z" />
                          <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z" />
                        </svg>{" "}
                        <strong className="mb-2 text-muted">GPA : </strong>{" "}
                        <span
                          className="mb-2 text-muted"
                          id={`edu_gpa_text_${rs.edu_id}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => [
                            this.editOpenTextBox(
                              `edu_gpa_text_${rs.edu_id}`,
                              `edu_gpa_value_${rs.edu_id}`
                            ),
                            this.handleEditClick(rs),
                          ]}
                        >
                          {rs.edu_gpa}
                        </span>
                        <div
                          id={`edu_gpa_value_${rs.edu_id}`}
                          style={{ display: "none" }}
                          align="right"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Faculty"
                            defaultValue={rs.edu_gpa}
                            onChange={(e) =>
                              this.setState({ edu_gpa: e.target.value })
                            }
                            style={textbox_radius}
                          />
                          <Badge
                            bg="success"
                            style={{ cursor: "pointer" }}
                            onClick={() => [
                              this.editCloseTextBox(
                                `edu_gpa_text_${rs.edu_id}`,
                                `edu_gpa_value_${rs.edu_id}`
                              ),
                              this.handleUpdateSubmit(),
                            ]}
                          >
                            Save
                          </Badge>{" "}
                          <Badge
                            bg="danger"
                            onClick={() =>
                              this.editCloseTextBox(
                                `edu_gpa_text_${rs.edu_id}`,
                                `edu_gpa_value_${rs.edu_id}`
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            Cancle
                          </Badge>
                        </div>
                      </div>
                      {/*End GPA */}
                    </div>
                    <Image className="feature__img" src={karmaIcon} />
                  </div>
                  <div align="center" style={{ fontSize: "10px" }}>
                    <span>
                      Create : {Functions.format_date_time(rs.create_date)} ,
                      Update : {Functions.format_date_time(rs.udp_date)}
                    </span>
                    <p>
                      <Button
                        variant="danger"
                        onClick={() => [
                          this.setState({
                            isOpenModalDelete: true,
                            edu_id: rs.edu_id,
                          }),
                        ]}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash3-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                        </svg>{" "}
                        Delete
                      </Button>
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </CardStyle>
        </div>

        <Modal
          size="sm"
          show={isOpenModalDelete}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header>
            <Modal.Title id="example-modal-sizes-title-sm">
              Delete Education
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.clearState()}>
              Close
            </Button>
            <Button variant="danger" onClick={this.handleDeleteSubmit}>
              Confirm Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
