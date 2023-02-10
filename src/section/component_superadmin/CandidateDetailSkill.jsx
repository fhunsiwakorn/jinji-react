import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Common from "../../common";

import axios from "axios";
export default class CandidateDetailLanguage extends Component {
  state = {
    skill_profile_id: 0,
    skill_id: 0,
    skill_profile_detail: "",
    msg: "",
    skilldata: [],
    isOpenModalDelete: false,
  };

  refreshData = async () => {
    try {
      await axios
        .get(
          Common.API_URL + `user/skill_profile/${this.props.user_id}`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ data: res });
        });
    } catch (error) {
      console.log(error);
    }
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
        });
    } catch (error) {
      console.log(error);
      this.setState({ msg: "Invalid data" });
    }
  };
  clearState = () => {
    this.setState({
      skill_profile_id: 0,
      skill_id: 0,
      skill_profile_detail: "",
      msg: "",
      isOpenModalDelete: false,
    });
  };

  componentDidMount() {
    this.refreshData();
  }

  render() {
    const { data } = this.state;
    const { isOpenModalDelete } = this.state;
    return (
      <div>
        {data !== undefined && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Detail</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((rs, index) => (
                <tr key={index}>
                  <td>{rs.skill_profile_child.skill_name}</td>
                  <td>{rs.skill_profile_detail}</td>
                  <td align="center">
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
                        className="bi bi-trash-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                      </svg>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
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
