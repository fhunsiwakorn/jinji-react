import React, { Component } from "react";
import { Row, Col, Button, Modal, Form, Alert, Image } from "react-bootstrap";
import axios from "axios";
import styled from "styled-components";

import Common from "../../common";
import Functions from "../../functions";
const language_list = Functions.language_list;
const user_id = Common.getUserLoginData.user_id;

const CardStyle = styled.div`
  h3 {
    font-size: larger;
    color: rgb(66, 66, 66);
  }
  p {
    color: rgb(136, 136, 136);
  }
  .card-wrapper {
    position: relative;
    height: 280px;
    width: 300px;
    background-color: white;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    transition: 0.5s;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.3);
  }

  .user-pic {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: auto;
    top: -60px;
    width: 150px;
    height: 100px;
    background-color: #c850c0;
    border-radius: 10px;
    box-shadow: 0px 15px 50px rgba(0, 0, 0, 0.35);
    overflow: hidden;
    transition: 0.5s;
  }
  .user-pic img {
    height: 100%;
    display: block;
    /* margin-left: -25%; */
  }
  .name {
    text-align: center;
    position: relative;
    top: 70px;
    transition: 0.5s;
  }

  .social-details {
    position: relative;
    top: 100px;
    display: flex;
    justify-content: center;
    text-align: center;
    gap: 30px;
    opacity: 0;
    transition: 0.5s;
  }

  .card-btn {
    position: relative;
    top: 200px;
    display: flex;
    justify-content: space-evenly;
    gap: 30px;
    padding: 0 50px;
    opacity: 0;
    transition: 0.1s;
  }

  .card-btn button {
    width: 100px;
    padding: 5px 10px;
    font-size: medium;
    font-family: "Poppins", sans-serif;
    background-color: white;
    border-radius: 5px;
    border: 1px solid rgb(136, 136, 136);
    color: rgb(136, 136, 136);
    transition: 0.3s;
  }
`;

export default class Language extends Component {
  state = {
    language_id: 0,
    language_code: "",
    language_overall: "",
    language_type: "",
    language_score: "",
    msg: "",
    data: [],

    isOpenModal: false,
    isOpenModalDelete: false,
  };

  refreshData = async () => {
    try {
      await axios
        .get(Common.API_URL + `user/language/${user_id}`, Common.options)
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
      this.state.language_code === "" ||
      this.state.language_overall === "" ||
      this.state.language_type === "" ||
      this.state.language_score === ""
    ) {
      this.setState({ msg: "Invalid data" });
      return false;
    }

    try {
      axios
        .post(
          Common.API_URL + "user/language/create",
          {
            language_code: this.state.language_code,
            language_overall: this.state.language_overall,
            language_type: this.state.language_type,
            language_score: this.state.language_score,
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
  handleUpdateSubmit = () => {
    if (
      this.state.language_code === "" ||
      this.state.language_overall === "" ||
      this.state.language_type === "" ||
      this.state.language_score === ""
    ) {
      this.setState({ msg: "Invalid data" });
      return false;
    }

    try {
      axios
        .put(
          Common.API_URL + `user/language/${this.state.language_id}`,
          {
            language_code: this.state.language_code,
            language_overall: this.state.language_overall,
            language_type: this.state.language_type,
            language_score: this.state.language_score,
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
          Common.API_URL + `user/language/${this.state.language_id}`,
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

  setStateLanguageCode = (e) => {
    let value = e.target.value;
    let language_code;
    if (value !== 0) {
      language_code = value;
    } else {
      language_code = "";
    }

    this.setState({
      language_code: language_code,
      language_overall: "",
      language_type: "",
      language_score: "",
    });
  };
  setStateLanguagetype = (e) => {
    let value = e.target.value;
    let language_type;
    if (value !== 0) {
      language_type = value;
    } else {
      language_type = "";
    }

    this.setState({
      language_type: language_type,
      language_score: "",
    });
  };

  handleEditClick = (res) => {
    this.setState({
      language_id: res.language_id,
      language_code: res.language_code,
      language_overall: res.language_overall,
      language_type: res.language_type,
      language_score: res.language_score,
    });
  };

  filterLanguage = (id) => {
    if (id === 0 || id === undefined || id === null) {
      return false;
    }
    var r = language_list.filter(function (entry) {
      return entry.language_code === id;
    });

    return r;
  };

  clearState = () => {
    this.setState({
      language_id: 0,
      language_code: "",
      language_overall: "",
      language_type: "",
      language_score: "",

      msg: "",
      isOpenModal: false,
      isOpenModalDelete: false,
    });
  };

  componentDidMount() {
    this.refreshData();
  }
  render() {
    const { language_id } = this.state;
    const { language_code } = this.state;
    const { language_type } = this.state;
    const { msg } = this.state;
    const { data } = this.state;
    const { isOpenModal } = this.state;
    const { isOpenModalDelete } = this.state;
    return (
      <div>
        <h1>Language</h1>
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
            Add Language
          </Button>
        </div>

        <div style={{ paddingTop: "5px" }}>
          <CardStyle>
            <Row>
              {data.map((rs, index) => (
                <Col style={{ paddingTop: "100px" }} lg="4" sm="12" key={index}>
                  <div align="center">
                    <div className="card-wrapper">
                      <div className="user-pic">
                        <Image
                          src={
                            this.filterLanguage(rs.language_code)[0]
                              .language_flag
                          }
                        />
                      </div>

                      <div className="name">
                        <h3>
                          {
                            this.filterLanguage(rs.language_code)[0]
                              .language_name_eng
                          }
                        </h3>
                        <p>
                          Language :{" "}
                          <strong>
                            {
                              this.filterLanguage(rs.language_code)[0]
                                .language_name_eng
                            }
                          </strong>
                        </p>
                        <p>
                          Overall : <strong>{rs.language_overall}</strong>
                        </p>
                        <p>
                          Type : <strong>{rs.language_type}</strong>
                        </p>
                        <p>
                          Score : <strong>{rs.language_score}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div align="center" style={{ paddingTop: "10px" }}>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => [
                        this.setState({
                          isOpenModal: true,
                        }),
                        this.handleEditClick(rs),
                      ]}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil-square"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                        />
                      </svg>
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => [
                        this.setState({
                          isOpenModalDelete: true,
                          language_id: rs.language_id,
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
                      </svg>
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          </CardStyle>
        </div>

        <Modal show={isOpenModal}>
          <Modal.Header>
            <Modal.Title>Create Language</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {msg !== "" && <Alert variant="danger">{msg}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Language</Form.Label>
              <Form.Select
                onChange={this.setStateLanguageCode}
                size="lg"
                defaultValue={this.state.language_code}
              >
                <option value={0}> --Select-- </option>
                {language_list.map((l, index) => (
                  <option value={l.language_code} key={index}>
                    {l.language_name_eng}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Overall</Form.Label>
              <Form.Select
                size="lg"
                onChange={(e) =>
                  this.setState({ language_overall: e.target.value })
                }
                value={this.state.language_overall}
              >
                <option value=""> --Select-- </option>
                <option value="Good"> Good </option>
                <option value="Fair"> Fair </option>
                <option value="Poor"> Poor </option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              {language_code === "" && <Form.Control type="text" readOnly />}

              {language_code === "ENG" && (
                <Form.Select
                  size="lg"
                  onChange={this.setStateLanguagetype}
                  value={this.state.language_type}
                >
                  <option value="0"> --Select-- </option>
                  <option value="TOEIC"> TOEIC </option>
                  <option value="TOEFL"> TOEFL </option>
                </Form.Select>
              )}
              {language_code === "JPN" && (
                <Form.Select
                  size="lg"
                  onChange={this.setStateLanguagetype}
                  value={this.state.language_type}
                >
                  <option value="0"> --Select-- </option>
                  <option value="JLPT"> JLPT </option>
                </Form.Select>
              )}
              {language_code === "KOR" && (
                <Form.Select
                  size="lg"
                  onChange={this.setStateLanguagetype}
                  value={this.state.language_type}
                >
                  <option value="0"> --Select-- </option>
                  <option value="TOPIK"> TOPIK </option>
                </Form.Select>
              )}
              {language_code === "CHN" && (
                <Form.Select
                  size="lg"
                  onChange={this.setStateLanguagetype}
                  value={this.state.language_type}
                >
                  <option value="0"> --Select-- </option>
                  <option value="Writing"> Writing </option>
                  <option value="Speaking"> Speaking </option>
                </Form.Select>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Score</Form.Label>
              {language_code !== "ENG" && language_type === "" && (
                <Form.Control type="text" readOnly />
              )}
              {language_code === "ENG" && (
                <Form.Control
                  type="text"
                  placeholder="Score"
                  onChange={(e) =>
                    this.setState({ language_score: e.target.value })
                  }
                  value={this.state.language_score}
                />
              )}
              {language_code === "JPN" && language_type === "JLPT" && (
                <Form.Select
                  size="lg"
                  onChange={(e) =>
                    this.setState({ language_score: e.target.value })
                  }
                  value={this.state.language_score}
                >
                  <option value=""> --Select-- </option>
                  <option value="N1"> N1 </option>
                  <option value="N2"> N2 </option>
                  <option value="N3"> N3 </option>
                  <option value="N4"> N4 </option>
                  <option value="N5"> N5 </option>
                </Form.Select>
              )}
              {language_code === "KOR" && language_type === "TOPIK" && (
                <Form.Select
                  size="lg"
                  onChange={(e) =>
                    this.setState({ language_score: e.target.value })
                  }
                  value={this.state.language_score}
                >
                  <option value=""> --Select-- </option>
                  <option value="Level 1"> Level 1 </option>
                  <option value="Level 2"> Level 2 </option>
                  <option value="Level 3"> Level 3 </option>
                  <option value="Level 4"> Level 4 </option>
                  <option value="Level 5"> Level 5 </option>
                </Form.Select>
              )}
              {language_code === "CHN" && language_type === "Writing" && (
                <Form.Select
                  size="lg"
                  onChange={(e) =>
                    this.setState({ language_score: e.target.value })
                  }
                  value={this.state.language_score}
                >
                  <option value=""> --Select-- </option>
                  <option value="HSK Level 1"> HSK Level 1 </option>
                  <option value="HSK Level 2"> HSK Level 2 </option>
                  <option value="HSK Level 3"> HSK Level 3 </option>
                  <option value="HSK Level 4"> HSK Level 4 </option>
                  <option value="HSK Level 5"> HSK Level 5 </option>
                </Form.Select>
              )}
              {language_code === "CHN" && language_type === "Speaking" && (
                <Form.Select
                  size="lg"
                  onChange={(e) =>
                    this.setState({ language_score: e.target.value })
                  }
                  value={this.state.language_score}
                >
                  <option value=""> --Select-- </option>
                  <option value="Beginner"> Beginner </option>
                  <option value="Intermediate"> Intermediate </option>
                  <option value="Advanced"> Advanced </option>
                </Form.Select>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.clearState()}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={
                language_id === 0 ? this.handleSubmit : this.handleUpdateSubmit
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
