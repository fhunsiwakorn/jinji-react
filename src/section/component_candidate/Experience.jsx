import React, { Component } from "react";

import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  InputGroup,
  Alert,
  Badge,
  Image,
} from "react-bootstrap";

import builderIcon from "../../asset/images/icon-team-builder.svg";
import styled from "styled-components";
import axios from "axios";
import Common from "../../common";
import Functions from "../../functions";
const d = new Date();
const year_present = d.getFullYear();
const list_year = Functions.get_year_option(year_present - 25, year_present);
const user_id = Common.getUserLoginData.user_id;

const CardStyle = styled.div`
  .feature {
    position: relative;
    max-width: 21rem;
    height: 25rem;
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
    border-top: 5px solid #ea5353;
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

export default class Experience extends Component {
  state = {
    exp_id: 0,
    exp_comapany: "",
    exp_year_start: 0,
    exp_year_end: 0,
    exp_last_position: "",
    exp_last_salary: 0,
    exp_responsibility: "",
    active: 1,

    data: [],
    msg: "",
    isOpenModal: false,
    isOpenModalDelete: false,
  };

  refreshData = async () => {
    try {
      await axios
        .get(Common.API_URL + `user/experience/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ data: res });
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleSubmit = () => {
    if (
      this.state.exp_comapany === "" ||
      this.state.exp_year_start === 0 ||
      this.state.exp_year_end === 0 ||
      this.state.exp_last_position === "" ||
      this.state.exp_last_salary === "" ||
      this.state.exp_responsibility === ""
    ) {
      this.setState({ msg: "Invalid data" });
      return false;
    }
    if (
      parseInt(this.state.exp_year_start) > parseInt(this.state.exp_year_end)
    ) {
      this.setState({ msg: "Invalid data" });
      return false;
    }

    try {
      axios
        .post(
          Common.API_URL + `user/experience/create`,
          {
            exp_comapany: this.state.exp_comapany,
            exp_year_start: this.state.exp_year_start,
            exp_year_end: this.state.exp_year_end,
            exp_last_position: this.state.exp_last_position,
            exp_last_salary: this.state.exp_last_salary,
            exp_responsibility: this.state.exp_responsibility,
            active: this.state.active,
            user_id: user_id,
          },
          Common.options
        )
        .then((res) => {
          this.clearState();
          this.refreshData();
        })
        .catch((err) => {
          this.setState({ msg: "Unable to add information" });
        });
    } catch (error) {
      console.log(error);
      this.setState({ msg: "Invalid data" });
    }
  };
  handleEditClick = (res) => {
    this.setState({
      exp_id: res.exp_id,
      exp_comapany: res.exp_comapany,
      exp_year_start: res.exp_year_start,
      exp_year_end: res.exp_year_end,
      exp_last_position: res.exp_last_position,
      exp_last_salary: res.exp_last_salary,
      exp_responsibility: res.exp_responsibility,
    });
  };
  handleUpdateSubmit = () => {
    if (
      this.state.exp_comapany === "" ||
      this.state.exp_year_start === 0 ||
      this.state.exp_year_end === 0 ||
      this.state.exp_last_position === "" ||
      this.state.exp_last_salary === "" ||
      this.state.exp_responsibility === ""
    ) {
      this.setState({ msg: "Invalid data" });
      return false;
    }
    if (
      parseInt(this.state.exp_year_start) > parseInt(this.state.exp_year_end)
    ) {
      this.setState({ msg: "Invalid data" });
      return false;
    }

    try {
      axios
        .put(
          Common.API_URL + `user/experience/${this.state.exp_id}`,
          {
            exp_comapany: this.state.exp_comapany,
            exp_year_start: this.state.exp_year_start,
            exp_year_end: this.state.exp_year_end,
            exp_last_position: this.state.exp_last_position,
            exp_last_salary: this.state.exp_last_salary,
            exp_responsibility: this.state.exp_responsibility,
            active: this.state.active,
            user_id: user_id,
          },
          Common.options
        )
        .then((res) => {
          this.clearState();
          this.refreshData();
        });
    } catch (error) {
      console.log(error);
      this.setState({ msg: "Invalid data" });
    }
  };

  handleDeleteSubmit = () => {
    try {
      axios
        .delete(
          Common.API_URL + `user/experience/${this.state.exp_id}`,
          Common.options
        )
        .then((res) => {
          this.clearState();
          this.refreshData();
        });
    } catch (error) {
      console.log(error);
      this.setState({ msg: "Invalid data" });
    }
  };

  clearState = () => {
    this.setState({
      exp_id: 0,
      exp_comapany: "",
      exp_year_start: "",
      exp_year_end: "",
      exp_last_position: "",
      exp_last_salary: 0,
      exp_responsibility: "",
      active: 1,
      msg: "",
      isOpenModal: false,
      isOpenModalDelete: false,
    });
  };

  editPrivacy = async (res, active) => {
    // console.log(active);
    await new Promise((accept) =>
      this.setState(
        {
          exp_id: res.exp_id,
          exp_comapany: res.exp_comapany,
          exp_year_start: res.exp_year_start,
          exp_year_end: res.exp_year_end,
          exp_last_position: res.exp_last_position,
          exp_last_salary: res.exp_last_salary,
          exp_responsibility: res.exp_responsibility,
          active: active,
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
    const { isOpenModal } = this.state;
    const { isOpenModalDelete } = this.state;

    const { msg } = this.state;
    const { data } = this.state;
    const { exp_id } = this.state;
    return (
      <div>
        <h1>Experience</h1>
        <div align="right" style={{ paddingBottom: "25px" }}>
          <Button
            variant="success"
            onClick={() => this.setState({ isOpenModal: true })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-database-fill-add"
              viewBox="0 0 16 16"
            >
              <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0ZM8 1c-1.573 0-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4s.875 1.755 1.904 2.223C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777C13.125 5.755 14 5.007 14 4s-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1Z" />
              <path d="M2 7v-.839c.457.432 1.004.751 1.49.972C4.722 7.693 6.318 8 8 8s3.278-.307 4.51-.867c.486-.22 1.033-.54 1.49-.972V7c0 .424-.155.802-.411 1.133a4.51 4.51 0 0 0-4.815 1.843A12.31 12.31 0 0 1 8 10c-1.573 0-3.022-.289-4.096-.777C2.875 8.755 2 8.007 2 7Zm6.257 3.998L8 11c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V10c0 1.007.875 1.755 1.904 2.223C4.978 12.711 6.427 13 8 13h.027a4.552 4.552 0 0 1 .23-2.002Zm-.002 3L8 14c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V13c0 1.007.875 1.755 1.904 2.223C4.978 15.711 6.427 16 8 16c.536 0 1.058-.034 1.555-.097a4.507 4.507 0 0 1-1.3-1.905Z" />
            </svg>{" "}
            New Experience
          </Button>
        </div>
        <CardStyle>
          <Row>
            {data.map((rs, index) => (
              <Col lg="4" md="6" sm="12" key={index}>
                <div className="feature feature-one">
                  <h2 className="feature__title">{rs.exp_comapany}</h2>
                  <Badge bg="secondary">{rs.exp_last_position}</Badge>

                  <div className="feature__desc">
                    Year : {rs.exp_year_start} - {rs.exp_year_end} <br />
                    Salary :{" "}
                    {Functions.formatnumberWithcomma(rs.exp_last_salary)} Bath.
                    / Month <br />
                    Responsibility : {rs.exp_responsibility}
                  </div>

                  <Image className="feature__img" src={builderIcon} />
                </div>

                <div align="center">
                  <p style={{ fontSize: "10px" }}>
                    Create : {Functions.format_date_time(rs.create_date)} ,
                    Update : {Functions.format_date_time(rs.udp_date)}
                  </p>
                  <Button
                    variant="warning"
                    onClick={() => [
                      this.setState({
                        isOpenModal: true,
                      }),
                      this.handleEditClick(rs),
                    ]}
                  >
                    {" "}
                    <i className="fas fa-edit"></i> Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => [
                      this.setState({
                        isOpenModalDelete: true,
                        exp_id: rs.exp_id,
                      }),
                    ]}
                  >
                    {" "}
                    <i className="fas fa-trash"></i> Delete
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        </CardStyle>

        <Modal show={isOpenModal}>
          <Modal.Header>
            <Modal.Title>
              {exp_id === 0 ? "Create" : "Update"} Experience
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {msg !== "" && <Alert variant="danger">{msg}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Company's Name</Form.Label>
              <label style={{ color: "red" }}>*</label>
              <Form.Control
                type="text"
                id="exp_comapany"
                onChange={(e) =>
                  this.setState({ exp_comapany: e.target.value })
                }
                defaultValue={this.state.exp_comapany}
                maxLength="64"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <label style={{ color: "red" }}>*</label>
              <InputGroup className="mb-3">
                <Form.Select
                  onChange={(e) =>
                    this.setState({ exp_year_start: e.target.value })
                  }
                  value={this.state.exp_year_start}
                >
                  <option value="">--Year--</option>
                  {list_year.map((value, index) => (
                    <option value={value} key={index}>
                      {value}
                    </option>
                  ))}
                </Form.Select>
                <Form.Select
                  onChange={(e) =>
                    this.setState({ exp_year_end: e.target.value })
                  }
                  value={this.state.exp_year_end}
                >
                  <option value="">--Year--</option>
                  {list_year.map((value, index) => (
                    <option value={value} key={index}>
                      {value}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Position</Form.Label>
              <label style={{ color: "red" }}>*</label>
              <Form.Control
                type="text"
                id="exp_last_position"
                onChange={(e) =>
                  this.setState({ exp_last_position: e.target.value })
                }
                defaultValue={this.state.exp_last_position}
                maxLength="64"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Salary (Bath./Month)</Form.Label>
              <label style={{ color: "red" }}>*</label>
              <Form.Control
                type="text"
                id="exp_last_salary"
                onChange={(e) =>
                  this.setState({ exp_last_salary: e.target.value })
                }
                defaultValue={this.state.exp_last_salary}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Responibility</Form.Label>
              <label style={{ color: "red" }}>*</label>
              <Form.Control
                as="textarea"
                rows={3}
                id="exp_responsibility"
                onChange={(e) =>
                  this.setState({ exp_responsibility: e.target.value })
                }
                maxLength="120"
                defaultValue={this.state.exp_responsibility}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.clearState()}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={
                exp_id === 0 ? this.handleSubmit : this.handleUpdateSubmit
              }
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          size="sm"
          show={isOpenModalDelete}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header>
            <Modal.Title id="example-modal-sizes-title-sm">
              Delete Experience
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
