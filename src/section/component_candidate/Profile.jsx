import React, { Component, Suspense } from "react";
import {
  Badge,
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
import styled from "styled-components";
import axios from "axios";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import ProfileUpdate from "./ProfileUpdate";
import Experience from "./Experience";
import Education from "./Education";
import Language from "./Language";
import Skills from "./Skills";
import Portfolio from "./Portfolio";

import EmptyImageProfile from "../../asset/images/no-user-image-icon-26.jpg";
import EmptyImageCover from "../../asset/images/blank-facebook-cover-ivory.png";

import Common from "../../common";
import Functions from "../../functions";

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

const SpanStyle = styled.div`
  .tagevent:hover {
    color: red;
    cursor: pointer;
  }
`;

export default class Profile extends Component {
  state = {
    filecore: "",
    filecore_cover: "",
    image_profile:
      user_image_prifile === ""
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
    profilePageControl: "profile",

    work_type_data: [],
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

  getRating = async () => {
    try {
      await axios
        .get(Common.API_URL + `userpart2/rating/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          let rating_result = res.result;
          this.renderStar(rating_result);
        });
    } catch (error) {
      console.log(error);
    }
  };

  getWorktypeData = async () => {
    try {
      await axios
        .get(Common.API_URL + `userpart2/worktype/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;

          this.setState({ work_type_data: res });
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
  renderStar = (value) => {
    let count = value;
    let remaining = 5 - count;
    let half_start = String(remaining).slice(2, 3);

    let obj = [];
    // star fill
    for (let i = 1; i <= count; i++) {
      let star = `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="currentColor"
      className="bi bi-star-fill"
      viewBox="0 0 16 16"
    >
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
    </svg>`;
      obj.push(star);
    }
    // star half
    let r_h_s = "";
    if (half_start >= 1) {
      r_h_s = `<svg xmlns="http://www.w3.org/2000/svg" 
      width="32"
      height="32" 
      fill="currentColor" 
      className="bi bi-star-half" 
      viewBox="0 0 16 16">
      <path d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z"/>
    </svg>`;
    }
    // star blank

    for (let i = 1; i <= remaining; i++) {
      let star = `<svg xmlns="http://www.w3.org/2000/svg" 
      width="32"
      height="32" 
      fill="currentColor" 
      className="bi bi-star" viewBox="0 0 16 16">
      <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
    </svg>`;
      obj.push(star);
    }

    document.getElementById("show_star").innerHTML = obj + r_h_s;
  };

  componentDidMount() {
    this.getRating();
    this.getWorktypeData();
  }

  render() {
    const { coverObjectPosition } = this.state;
    const { slide_number } = this.state;
    const { profilePageControl } = this.state;
    const { work_type_data } = this.state;

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
        {/* {JSON.stringify(work_type_data)} */}
        {/* Cover */}
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

        {/* End Cover */}
        {/* Nav Menu */}
        <Nav
          fill
          variant="tabs"
          defaultActiveKey=""
          // style={{ backgroundColor: "#242526" }}
        >
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
              Notification
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="link-4"
              onClick={(e) => this.setState({ openOffcanvas: true })}
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
        </Nav>
        {/*End Nav Menu */}

        <Row
          style={{
            paddingTop: "20px",
            padding: "10px",
          }}
        >
          {/* User Profile Card */}
          <Col sm="12" md="6" lg="3">
            <Card>
              <Card.Header align="center">
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
                  onChange={(e) => this.readURL(e, "imgcover")}
                  id="coverupload"
                  style={{ display: "none" }}
                />
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

                {/* Star Rating */}
                <div style={{ color: "#FFCA0B" }}>
                  <span id="show_star"></span>
                </div>
                {/*End Star Rating */}
                {/* Tag */}
                <SpanStyle>
                  <div>
                    {work_type_data.map((rs, i) => (
                      <span key={i}>
                        <Badge bg="info" className="tagevent">
                          {rs.user_work_child.wc_name}
                        </Badge>{" "}
                      </span>
                    ))}
                  </div>
                </SpanStyle>
                {/* End Tag */}
              </Card.Header>
              {/* Menu */}
              <ListGroup variant="flush">
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
                    this.setState({ profilePageControl: "education" })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-mortarboard-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z" />
                    <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z" />
                  </svg>{" "}
                  Education
                </ListGroup.Item>
                <ListGroup.Item
                  onClick={(e) =>
                    this.setState({ profilePageControl: "experience" })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-building-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3v-3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V16h3a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H3Zm1 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5ZM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM7.5 5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM4.5 8h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Z" />
                  </svg>{" "}
                  Experience
                </ListGroup.Item>
                <ListGroup.Item
                  onClick={(e) =>
                    this.setState({ profilePageControl: "language" })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-translate"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286H4.545zm1.634-.736L5.5 3.956h-.049l-.679 2.022H6.18z" />
                    <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm7.138 9.995c.193.301.402.583.63.846-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6.066 6.066 0 0 1-.415-.492 1.988 1.988 0 0 1-.94.31z" />
                  </svg>{" "}
                  Language
                </ListGroup.Item>

                <ListGroup.Item
                  onClick={(e) =>
                    this.setState({ profilePageControl: "skills" })
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
                  Skills
                </ListGroup.Item>
                <ListGroup.Item
                  onClick={(e) =>
                    this.setState({ profilePageControl: "portfolio" })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-person-rolodex"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 9.05a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    <path d="M1 1a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h.5a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h.5a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6.707L6 1.293A1 1 0 0 0 5.293 1H1Zm0 1h4.293L6 2.707A1 1 0 0 0 6.707 3H15v10h-.085a1.5 1.5 0 0 0-2.4-.63C11.885 11.223 10.554 10 8 10c-2.555 0-3.886 1.224-4.514 2.37a1.5 1.5 0 0 0-2.4.63H1V2Z" />
                  </svg>{" "}
                  Portfolio
                </ListGroup.Item>
              </ListGroup>

              {/*End Menu */}
            </Card>
          </Col>
          {/* End User Profile Card */}
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
                {profilePageControl === "profile" && <ProfileUpdate />}
                {profilePageControl === "education" && <Education />}
                {profilePageControl === "experience" && <Experience />}
                {profilePageControl === "language" && <Language />}
                {profilePageControl === "skills" && <Skills />}
                {profilePageControl === "portfolio" && <Portfolio />}
              </div>
            </Suspense>
          </Col>
          {/*Show Content  */}
        </Row>

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
                    disabled={user_image_cover === "" ? true : false}
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
