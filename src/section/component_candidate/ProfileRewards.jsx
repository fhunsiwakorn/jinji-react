import React, { Component } from "react";
// import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import axios from "axios";
import Common from "../../common";
import Modal from "react-bootstrap/Modal";

const user_id = Common.getUserLoginData.user_id;
const textbox_radius = { borderRadius: "40px" };
const button_radius = { borderRadius: "25px" };
export default class ProfileRewards extends Component {
  state = {
    reward_id: "",
    reward_name: "",
    reward_file_path: "",
    msg: "",
    isOpenModalDelete: false,
    data: [],

    filecore: "",
  };
  refreshData = async () => {
    try {
      await axios
        .get(Common.API_URL + `user/rewards/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ data: res });
        });
    } catch (error) {
      console.log(error);
    }
  };

  uploadFile = async (event) => {
    let file = event.target.files[0];
    const formdata = new FormData();
    formdata.append("file", file);
    try {
      await axios
        .post(Common.API_URL + "general/upload/file", formdata, Common.options)
        .then((res) => {
          // console.log(r.file_path);
          let r = res.data;
          this.setState({
            reward_file_path: r.file_path,
          });
          if (this.state.reward_file_path !== "") {
            this.DeleteFile(this.state.reward_file_path);
          }
          //   this.handleSubmit(user_image_prifile, r.file_path);
        });
    } catch (error) {
      console.log(error);
    }
  };

  DeleteFile = (cover) => {
    try {
      axios
        .delete(
          Common.API_URL + `general/remove/?file_path=${cover}`,
          Common.options
        )
        .then((res) => {
          //
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleSubmit = () => {
    if (this.state.reward_name === "") {
      this.setState({ msg: "Invalid data" });
      return false;
    }

    try {
      axios
        .post(
          Common.API_URL + `user/rewards/create`,
          {
            reward_name: this.state.reward_name,
            reward_file_path: this.state.reward_file_path,
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

  handleEditClick = (res) => {
    this.setState({
      reward_id: res.reward_id,
      reward_name: res.reward_name,
      reward_file_path: res.reward_file_path,
    });
  };

  handleUpdateSubmit = () => {
    if (this.state.reward_name === "") {
      this.setState({ msg: "Invalid data" });
      return false;
    }

    try {
      axios
        .put(
          Common.API_URL + `user/rewards/${this.state.reward_id}`,
          {
            reward_name: this.state.reward_name,
            reward_file_path: this.state.reward_file_path,
            user_id: user_id,
          },
          Common.options
        )
        .then((res) => {
          this.clearState();
          this.refreshData();
          if (this.state.reward_file_path !== "") {
            this.DeleteFile(this.state.reward_file_path);
          }
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
          Common.API_URL + `user/rewards/${this.state.reward_id}`,
          Common.options
        )
        .then((res) => {
          this.clearState();
          this.refreshData();
          if (this.state.reward_file_path !== "") {
            this.DeleteFile(this.state.reward_file_path);
          }
        });
    } catch (error) {
      console.log(error);
      this.setState({ msg: "Invalid data" });
    }
  };

  clearState = () => {
    this.setState({
      reward_id: 0,
      reward_name: "",
      reward_file_path: "",
      msg: "",
      isOpenModalDelete: false,
    });
    document.getElementById("reward_name").value = "";
    document.getElementById("reward_file_path").value = "";
  };
  editOpenTextBox = (id_text, id_value) => {
    document.getElementById(id_text).style.display = "none";
    document.getElementById(id_value).style.display = "block";
  };
  editCloseTextBox = (id_text, id_value) => {
    document.getElementById(id_text).style.display = "block";
    document.getElementById(id_value).style.display = "none";
  };
  componentDidMount() {
    this.refreshData();
  }
  render() {
    const { msg } = this.state;
    const { data } = this.state;
    const { isOpenModalDelete } = this.state;
    return (
      <div>
        <h3
          style={{
            paddingTop: "20px",
          }}
        >
          Rewards
        </h3>
        <div>
          {msg !== "" && <Alert variant="danger">{msg}</Alert>}
          <Row>
            <Col lg="6" md="6">
              <Form.Control
                type="text"
                id="reward_name"
                // defaultValue={this.state.edu_major}
                onChange={(e) => this.setState({ reward_name: e.target.value })}
                placeholder="rewards"
                style={textbox_radius}
                autoComplete="off"
              />
            </Col>
            <Col lg="5">
              <Form.Group className="mb-3">
                <Form.Control
                  type="file"
                  style={textbox_radius}
                  onChange={this.uploadFile}
                  id="reward_file_path"
                />
              </Form.Group>
            </Col>
            <Col lg="1" md="6">
              <Button
                variant="success"
                style={button_radius}
                size="lg"
                onClick={this.handleSubmit}
              >
                Add
              </Button>
            </Col>
          </Row>

          {data.map((rs, index) => (
            <div
              style={{
                paddingTop: "20px",
                // padding: "50px",
              }}
              key={index}
            >
              <Row>
                <Col lg="6" md="6">
                  <div
                    id={`contentShow_${rs.reward_id}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => [
                      this.editOpenTextBox(
                        `contentShow_${rs.reward_id}`,
                        `contentValue_${rs.reward_id}`
                      ),
                      this.handleEditClick(rs),
                    ]}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="3232"
                      fill="currentColor"
                      className="bi bi-emoji-smile-fill icon-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zM4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z" />
                    </svg>
                    <span
                      style={{
                        padding: "10px",
                        fontSize: "32px",
                      }}
                    >
                      {rs.reward_name}
                    </span>
                  </div>
                  <div
                    id={`contentValue_${rs.reward_id}`}
                    style={{ display: "none" }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="rewards"
                      defaultValue={this.state.reward_name}
                      onChange={(e) =>
                        this.setState({ reward_name: e.target.value })
                      }
                      style={textbox_radius}
                    />
                    <Badge
                      bg="success"
                      style={{ cursor: "pointer" }}
                      onClick={() => [
                        this.editCloseTextBox(
                          `contentShow_${rs.reward_id}`,
                          `contentValue_${rs.reward_id}`
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
                          `contentShow_${rs.reward_id}`,
                          `contentValue_${rs.reward_id}`
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      Cancle
                    </Badge>
                  </div>
                </Col>
                <Col lg="5">
                  <div id={`fileShow_${rs.reward_id}`}>
                    <Button variant="primary" size="sm">
                      Preview
                    </Button>
                  </div>
                  <div
                    id={`fileValue_${rs.reward_id}`}
                    style={{ display: "none" }}
                  >
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="file"
                        style={textbox_radius}
                        onChange={this.uploadFile}
                        id="reward_file_path_update"
                      />
                    </Form.Group>
                  </div>
                </Col>
                <Col lg="1" md="6">
                  <div
                    style={{
                      padding: "10px",
                    }}
                    align="right"
                  >
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => [
                        this.setState({
                          isOpenModalDelete: true,
                          reward_id: rs.reward_id,
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
                      </svg>
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </div>

        <Modal
          size="sm"
          show={isOpenModalDelete}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
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
