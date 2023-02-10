// https://dev.to/salehmubashar/3-ways-to-add-css-in-react-js-336f
import React, { Component } from "react";
import { Row, Col, Image } from "react-bootstrap";
import styled from "styled-components";
import axios from "axios";

import Common from "../../common";
// import Functions from "../../functions"; no-user-image-icon-26.jpg
import EmptyImageUser from "../../asset/images/no-user-image-icon-26.jpg";
import EmptyImageCover from "../../asset/images/blank-facebook-cover-ivory.png";
const BASE_IMAGE = Common.IMAGE_URL;

const CardStyle = styled.div`
  .animate {
    transition: all 0.5s ease;
  }

  .card-body {
    height: 200px;
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

export default class CandidateCardList extends Component {
  state = {
    per_page: 25,
    data: [],
    isOpenModal: false,
    search_value: "",
    page: 1,
    param: [],
  };
  refreshData = async () => {
    try {
      await axios
        .post(
          Common.API_URL + "userpart2/get/3",
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
        });
    } catch (error) {
      console.log(error);
    }
  };
  componentDidMount() {
    this.refreshData();
  }

  render() {
    const { data } = this.state;
    // const { param } = this.state;
    // const { page } = this.state;

    return (
      <div>
        <CardStyle>
          <Row>
            {data.map((rs, index) => (
              <Col lg="4" md="6" sm="12" key={index}>
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
                        <h4>
                          {rs.firstname} {rs.lastname}
                        </h4>
                        <span>Detail</span>
                      </div>
                      <div className="row d-flex justify-content-between">
                        <div className="col text-center">
                          <span>Button1</span>
                        </div>
                        <div className="col text-center">
                          <span>Button2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer"></div>
                </div>
              </Col>
            ))}
          </Row>
        </CardStyle>
      </div>
    );
  }
}
