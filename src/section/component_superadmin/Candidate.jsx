import React, { Component } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
  Image,
  Modal,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import styled from "styled-components";

import Common from "../../common";
import Functions from "../../functions";
import axios from "axios";

import EmptyImageUser from "../../asset/images/no-user-image-icon-26.jpg";
import EmptyImageCover from "../../asset/images/blank-facebook-cover-ivory.png";
const BASE_IMAGE = Common.IMAGE_URL;
const CardStyle = styled.div`
  .animate {
    transition: all 0.5s ease;
  }

  .card-body {
    height: 100px;
  }

  .img-top {
    overflow: hidden;
    width: auto;
    height: 200px;
    /*   max-height: 30vh; */
  }

  .img-top:hover img {
    transform: scale(1.5);
    filter: grayscale(0%);
  }

  .img-top a span {
    display: block;
    position: absolute;
    background-color: #00ffd1;
    cursor: pointer;
    /*   z-index: 2; */
  }

  .img-top a span:nth-child(1) {
    background-color: #00ffd1;
    right: 0;
    top: 200px;
    width: 100%;
    height: 5px;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.5s ease-in-out;
  }

  .img-top:hover a span:nth-child(1) {
    background-color: #00ffd1;
    transform: scaleX(1);
    transform-origin: left;
    transition: transform 0.5s ease-in-out;
  }

  .img-top a span:nth-child(2) {
    background-color: #00ffd1;
    right: 0;
    top: 0;
    width: 100%;
    height: 5px;
    border-radius: 5px 5px 0 0;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s ease-in-out;
  }

  .img-top:hover a span:nth-child(2) {
    background-color: #00ffd1;
    transform: scaleX(1);
    transform-origin: right;
    transition: transform 0.5s ease-in-out;
  }

  .img-profile {
    width: 100px;
    height: 100px;
    background-color: white;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 0 0 5px white;
  }

  .img-profile:hover {
    box-shadow: 0 0 0 5px #00ffd1;
    transition: box-shadow 0.3s ease-in-out;
  }

  .img-profile:hover img {
    transform: scale(1.5);
    filter: grayscale(0%);
  }

  .card-body img {
    /*   aspect-ratio: 1/1; */
    margin: auto;
    width: 100%;
    height: auto;
    vertical-align: top;
    /* filter: grayscale(100%); */
  }

  .media-bar {
    height: 50px;
    width: 100%;
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    justify-content: space-around;
    align-items: center;
    padding: 5px;
    background-color: #222;
  }
`;
export default class Candidate extends Component {
  state = {
    per_page: 25,
    data: [],
    search_value: "",
    page: 1,
    param: [],
    user_id: "",

    isOpenModal: false,
    isOpenModalDelete: false,

    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    user_image_prifile: "",
    user_image_cover: "",
    user_image_cover_position: "",
    user_type: 3,
    active: 0,
  };
  refreshData = async () => {
    try {
      await axios
        .post(
          Common.API_URL + "user/all?typeuser=3",
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

  handleEditClick = async (res) => {
    let active = res.active;
    let setactvie;
    if (active === 1) {
      setactvie = 0;
    } else {
      setactvie = 1;
    }

    await new Promise((accept) =>
      this.setState(
        {
          user_id: res.user_id,
          username: res.username,
          password: res.password,
          firstname: res.firstname,
          lastname: res.lastname,
          email: res.email,
          user_image_prifile: res.user_image_prifile,
          user_image_cover: res.user_image_cover,
          user_image_cover_position: res.user_image_cover_position,
          user_type: res.user_type,
          active: setactvie,
        },
        accept
      )
    );
    this.handleUpdateSubmit();
  };

  handleUpdateSubmit = () => {
    try {
      axios
        .put(
          Common.API_URL + `user/${this.state.user_id}`,
          {
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            user_image_prifile: this.state.user_image_prifile,
            user_image_cover: this.state.user_image_cover,
            user_image_cover_position: this.state.user_image_cover_position,
            user_type: this.state.user_type,
            active: this.state.active,
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

  handleDelete = () => {
    try {
      axios
        .delete(Common.API_URL + `user/${this.state.user_id}`, Common.options)
        .then((res) => {
          this.setState({ isOpenModalDelete: false });
          this.refreshData();
        });
    } catch (error) {
      console.log(error);
    }
  };

  clearState = () => {
    this.setState({
      user_id: "",
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      email: "",
      user_image_prifile: "",
      user_image_cover: "",
      user_image_cover_position: "",
      user_type: 3,
      active: 0,
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
    const { param } = this.state;
    const { page } = this.state;
    const { isOpenModalDelete } = this.state;
    return (
      <div>
        <Row>
          <Col sm={8}>
            <h3>Candidate</h3>
          </Col>
          <Col sm={4}>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>

              <Breadcrumb.Item active>Candidate</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Card border="info">
          <Card.Header>
            <Row>
              <Col sm={8}>Candidate Table</Col>
              <Col sm={4}>
                {/* <div align="right">
                  <LinkContainer to="/school-addform">
                    <Button>เพิ่มข้อมูล</Button>
                  </LinkContainer>
                </div> */}
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

            <CardStyle>
              <Row>
                {data.map((rs, index) => (
                  <Col lg="3" md="6" sm="12" key={index}>
                    {rs.user_main_detail.length > 0 && (
                      <div align="center">
                        {(rs.user_main_detail[0].ud_code !== "" ||
                          rs.user_main_detail[0].ud_code !== null) && (
                          <span>{rs.user_main_detail[0].ud_code}</span>
                        )}
                      </div>
                    )}
                    <div className="card mb-2 h-100">
                      <div className="img-top">
                        {(rs.user_image_cover === "" ||
                          rs.user_image_cover === null) && (
                          <Image
                            src={EmptyImageCover}
                            className="card-img-top img-fluid animate"
                          />
                        )}
                        {(rs.user_image_cover !== "" ||
                          rs.user_image_cover !== null) && (
                          <Image
                            src={BASE_IMAGE + rs.user_image_cover}
                            className="card-img-top img-fluid animate"
                          />
                        )}
                      </div>

                      <div className="card-body position-relative">
                        <div className="img-profile position-absolute top-0 start-50 translate-middle">
                          {(rs.user_image_prifile === "" ||
                            rs.user_image_prifile === null) && (
                            <Image src={EmptyImageUser} className="animate" />
                          )}
                          {(rs.user_image_prifile !== "" ||
                            rs.user_image_prifile !== null) && (
                            <Image
                              src={BASE_IMAGE + rs.user_image_prifile}
                              className="animate"
                            />
                          )}
                        </div>
                        <div className="row mt-5">
                          <div className="col text-center">
                            <LinkContainer to={`/candidate/${rs.user_id}`}>
                              <Button variant="outline-primary">
                                <h4>
                                  {rs.firstname} {rs.lastname}
                                </h4>
                              </Button>
                            </LinkContainer>
                            <span>{rs.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer">
                        <Row>
                          <Col lg="9" md="6">
                            <div align="center">
                              Create Date{" "}
                              {Functions.format_date_time(rs.create_date)}
                            </div>
                          </Col>
                          <Col lg="3" md="6">
                            <div align="right">
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                defaultChecked={rs.active === 1 ? true : false}
                                onChange={() => this.handleEditClick(rs)}
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>

                    <div align="center">
                      <span>
                        <Button
                          variant="danger"
                          onClick={(e) =>
                            this.setState({
                              isOpenModalDelete: true,
                              user_id: rs.user_id,
                            })
                          }
                        >
                          Delete
                        </Button>
                      </span>
                    </div>
                  </Col>
                ))}
              </Row>
            </CardStyle>

            <div style={{ paddingTop: "70px" }} align="center">
              <div style={{ width: "200px" }}>
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
              </div>
            </div>
          </Card.Body>
        </Card>

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
            <Button
              variant="secondary"
              onClick={(e) => this.setState({ isOpenModalDelete: false })}
            >
              ยกเลิก
            </Button>
            <Button variant="danger" onClick={this.handleDelete}>
              ลบ
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
