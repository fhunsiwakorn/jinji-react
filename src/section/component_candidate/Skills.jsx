import React, { Component } from "react";
import { Row, Col, Button, Badge, Form, Modal, Image } from "react-bootstrap";

import axios from "axios";
import Swal from "sweetalert2";
import styled from "styled-components";

import calculatorIcon from "../../asset/images/icon-calculator.svg";
import Common from "../../common";
const user_id = Common.getUserLoginData.user_id;
const textbox_radius = { borderRadius: "40px" };
const button_radius = { borderRadius: "25px" };

const CardStyle = styled.div`
  .feature {
    position: relative;
    max-width: 21rem;
    height: 17rem;
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
    border-top: 5px solid #549ef2;
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
export default class Skills extends Component {
  state = {
    skill_profile_id: 0,
    skill_id: 0,
    skill_profile_detail: "",
    data: [],
    skilldata: [],
    isOpenModal: false,
    isOpenModalDelete: false,
  };

  refreshData = async () => {
    try {
      await axios
        .get(Common.API_URL + `user/skill_profile/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ data: res });
        });
    } catch (error) {
      console.log(error);
    }
  };

  skillData = async () => {
    try {
      await axios
        .get(Common.API_URL + "masterdata/skill/get/all", Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ skilldata: res });
        });
    } catch (error) {
      console.log(error);
    }
  };
  skillDetail = async (skill_id) => {
    try {
      await axios
        .get(
          Common.API_URL + "masterdata/skill/get/" + skill_id,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ skill_profile_detail: res.description });
        });
    } catch (error) {
      console.log(error);
      this.setState({ skill_profile_detail: "" });
    }
  };
  setStateDetail = (e) => {
    let skill_id = e.target.value;
    this.setState({
      skill_id: skill_id,
    });
    this.skillDetail(skill_id);
  };
  groupConvert = (value) => {
    let text;
    if (value === 1) {
      text = "Computer Skills";
    } else if (value === 2) {
      text = "Competency Skills ";
    } else if (value === 3) {
      text = "Car";
    } else {
      text = "-";
    }
    return text;
  };

  handleSubmit = () => {
    if (this.state.skill_profile_detail === "" || this.state.skill_id === 0) {
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
          Common.API_URL + "user/skill_profile/create",
          {
            skill_profile_detail: this.state.skill_profile_detail,
            skill_id: this.state.skill_id,
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

  handleDeleteSubmit = () => {
    try {
      axios
        .delete(
          Common.API_URL + `user/skill_profile/${this.state.skill_profile_id}`,
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

  clearState = () => {
    this.setState({
      skill_profile_id: 0,
      skill_id: 0,
      skill_profile_detail: "",

      isOpenModalDelete: false,
    });
    document.getElementById("skill_id").value = "";
    // document.getElementById("skill_profile_detail").value = "";
  };

  componentDidMount() {
    this.skillData();
    this.refreshData();
  }
  render() {
    const { data } = this.state;
    const { skilldata } = this.state;
    const { skill_profile_detail } = this.state;

    const { isOpenModalDelete } = this.state;

    return (
      <div>
        <h1>Skills</h1>

        <Row>
          <Col>
            <Form.Select
              style={textbox_radius}
              size="lg"
              onChange={this.setStateDetail}
              id="skill_id"
            >
              <option>--Select--</option>
              {skilldata.map((rs, i) => (
                <optgroup label={rs.main_skill_name} key={i}>
                  {rs.subskills.map((s, m) => (
                    <option value={s.skill_id} key={m}>
                      {s.skill_name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Detail"
              defaultValue={skill_profile_detail}
              style={textbox_radius}
              onChange={(e) =>
                this.setState({ skill_profile_detail: e.target.value })
              }
              id="skill_profile_detail"
              maxLength="48"
            />
          </Col>
          <Col>
            <Button
              style={button_radius}
              variant="primary"
              onClick={this.handleSubmit}
              size="lg"
            >
              Save
            </Button>
          </Col>
        </Row>
        <div style={{ paddingTop: "25px" }}>
          <CardStyle>
            <Row>
              {data.map((rs, index) => (
                <Col lg="4" md="6" sm="12" key={index}>
                  <div className="feature feature-one">
                    <h2 className="feature__title">
                      {rs.skill_profile_child.skill_name}
                    </h2>
                    <Badge bg="secondary">
                      {" "}
                      {this.groupConvert(
                        parseInt(rs.skill_profile_child.skill_group_type)
                      )}
                    </Badge>
                    <p className="feature__desc">{rs.skill_profile_detail}</p>
                    <Image className="feature__img" src={calculatorIcon} />
                  </div>

                  <div align="center" style={{ paddingTop: "10px" }}>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => [
                        this.setState({
                          isOpenModalDelete: true,
                          skill_profile_id: rs.skill_profile_id,
                        }),
                      ]}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                        <path
                          fillRule="evenodd"
                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                        />
                      </svg>{" "}
                      Delete
                    </Button>
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
            <Modal.Title id="example-modal-sizes-title-sm">Delete</Modal.Title>
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
