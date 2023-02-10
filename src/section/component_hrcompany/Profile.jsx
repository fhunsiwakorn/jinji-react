import React, { Component, Suspense } from "react";
import {
  Card,
  Col,
  Row,
  Nav,
  Button,
  ButtonGroup,
  Form,
  ListGroup,
  Offcanvas,
  OverlayTrigger,
  Popover,
  Image,
} from "react-bootstrap";
import axios from "axios";
import Slider from "rc-slider";

import CandidateCardList from "./CandidateCardList";
import ProfileUpdate from "./ProfileUpdate";

import EmptyImageProfile from "../../asset/images/no-user-image-icon-26.jpg";
import EmptyImageCover from "../../asset/images/blank-facebook-cover-ivory.png";

import Common from "../../common";
import Functions from "../../functions";

import "rc-slider/assets/index.css";

const BASE_IMAGE = Common.IMAGE_URL;
const username = Common.getUserLoginData.username;
const user_id = Common.getUserLoginData.user_id;
const firstname = Common.getUserLoginData.firstname;
const lastname = Common.getUserLoginData.lastname;
const email = Common.getUserLoginData.email;
const user_image_prifile = Common.getUserLoginData.user_image_prifile;
const user_image_cover = Common.getUserLoginData.user_image_cover;
const user_image_cover_position =
  Common.getUserLoginData.user_image_cover_position;
const user_type = Common.getUserLoginData.user_type;
let slide_numberDefault;
if (
  user_image_cover_position === undefined ||
  user_image_cover_position === "" ||
  user_image_cover_position === null
) {
  slide_numberDefault = 0;
} else {
  const h = user_image_cover_position.split(" ").pop();
  let set = h.replace("%", "");
  slide_numberDefault = parseInt(set);
}

const style = (React.CSSProperties = {
  height: 400,
  marginBottom: 20,
  marginLeft: 5,
});
const parentStyle = { overflow: "hidden" };
// const button_radius = { borderRadius: "25px" };

export default class Profile extends Component {
  state = {
    filecore: "",
    filecore_cover: "",
    image_profile:
      Functions.check_empty_value(user_image_prifile) === true
        ? EmptyImageProfile
        : BASE_IMAGE + user_image_prifile,
    image_cover:
      Functions.check_empty_value(user_image_cover) === true
        ? EmptyImageCover
        : BASE_IMAGE + user_image_cover,
    slide_number: slide_numberDefault,
    coverObjectPosition:
      user_image_cover_position === null
        ? "100% 0%"
        : user_image_cover_position,

    openOffcanvas: false,
    profilePageControl: "candidate_list",
  };

  handleOffcanvasClose = () => {
    this.setState({
      openOffcanvas: false,
    });
  };
  readURL = (event, id) => {
    if (event.target.files && event.target.files[0]) {
      var output = document.getElementById(id);
      output.src = URL.createObjectURL(event.target.files[0]);
      output.onload = function () {
        URL.revokeObjectURL(output.src); // free memory
      };
      if (id === "imgprofile") {
        this.setState({
          filecore: event,
        });
      } else {
        this.setState({
          filecore_cover: event,
          slide_number: 0,
          coverObjectPosition: `100% 0%`,
        });
      }
    }
  };

  uploadImageProfile = async (event) => {
    let file = event.target.files[0];
    const formdata = new FormData();
    formdata.append("file", file);
    try {
      await axios
        .post(
          Common.API_URL + `general/upload/image?resize=1`,
          formdata,
          Common.options
        )
        .then((res) => {
          if (user_image_prifile !== "") {
            this.DeleteImage(user_image_prifile);
          }

          let r = res.data;
          this.setState({
            image_profile: r.file_url,
          });
          this.handleSubmit(r.file_path, user_image_cover);
          // console.log(r.file_path);
        });
    } catch (error) {
      console.log(error);
    }
  };
  uploadImageCover = async (event) => {
    let file = event.target.files[0];
    const formdata = new FormData();
    formdata.append("file", file);
    try {
      await axios
        .post(
          Common.API_URL + `general/upload/image?resize=0`,
          formdata,
          Common.options
        )
        .then((res) => {
          if (user_image_cover !== "") {
            this.DeleteImage(user_image_cover);
          }

          let r = res.data;
          this.setState({
            image_cover: r.file_url,
          });
          this.handleSubmit(user_image_prifile, r.file_path);
          // console.log(r.file_path);
        });
    } catch (error) {
      console.log(error);
    }
  };

  DeleteImage = (cover) => {
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

  handleSubmit = (new_image_prifile, new_image_cover) => {
    try {
      axios
        .put(
          Common.API_URL + `user/${user_id}`,
          {
            username: username,
            password: "", //ถ้าใส่ค่าว่าง ระบบจะไม่เปลี่ยน password เดิม
            firstname: firstname,
            lastname: lastname,
            email: email,
            user_image_prifile: new_image_prifile,
            user_image_cover: new_image_cover,
            user_image_cover_position: this.state.coverObjectPosition,
            user_type: user_type,
            active: 1,
          },
          Common.options
        )
        .then((res) => {
          Functions.setUserStorage(
            user_id,
            username,
            firstname,
            lastname,
            email,
            new_image_prifile,
            new_image_cover,
            this.state.coverObjectPosition,
            user_type
          );
          window.location.reload();
        });
    } catch (error) {
      console.log(error);
    }
  };

  onClickUploadImg = () => {
    document.getElementById("imageupload").click();
  };
  onClickUploadCover = () => {
    document.getElementById("coverupload").click();
  };
  onSubmit = () => {
    this.uploadImageProfile(this.state.filecore);
  };
  onSubmit2 = () => {
    this.uploadImageCover(this.state.filecore_cover);
  };

  setCoverPosition = (e) => {
    // console.log(e);
    this.setState({
      slide_number: e,
      coverObjectPosition: `100% ${e}%`,
    });
  };
  saveCoverPosition = (e) => {
    this.handleSubmit(user_image_prifile, user_image_cover);
  };
  cancle = () => {
    document.getElementById("imgcover").src = this.state.image_cover;
    this.setState({
      coverObjectPosition: user_image_cover_position,
      filecore_cover: "",
      slide_number: slide_numberDefault,
    });
  };

  render() {
    const { coverObjectPosition } = this.state;
    const { slide_number } = this.state;
    const { profilePageControl } = this.state;

    const popover = (
      <Popover id="popover-basic">
        <Popover.Body>
          <div style={parentStyle}>
            <div style={style}>
              <Slider
                min={0}
                max={100}
                defaultValue={slide_number}
                vertical
                onChange={this.setCoverPosition}
              />
            </div>
          </div>
          {slide_number} %
        </Popover.Body>
      </Popover>
    );

    return (
      <div>
        {/* {JSON.stringify(Common.getUserLoginData)} */}
        {/* Cover */}

        <div>
          <span>
            <Image
              src={this.state.image_cover}
              style={{
                width: "100%",
                height: "450px",
                objectFit: "cover",
                objectPosition: coverObjectPosition,
              }}
              variant="top"
              id="imgcover"
            />
          </span>
        </div>
        {/* End Cover */}
        {/* Nav Menu */}
        <Nav fill variant="tabs" defaultActiveKey="">
          <Nav.Item>
            <Nav.Link eventKey="link-0">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-suit-heart-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z" />
                </svg>
              </div>{" "}
              My Favorite
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-1">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-list-ul"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                  />
                </svg>
              </div>
              Apply List
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-calendar-date-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zm5.402 9.746c.625 0 1.184-.484 1.184-1.18 0-.832-.527-1.23-1.16-1.23-.586 0-1.168.387-1.168 1.21 0 .817.543 1.2 1.144 1.2z" />
                  <path d="M16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-6.664-1.21c-1.11 0-1.656-.767-1.703-1.407h.683c.043.37.387.82 1.051.82.844 0 1.301-.848 1.305-2.164h-.027c-.153.414-.637.79-1.383.79-.852 0-1.676-.61-1.676-1.77 0-1.137.871-1.809 1.797-1.809 1.172 0 1.953.734 1.953 2.668 0 1.805-.742 2.871-2 2.871zm-2.89-5.435v5.332H5.77V8.079h-.012c-.29.156-.883.52-1.258.777V8.16a12.6 12.6 0 0 1 1.313-.805h.632z" />
                </svg>
              </div>
              My Calendar
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-view-as" href="/view-as">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-eye-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                </svg>
              </div>
              View As
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-3">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-bell-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
                </svg>
              </div>
              Notifications
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="link-4"
              onClick={() => this.setState({ openOffcanvas: true })}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-camera-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                  <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
                </svg>{" "}
              </div>
              Edit Cover Photo
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-4">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-megaphone-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-11zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25.222 25.222 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56V3.224zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009a68.14 68.14 0 0 1 .496.008 64 64 0 0 1 1.51.048zm1.39 1.081c.285.021.569.047.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a65.81 65.81 0 0 1 1.692.064c.327.017.65.037.966.06z" />
                </svg>{" "}
              </div>
              Vote
            </Nav.Link>
          </Nav.Item>
        </Nav>
        {/*End Nav Menu */}
        {/* User Profile Card */}
        <Row
          style={{
            paddingTop: "20px",
            padding: "10px",
          }}
        >
          <Col sm="12" md="6" lg="3">
            <Card>
              <Card.Header align="center">
                <Form.Control
                  type="file"
                  size="sm"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => this.readURL(e, "imgcover")}
                  id="coverupload"
                  style={{ display: "none" }}
                />
                <div className="gallery">
                  <li>
                    <Image
                      src={this.state.image_profile}
                      style={{ width: "200px", height: "200px" }}
                      id="imgprofile"
                      thumbnail
                      roundedCircle
                    />
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={this.onClickUploadImg}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        className="bi bi-camera-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                        <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
                      </svg>
                    </span>
                  </li>
                </div>

                <Form.Control
                  type="file"
                  size="sm"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => this.readURL(e, "imgprofile")}
                  id="imageupload"
                  style={{ display: "none" }}
                />

                {this.state.filecore !== "" && (
                  <Button
                    variant="success"
                    onClick={this.onSubmit}
                    disabled={this.state.filecore === "" ? true : false}
                  >
                    Save
                  </Button>
                )}
              </Card.Header>
              {/* Menu */}
              <ListGroup variant="flush">
                <ListGroup.Item
                  onClick={(e) =>
                    this.setState({ profilePageControl: "candidate_list" })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-person-workspace"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H4Zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.373 5.373 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2H2Z" />
                  </svg>{" "}
                  My Candidate
                </ListGroup.Item>
                <ListGroup.Item
                  onClick={(e) =>
                    this.setState({ profilePageControl: "profile" })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-person-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  </svg>{" "}
                  Profile
                </ListGroup.Item>

                <ListGroup.Item
                  onClick={(e) =>
                    this.setState({ profilePageControl: "profile" })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-person-vcard-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm9 1.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0-.5.5ZM9 8a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4A.5.5 0 0 0 9 8Zm1 2.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5Zm-1 2C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 0 2 13h6.96c.026-.163.04-.33.04-.5ZM7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
                  </svg>{" "}
                  Job Post
                </ListGroup.Item>

                <ListGroup.Item
                  onClick={(e) =>
                    this.setState({ profilePageControl: "profile" })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-graph-up-arrow"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z"
                    />
                  </svg>{" "}
                  Report
                </ListGroup.Item>

                <ListGroup.Item
                  onClick={(e) =>
                    this.setState({ profilePageControl: "profile" })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-trophy-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z" />
                  </svg>{" "}
                  Package
                </ListGroup.Item>
              </ListGroup>
              {/*End Menu */}
            </Card>
          </Col>
          {/*Show Content  */}
          <Col sm="12" md="6" lg="8">
            <Suspense
              fallback={
                <div align="center">
                  <h1>Loading...</h1>
                </div>
              }
            >
              <div>
                {profilePageControl === "candidate_list" && (
                  <CandidateCardList />
                )}
                {profilePageControl === "profile" && <ProfileUpdate />}
              </div>
            </Suspense>
          </Col>
          {/*Show Content  */}
        </Row>

        {/* End User Profile Card */}

        {/* Form edit cover photo */}
        <Offcanvas
          show={this.state.openOffcanvas}
          onHide={this.handleOffcanvasClose}
          placement="bottom"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Edit Cover Photo</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div align="center">
              <ButtonGroup>
                <OverlayTrigger
                  trigger="click"
                  placement="left"
                  overlay={popover}
                >
                  <Button
                    variant="outline-dark"
                    disabled={
                      user_image_cover === "" &&
                      this.state.filecore_cover === ""
                        ? true
                        : false
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      className="bi bi-sliders"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z"
                      />
                    </svg>{" "}
                    Reposition
                  </Button>
                </OverlayTrigger>
                <Button
                  variant="outline-dark"
                  onClick={this.onClickUploadCover}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="bi bi-camera-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                    <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
                  </svg>{" "}
                  Edit Cover Photo
                </Button>
              </ButtonGroup>
              <div>
                {(this.state.filecore_cover !== "" ||
                  user_image_cover_position !== coverObjectPosition) && (
                  <div align="center" style={{ paddingTop: "20px" }}>
                    <Button variant="secondary" onClick={this.cancle}>
                      Cancle
                    </Button>{" "}
                    {slide_number !== "" &&
                      this.state.filecore_cover === "" && (
                        <Button
                          variant="primary"
                          onClick={this.saveCoverPosition}
                        >
                          Save
                        </Button>
                      )}
                    {this.state.filecore_cover !== "" && (
                      <Button variant="primary" onClick={this.onSubmit2}>
                        Save
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
        {/*End Form edit cover photo */}
      </div>
    );
  }
}
