import React, { Component } from "react";
import { Badge, Card, Col, Row, Nav, Button, Image } from "react-bootstrap";
import styled from "styled-components";
import axios from "axios";
import ReactToPrint from "react-to-print";

import EmptyImageProfile from "../../asset/images/no-user-image-icon-26.jpg";
import EmptyImageCover from "../../asset/images/blank-facebook-cover-ivory.png";

import ResumePDF from "../export_report/ResumePDF";
import Common from "../../common";
import Functions from "../../functions";
import karmaIcon from "../../asset/images/icon-karma.svg";
import builderIcon from "../../asset/images/icon-team-builder.svg";
const degree_list = Functions.degree_type;
const languages = Functions.language_list;
const BASE_IMAGE = Common.IMAGE_URL;
const user_id = Common.getUserLoginData.user_id;
const firstname = Common.getUserLoginData.firstname;
const lastname = Common.getUserLoginData.lastname;
const user_image_prifile = Common.getUserLoginData.user_image_prifile;
const user_image_cover = Common.getUserLoginData.user_image_cover;
const user_image_cover_position =
  Common.getUserLoginData.user_image_cover_position;

const SpanStyle = styled.div`
  .tagevent:hover {
    color: red;
    cursor: pointer;
  }
`;

const CardStyle = styled.div`
  .content {
    background: #e6e2c8;
    width: 80%;
    max-width: 960px;
    min-height: 3.75em;
    margin: 2em auto;
    padding: 1.25em;
    border-radius: 0.313em;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
    line-height: 1.5em;
    color: #292929;
  }

  .ribbon {
    position: relative;
    padding: 0 0.5em;
    font-size: 2em;
    margin: 0 0 0 -0.625em;
    line-height: 1.875em;
    color: #e6e2c8;
    border-radius: 0 0.156em 0.156em 0;
    background: rgb(123, 159, 199);
    box-shadow: -1px 2px 3px rgba(0, 0, 0, 0.5);
  }

  .ribbon:before,
  .ribbon:after {
    position: absolute;
    content: "";
    display: block;
  }

  .ribbon:before {
    width: 0.469em;
    height: 100%;
    padding: 0 0 0.438em;
    top: 0;
    left: -0.469em;
    background: inherit;
    border-radius: 0.313em 0 0 0.313em;
  }

  .ribbon:after {
    width: 0.313em;
    height: 0.313em;
    background: rgba(0, 0, 0, 0.35);
    bottom: -0.313em;
    left: -0.313em;
    border-radius: 0.313em 0 0 0.313em;
    box-shadow: inset -1px 2px 2px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 600px) {
    body {
      font-size: 0.875em;
    }

    .ribbon {
      line-height: 1.143em;
      padding: 0.5em;
    }

    .ribbon:before,
    .ribbon:after {
      font-size: 0.714em;
    }
  }
`;

const CardBoxStyle = styled.div`
  .feature {
    position: relative;
    max-width: 100%;
    height: 15rem;
    margin: 2rem auto;
    padding: 2em;
    border-radius: 0.75em;
    box-shadow: 5px 5px 20px rgba(0 0 0/0.15);
    text-align: left;
    transition: transform 200ms ease-in;
    background-color: white;
  }

  .feature:hover {
    transform: scale(1.03);
  }

  .feature__desc {
    margin-top: 0.5em;
  }

  .feature__img {
    position: absolute;
    bottom: 10%;
    right: 10%;
  }

  .feature-one {
    border-top: 5px solid #fcaf4a;
  }
  .feature-two {
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
    .feature-two {
      margin: auto 0;
    }
  }
`;

const CardLanguageStyle = styled.div`
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
  .card-wrapper:hover {
    transform: scale(1.03);
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

export default class ViewAs extends Component {
  state = {
    image_profile:
      user_image_prifile === ""
        ? EmptyImageProfile
        : BASE_IMAGE + user_image_prifile,
    image_cover:
      user_image_cover === "" ? EmptyImageCover : BASE_IMAGE + user_image_cover,
    coverObjectPosition:
      user_image_cover_position === null
        ? "100% 0%"
        : user_image_cover_position,
    address: "",
    phone: "",
    email: "",

    work_type_data: [],
    edu_list: [],
    exp_list: [],
    language_list: [],
    skill_list: [],
    youtube_path: "",
    pdf_path: "",
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

  getProfile = async () => {
    try {
      await axios
        .get(Common.API_URL + `user/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          let user_detail = res.user_main_detail[0];
          if (user_detail !== undefined) {
            let tambon = user_detail.user_tambon;
            let label =
              tambon.tambon_eng +
              " / " +
              tambon.tambon_thai +
              " - " +
              tambon.district_eng +
              " / " +
              tambon.district_thai +
              " - " +
              tambon.province_eng +
              " / " +
              tambon.province_thai +
              " - " +
              tambon.postcode;

            this.setState({
              address: label,
              phone: user_detail.ud_phone,
              email: res.email,
            });
            // console.log(user_detail.ud_email);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  getEducation = async () => {
    try {
      await axios
        .get(Common.API_URL + `user/education/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ edu_list: res });
        });
    } catch (error) {
      console.log(error);
    }
  };
  getExperience = async () => {
    try {
      await axios
        .get(Common.API_URL + `user/experience/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ exp_list: res });
        });
    } catch (error) {
      console.log(error);
    }
  };
  getLanguage = async () => {
    try {
      await axios
        .get(Common.API_URL + `user/language/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ language_list: res });
        });
    } catch (error) {
      console.log(error);
    }
  };
  getSkill = async () => {
    try {
      await axios
        .get(Common.API_URL + `user/skill_profile/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          this.setState({ skill_list: res });
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
  filterLanguage = (id) => {
    if (id === 0 || id === undefined || id === null) {
      return false;
    }
    var r = languages.filter(function (entry) {
      return entry.language_code === id;
    });

    return r;
  };
  refreshDataPDF = async () => {
    try {
      await axios
        .get(
          Common.API_URL + `userpart2/portfolio/${user_id}?portfolio_type=1`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({
            pdf_path: res.portfolio_path,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  refreshDataYoutube = async () => {
    try {
      await axios
        .get(
          Common.API_URL + `userpart2/portfolio/${user_id}?portfolio_type=2`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({
            youtube_path: res.portfolio_path,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.getRating();
    this.getWorktypeData();
    this.getProfile();
    this.getEducation();
    this.getExperience();
    this.getLanguage();
    this.getSkill();
    this.refreshDataPDF();
    this.refreshDataYoutube();
  }

  render() {
    const { coverObjectPosition } = this.state;
    const { work_type_data } = this.state;
    const { edu_list } = this.state;
    const { exp_list } = this.state;
    const { language_list } = this.state;
    const { skill_list } = this.state;
    const { youtube_path } = this.state;
    const { pdf_path } = this.state;

    return (
      <div>
        {/* {JSON.stringify(Common.getUserLoginData)} */}
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
          className="justify-content-center"
          style={{ backgroundColor: "#242526" }}
        >
          <Nav.Item>
            <Nav.Link eventKey="link-0" style={{ color: "white" }}>
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
                <Image
                  src={this.state.image_profile}
                  style={{ width: "200px", height: "200px" }}
                  id="imgprofile"
                  thumbnail
                  roundedCircle
                />

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
              <div style={{ padding: "15px" }} align="center">
                <h4>
                  {firstname} {lastname}
                </h4>
                {youtube_path !== "" &&
                  Functions.youtube_parser(youtube_path) !== false && (
                    <iframe
                      style={{
                        width: "100%",
                        height: "300px",
                        paddingTop: "20px",
                      }}
                      src={`https://www.youtube.com/embed/${Functions.youtube_parser(
                        youtube_path
                      )}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  )}
              </div>
              {pdf_path !== "" && (
                <div className="d-grid gap-2" style={{ padding: "15px" }}>
                  <Button
                    variant="primary"
                    onClick={() => window.open(BASE_IMAGE + pdf_path)}
                  >
                    Portfolio{" "}
                  </Button>
                </div>
              )}
            </Card>
          </Col>
          {/* End User Profile Card */}
          {/*Show Content  */}
          <Col sm="12" md="6" lg="8">
            <div align="right">
              <ReactToPrint
                trigger={() => (
                  <Button variant="primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-printer-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z" />
                      <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
                    </svg>{" "}
                    PRINT
                  </Button>
                )}
                content={() => this.myRef}
                onAfterPrint={() => this.myRef.getProfile(user_id)}
                onBeforeGetContent={() => this.myRef.getProfile(user_id)}
              />
              <div style={{ display: "none" }}>
                <ResumePDF ref={(el) => (this.myRef = el)} user_id={user_id} />
              </div>
            </div>
            <CardStyle>
              <div>
                <div className="content">
                  {/*  Contact */}
                  <div>
                    <h1 className="ribbon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        className="bi bi-geo-alt-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                      </svg>{" "}
                      Contact
                    </h1>
                    {/* <h2>Responsive? Resize the window.</h2> */}
                    <div style={{ paddingTop: "15px" }}>
                      <p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-pin-map-fill"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8l3-4z"
                          />
                          <path
                            fillRule="evenodd"
                            d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"
                          />
                        </svg>{" "}
                        {this.state.address}
                      </p>
                      <p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-telephone-fill"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                          />
                        </svg>{" "}
                        {this.state.phone}
                      </p>
                      <p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-envelope-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                        </svg>{" "}
                        {this.state.email}
                      </p>
                    </div>
                  </div>
                  {/* End Contact */}
                  <div style={{ paddingTop: "25px" }}>
                    {/* Education */}
                    <h1 className="ribbon">
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
                    </h1>

                    <CardBoxStyle>
                      {edu_list.map((rs, index) => (
                        <div style={{ paddingTop: "20px" }} key={index}>
                          <div className="feature feature-one">
                            <Row>
                              <Col>
                                <h2 className="feature__title">
                                  {rs.edu_institution.institution_name}
                                </h2>
                              </Col>
                              <Col>
                                <div align="right">
                                  <Badge bg="secondary">
                                    Graduation Year : {rs.edu_graduation_year}
                                  </Badge>
                                </div>
                              </Col>
                            </Row>

                            <div className="feature__desc">
                              <p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-buildings-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M15 .5a.5.5 0 0 0-.724-.447l-8 4A.5.5 0 0 0 6 4.5v3.14L.342 9.526A.5.5 0 0 0 0 10v5.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V14h1v1.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5V.5ZM2 11h1v1H2v-1Zm2 0h1v1H4v-1Zm-1 2v1H2v-1h1Zm1 0h1v1H4v-1Zm9-10v1h-1V3h1ZM8 5h1v1H8V5Zm1 2v1H8V7h1ZM8 9h1v1H8V9Zm2 0h1v1h-1V9Zm-1 2v1H8v-1h1Zm1 0h1v1h-1v-1Zm3-2v1h-1V9h1Zm-1 2h1v1h-1v-1Zm-2-4h1v1h-1V7Zm3 0v1h-1V7h1Zm-2-2v1h-1V5h1Zm1 0h1v1h-1V5Z" />
                                </svg>{" "}
                                <strong className="mb-2 text-muted">
                                  Faculty :{" "}
                                </strong>
                                {rs.edu_faculty}
                              </p>
                              <p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-book-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
                                </svg>{" "}
                                <strong className="mb-2 text-muted">
                                  Major :{" "}
                                </strong>
                                {rs.edu_major}
                              </p>
                              <p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-mortarboard-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z" />
                                  <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z" />
                                </svg>{" "}
                                <strong className="mb-2 text-muted">
                                  Degree :{" "}
                                </strong>{" "}
                                {
                                  this.filterDegree(parseInt(rs.edu_degree))[0]
                                    .degree_name_eng
                                }
                              </p>
                              <p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-award-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z" />
                                  <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z" />
                                </svg>{" "}
                                <strong className="mb-2 text-muted">
                                  GPA :{" "}
                                </strong>{" "}
                                {rs.edu_gpa}
                              </p>
                            </div>
                            <Image className="feature__img" src={karmaIcon} />
                          </div>
                        </div>
                      ))}
                    </CardBoxStyle>
                  </div>
                  {/*End Education */}
                  {/* Experience */}
                  <div style={{ paddingTop: "25px" }}>
                    <h1 className="ribbon">
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
                    </h1>

                    <CardBoxStyle>
                      {exp_list.map((rs, index) => (
                        <div style={{ paddingTop: "20px" }} key={index}>
                          <div className="feature feature-two">
                            <Row>
                              <Col>
                                <h2 className="feature__title">
                                  {rs.exp_comapany}
                                </h2>
                              </Col>
                              <Col>
                                <div align="right">
                                  <Badge bg="secondary">
                                    {rs.exp_last_position}
                                  </Badge>
                                </div>
                              </Col>
                            </Row>

                            <div className="feature__desc">
                              <p>
                                <strong>Year : </strong> {rs.exp_year_start} -{" "}
                                {rs.exp_year_end}{" "}
                              </p>
                              <p>
                                <strong>Salary : </strong>{" "}
                                {Functions.formatnumberWithcomma(
                                  rs.exp_last_salary
                                )}{" "}
                                Bath. / Month
                              </p>
                              <p>
                                <strong>Responsibility : </strong>{" "}
                                {rs.exp_responsibility}
                              </p>
                            </div>
                            <Image className="feature__img" src={builderIcon} />
                          </div>
                        </div>
                      ))}
                    </CardBoxStyle>
                  </div>
                  {/*End Experience */}
                  {/* Language */}
                  <div style={{ paddingTop: "25px" }}>
                    <h1 className="ribbon">
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
                    </h1>
                    <CardLanguageStyle>
                      <Row>
                        {language_list.map((rs, index) => (
                          <Col
                            style={{ paddingTop: "100px" }}
                            lg="6"
                            sm="12"
                            key={index}
                          >
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
                                    Overall :{" "}
                                    <strong>{rs.language_overall}</strong>
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
                          </Col>
                        ))}
                      </Row>
                    </CardLanguageStyle>
                  </div>
                  {/*End Language */}
                  {/* Skills */}
                  <div style={{ paddingTop: "25px" }}>
                    <h1 className="ribbon">
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
                    </h1>
                    <div style={{ paddingTop: "15px" }}>
                      {skill_list.map((rs, index) => (
                        <div key={index}>
                          <p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              className="bi bi-rocket-takeoff-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.578 3.578 0 0 0-.108-.563 2.22 2.22 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2.35 2.35 0 0 0-.16-.045 3.797 3.797 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.552 2.552 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526l.24-2.408Zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361.599.599.437 1.732-.36 2.531Z" />
                              <path d="M5.205 10.787a7.632 7.632 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925Z" />
                            </svg>{" "}
                            {rs.skill_profile_child.skill_name}{" "}
                            {rs.skill_profile_detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* End Skills */}
                </div>
              </div>
            </CardStyle>
          </Col>
          {/*Show Content  */}
        </Row>
      </div>
    );
  }
}
