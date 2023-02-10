import React, { Component } from "react";
import { Badge, Col, Row, Alert, Image } from "react-bootstrap";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import styled from "styled-components";
import Common from "../../common";
import Functions from "../../functions";
import EmptyImageProfile from "../../asset/images/no-user-image-icon-26.jpg";

const degree_set = Functions.degree_type;
const languages = Functions.language_list;

const CardBoxStyle = styled.div`
  #div1 {
    float: left;
    width: 30%;
    height: 100vh;
    background-color: #eec0bf;
  }
  .boxleft {
    padding: 20px;
  }

  #div2 {
    float: left;
    width: 70%;
    height: 100vh;

    background-color: #f4f4f4;
    // border: solid 2px green;
  }
`;

const CardContentStyle = styled.div`
  .content {
    background: #e6e2c8;
    width: 100%;
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
    font-size: 1.5em;
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
`;

const BASE_IMAGE = Common.IMAGE_URL;

export default class ResumePDF extends Component {
  state = {
    image_profile: EmptyImageProfile,
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    email: "",

    language_list: [],
    skill_list: [],
    edu_list: [],
    exp_list: [],
  };

  getProfile = async (user_id) => {
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
            let imgprofile;
            if (
              res.user_image_prifile === "" ||
              res.user_image_prifile === undefined ||
              res.user_image_prifile === null
            ) {
              imgprofile = EmptyImageProfile;
            } else {
              imgprofile = BASE_IMAGE + res.user_image_prifile;
            }
            this.setState({
              firstname: res.firstname,
              lastname: res.lastname,
              email: res.email,
              address: label,
              phone: user_detail.ud_phone,
              image_profile: imgprofile,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  getLanguage = async (user_id) => {
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

  getSkill = async (user_id) => {
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
  getEducation = async (user_id) => {
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
  getExperience = async (user_id) => {
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
  filterDegree = (id) => {
    if (id === 0 || id === undefined || id === null) {
      return false;
    }
    var r = degree_set.filter(function (entry) {
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
  componentDidMount() {
    let user_id = this.props.user_id;
    this.getProfile(user_id);
    this.getLanguage(user_id);
    this.getSkill(user_id);
    this.getEducation(user_id);
    this.getExperience(user_id);
  }

  render() {
    const { language_list } = this.state;
    const { skill_list } = this.state;
    const { edu_list } = this.state;
    const { exp_list } = this.state;

    return (
      <div>
        <CardBoxStyle>
          <div>
            <div id="div1">
              <div
                align="center"
                style={{ backgroundColor: "#f4f4f4", paddingTop: "35px" }}
              >
                <Image
                  style={{
                    width: "150px",
                    height: "150px",
                  }}
                  src={this.state.image_profile}
                  srcSet={this.state.image_profile}
                  thumbnail
                  roundedCircle
                />
                <h1>{this.state.firstname} </h1>
                <h1>{this.state.lastname}</h1>
              </div>

              <div className="boxleft">
                {/* Contact */}
                <div style={{ paddingTop: "5px" }}>
                  <Alert variant="secondary">
                    <div align="center">
                      <h4>CONTACT</h4>
                    </div>
                  </Alert>
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
                {/* End Contact */}

                {/* LANGUAGE */}
                <div style={{ paddingTop: "5px" }}>
                  <Alert variant="secondary">
                    <div align="center">
                      <h4>LANGUAGE</h4>
                    </div>
                  </Alert>

                  {language_list.map((rs, index) => (
                    <div key={index}>
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr>
                            <td>
                              <div style={{ width: "75px", height: "75px" }}>
                                {rs.language_overall === "Poor" && (
                                  <CircularProgressbar
                                    value={30}
                                    text={`30%`}
                                  />
                                )}
                                {rs.language_overall === "Fair" && (
                                  <CircularProgressbar
                                    value={70}
                                    text={`70%`}
                                  />
                                )}
                                {rs.language_overall === "Good" && (
                                  <CircularProgressbar
                                    value={100}
                                    text={`100%`}
                                  />
                                )}
                              </div>
                            </td>
                            <td align="center">
                              {rs.language_code} <br></br>
                              {rs.language_type} : {rs.language_score}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
                {/*END  LANGUAGE */}

                {/* SKILLS */}
                <div style={{ paddingTop: "5px" }}>
                  <Alert variant="secondary">
                    <div align="center">
                      <h4>SKILLS</h4>
                    </div>
                  </Alert>
                  {skill_list.map((rs, index) => (
                    <div key={index}>
                      <p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
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
                {/*End SKILLS */}
              </div>
            </div>
            <div id="div2">
              <CardContentStyle style={{ padding: "15px" }}>
                <div className="content">
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
                    EDUCATION
                  </h1>
                  <div style={{ paddingTop: "15px" }}>
                    {edu_list.map((rs, index) => (
                      <div key={index}>
                        <Row>
                          <Col>
                            <h4>{rs.edu_institution.institution_name}</h4>
                          </Col>
                          <Col>
                            <div align="right">
                              <Badge bg="secondary">
                                Graduation Year : {rs.edu_graduation_year}
                              </Badge>
                            </div>
                          </Col>
                        </Row>
                        <div>
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
                        </div>
                        <div>
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
                          <strong className="mb-2 text-muted">Major : </strong>
                          {rs.edu_major}
                        </div>
                        <div>
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
                          <strong className="mb-2 text-muted">Degree : </strong>{" "}
                          {
                            this.filterDegree(parseInt(rs.edu_degree))[0]
                              .degree_name_eng
                          }
                        </div>
                        <div>
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
                          <strong className="mb-2 text-muted">GPA : </strong>{" "}
                          {rs.edu_gpa}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/*End Education */}
                  {/* EXPERIENCE */}
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
                    EXPERIENCE
                  </h1>
                  <div style={{ paddingTop: "15px" }}>
                    {exp_list.map((rs, index) => (
                      <div key={index}>
                        <Row>
                          <Col>
                            <h4> {rs.exp_comapany}</h4>
                          </Col>
                          <Col>
                            <div align="right">
                              <Badge bg="secondary">
                                {rs.exp_last_position}
                              </Badge>
                            </div>
                          </Col>
                        </Row>
                        <div>
                          <strong>Year : </strong> {rs.exp_year_start} -{" "}
                          {rs.exp_year_end}{" "}
                        </div>
                        <div>
                          <strong>Salary : </strong>{" "}
                          {Functions.formatnumberWithcomma(rs.exp_last_salary)}{" "}
                          Bath. / Month
                        </div>
                        <div>
                          <strong>Responsibility : </strong>{" "}
                          {rs.exp_responsibility}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* End EXPERIENCE */}
                </div>
              </CardContentStyle>
            </div>
          </div>
        </CardBoxStyle>
      </div>
    );
  }
}
//
