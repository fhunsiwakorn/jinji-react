import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import Common from "../../common";
import Functions from "../../functions";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
export default class MasterDataBusinessType extends Component {
  state = {
    data: [],
    per_page: 25,
    search_value: "",
    page: 1,
    param: [],

    isOpenModal: false,
    isOpenModalDelete: false,
    msg: "",
    institution_id: 0,
    institution_name: "",
    active: 1,
  };
  refreshData = async () => {
    try {
      await axios
        .post(
          Common.API_URL + "masterdata/institution/get/all",
          {
            page: this.state.page,
            per_page: 25,
            search_value: this.state.search_value,
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ data: res.data, param: res });
          //   console.log(res.data);
          //   alert(JSON.stringify(res.data));
        });
    } catch (error) {
      console.log(error);
    }
  };
  handleSubmit = () => {
    if (this.state.institution_name === "") {
      this.setState({ msg: "Invalid data" });
      return false;
    }
    try {
      axios
        .post(
          Common.API_URL + "masterdata/institution/create",
          {
            institution_name: this.state.institution_name,
            active: this.state.active,
          },
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModal: false });
          this.refreshData();
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleClickEdit = (res) => {
    let r = res;
    this.setState({
      institution_id: r.institution_id,
      institution_name: r.institution_name,
      active: r.active,
      msg: "",
    });
  };

  handleSubmitEdit = () => {
    if (this.state.institution_name === "") {
      this.setState({ msg: "Invalid data" });
      return false;
    }
    try {
      axios
        .put(
          Common.API_URL +
            `masterdata/institution/${this.state.institution_id}`,
          {
            institution_name: this.state.institution_name,
            active: this.state.active,
          },
          Common.options
        )
        .then((res) => {
          this.refreshData();
          this.clearState();
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleDelete = () => {
    try {
      axios
        .delete(
          Common.API_URL +
            `masterdata/institution/${this.state.institution_id}`,
          Common.options
        )
        .then((res) => {
          this.setState({ isOpenModalDelete: false });
          this.refreshData();
          this.clearState();
        });
    } catch (error) {
      console.log(error);
    }
  };

  clearState = () => {
    this.setState({
      institution_id: 0,
      institution_name: "",
      active: 1,
      msg: "",
      isOpenModal: false,
      isOpenModalDelete: false,
    });
  };
  onChangeFilter = () => {
    // search_value
    this.refreshData();
  };
  componentDidMount() {
    this.refreshData();
  }

  render() {
    const { data } = this.state;
    const { isOpenModal } = this.state;
    const { isOpenModalDelete } = this.state;
    const { msg } = this.state;
    const { institution_id } = this.state;
    const { param } = this.state;
    const { page } = this.state;
    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>Institution</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>

              <Breadcrumb.Item active>Institution</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>Institution Table</Col>
              <Col sm={4}>
                <div align="right">
                  <Button onClick={(e) => this.setState({ isOpenModal: true })}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-plus-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                    </svg>{" "}
                    Add
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col sm={9}>Total {param.total_data} row</Col>
              <Col sm={3}>
                <Form.Control
                  type="text"
                  placeholder="Search"
                  onChange={(e) => [
                    this.setState({
                      search_value: e.target.value,
                    }),
                    this.onChangeFilter(),
                  ]}
                  onKeyUp={(e) => [
                    this.setState({
                      search_value: e.target.value,
                    }),
                    this.onChangeFilter(),
                  ]}
                />
              </Col>
            </Row>

            <Table striped>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Institution</th>
                  <th>Create Date</th>
                  <th>#</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rs, index) => (
                  <tr key={index}>
                    <td align="center">{index + 1}</td>
                    <td>{rs.institution_name}</td>

                    <td>{Functions.format_date_time(rs.create_date)}</td>
                    <td align="center">
                      <ButtonGroup aria-label="Basic example">
                        <Button
                          variant="warning"
                          onClick={(e) => [
                            this.setState({
                              isOpenModal: true,
                            }),
                            this.handleClickEdit(rs),
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
                          </svg>{" "}
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          onClick={(e) =>
                            this.setState({
                              isOpenModalDelete: true,
                              institution_id: rs.institution_id,
                            })
                          }
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
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Row>
              <Col></Col>
              <Col sm={2}>
                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>หน้าที่</InputGroup.Text>
                  <Form.Control
                    type="number"
                    defaultValue={page}
                    onChange={(e) => [
                      this.setState({
                        page: e.target.value,
                      }),
                      this.onChangeFilter(),
                    ]}
                    onKeyUp={(e) => [
                      this.setState({
                        page: e.target.value,
                      }),
                      this.onChangeFilter(),
                    ]}
                    onClick={(e) => [
                      this.setState({
                        page: e.target.value,
                      }),
                      this.onChangeFilter(),
                    ]}
                    style={{ textAlign: "center" }}
                  />
                  <InputGroup.Text>
                    ทั้งหมด {param.total_page} หน้า
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col></Col>
            </Row>
          </Card.Body>
        </Card>
        {/* Main */}
        <Modal show={isOpenModal}>
          <Modal.Header>
            <Modal.Title> Institution </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {msg !== "" && <Alert variant="danger">{msg}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Institution Name</Form.Label>
              <label style={{ color: "red" }}> *</label>
              <Form.Control
                type="text"
                required
                onChange={(e) =>
                  this.setState({ institution_name: e.target.value })
                }
                defaultValue={this.state.institution_name}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.clearState}>
              Cancle
            </Button>
            <Button
              variant="primary"
              onClick={
                institution_id === 0 ? this.handleSubmit : this.handleSubmitEdit
              }
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={isOpenModalDelete}
          size="sm"
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>Confirm Delete!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.clearState}>
              Cancle
            </Button>
            <Button variant="danger" onClick={this.handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
