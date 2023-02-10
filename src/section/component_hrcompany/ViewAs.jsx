import React, { Component } from "react";
import { Card, Col, Row, Nav, Image } from "react-bootstrap";
import styled from "styled-components";
import axios from "axios";

import EmptyImageProfile from "../../asset/images/no-user-image-icon-26.jpg";
import EmptyImageCover from "../../asset/images/blank-facebook-cover-ivory.png";

import Common from "../../common";
import Functions from "../../functions";

const BASE_IMAGE = Common.IMAGE_URL;
const user_id = Common.getUserLoginData.user_id;
const firstname = Common.getUserLoginData.firstname;
const lastname = Common.getUserLoginData.lastname;
const user_image_prifile = Common.getUserLoginData.user_image_prifile;
const user_image_cover = Common.getUserLoginData.user_image_cover;
const user_image_cover_position =
  Common.getUserLoginData.user_image_cover_position;

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

    youtube_path: "",

    firstname: firstname,
    lastname: lastname,
    user_image_prifile: "",
    user_image_cover: "",
    user_image_cover_position: "",
    user_type: 2,
    active: 1,

    // detail
    ud_bio: "",
    ud_birhday: Date,
    ud_gender: 0,
    ud_phone: "",
    email: "",
    ud_address: "",

    // company
    uc_company_name: "",
    uc_company_website: "",
    uc_company_remark1: "",
    uc_company_remark2: "",
    uc_company_cover: "",
  };

  getProfile = async () => {
    try {
      await axios
        .get(Common.API_URL + `user/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          let user_detail = res.user_main_detail[0];
          let user_company = res.user_main_company[0];
          this.setState({
            firstname: res.firstname,
            lastname: res.lastname,
            email: res.email,
          });
          if (user_detail !== undefined) {
            let tambon = user_detail.user_tambon;
            let country = user_detail.user_country;
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
              tambon.postcode +
              " " +
              country.country_name_eng +
              " / " +
              country.country_name_th;

            this.setState({
              address: label,
              phone: user_detail.ud_phone,
              email: res.email,
            });
          }
          if (user_company !== undefined) {
            let label2 = user_company.company_business.bt_name;
            this.setState({
              uc_company_name: user_company.uc_company_name,
              uc_company_website: user_company.uc_company_website,
              uc_company_remark1: user_company.uc_company_remark1,
              uc_company_remark2: user_company.uc_company_remark2,
              uc_company_cover: user_company.uc_company_cover,
              bt_id: user_company.bt_id,
              defaultBusiness: { value: user_company.bt_id, label: label2 },
            });
          }
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
    this.getProfile();
    this.refreshDataYoutube();
  }

  render() {
    const { coverObjectPosition } = this.state;
    const { youtube_path } = this.state;

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
                {this.state.uc_company_cover === "" && (
                  <Image
                    src={EmptyImageProfile}
                    style={{ width: "220px", height: "220px" }}
                    thumbnail
                    id="imglogo"
                  />
                )}
                {this.state.uc_company_cover !== "" && (
                  <Image
                    src={BASE_IMAGE + this.state.uc_company_cover}
                    style={{ width: "220px", height: "220px" }}
                    thumbnail
                    id="imglogo"
                  />
                )}
              </Card.Header>
              {/* Menu */}
              <div style={{ padding: "15px" }} align="center">
                <h4>{this.state.uc_company_name}</h4>
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
            </Card>
          </Col>
          {/* End User Profile Card */}
          {/*Show Content  */}
          <Col sm="12" md="6" lg="8">
            <CardStyle>
              <div>
                <div className="content">
                  {/*  About */}
                  <div>
                    <h1 className="ribbon">
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
                      About
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
                        {this.state.phone} | Contact Person : {firstname}{" "}
                        {lastname}
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
                      <p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-globe"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
                        </svg>{" "}
                        {this.state.uc_company_website}
                      </p>
                    </div>
                  </div>
                  {/* End About */}
                  {/* Company Profile and Business Operation */}
                  {this.state.uc_company_remark1 !== "" && (
                    <div>
                      <h1 className="ribbon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          fill="currentColor"
                          className="bi bi-pin-angle-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z" />
                        </svg>{" "}
                        Company Profile and Business Operation
                      </h1>
                      <div style={{ paddingTop: "15px" }}>
                        <p>{this.state.uc_company_remark1}</p>
                      </div>
                    </div>
                  )}
                  {/*End Company Profile and Business Operation */}
                  {/* Welfare and Benefits */}
                  {this.state.uc_company_remark2 !== "" && (
                    <div>
                      <h1 className="ribbon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          fill="currentColor"
                          className="bi bi-pin-angle-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z" />
                        </svg>{" "}
                        Welfare and Benefits
                      </h1>
                      <div style={{ paddingTop: "15px" }}>
                        <p>{this.state.uc_company_remark2}</p>
                      </div>
                    </div>
                  )}
                  {/* End Welfare and Benefits */}
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
