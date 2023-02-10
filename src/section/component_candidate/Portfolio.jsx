import React, { Component } from "react";
import { Row, Col, Button, Form, Card, InputGroup } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

import Functions from "../../functions";
import Common from "../../common";
const user_id = Common.getUserLoginData.user_id;
const BASE_IMAGE = Common.IMAGE_URL;

export default class Portfolio extends Component {
  state = {
    pdf_path: "",
    youtube_path: "",
    active: 1,
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

  uploadFile = async (event) => {
    let file = event.target.files[0];
    const formdata = new FormData();
    formdata.append("file", file);
    if (file.type !== "application/pdf") {
      Swal.fire({
        title: "Fail",
        text: "Only PDFs are valid.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }

    try {
      await axios
        .post(Common.API_URL + "general/upload/file", formdata, Common.options)
        .then((res) => {
          // console.log(r.file_path);
          let r = res.data;
          let portfolio_name = "Portfolio PDF File";
          let portfolio_path = r.file_path;
          let portfolio_type = 1;
          this.handleSubmit(portfolio_name, portfolio_path, portfolio_type);
          this.DeleteFile(this.state.pdf_path);
        });
    } catch (error) {
      console.log(error);
    }
  };
  DeleteFile = (file) => {
    try {
      axios
        .delete(
          Common.API_URL + `general/remove/?file_path=${file}`,
          Common.options
        )
        .then((res) => {
          //
        });
    } catch (error) {
      console.log(error);
    }
  };
  handleSubmit = (portfolio_name, portfolio_path, portfolio_type) => {
    try {
      axios
        .post(
          Common.API_URL + `userpart2/portfolio/${user_id}`,
          {
            portfolio_name: portfolio_name,
            portfolio_path: portfolio_path,
            portfolio_type: portfolio_type,
            active: this.state.active,
          },
          Common.options
        )
        .then((res) => {
          this.refreshDataPDF();
          Swal.fire({
            title: "Successfully",
            text: "Do you want to continue",
            icon: "success",
            confirmButtonText: "OK",
          });
          return false;
        });
    } catch (error) {
      console.log(error);
    }
  };
  formYoutube = () => {
    let portfolio_name = "Portfolio Video Youtube";
    let portfolio_path = this.state.youtube_path;
    let portfolio_type = 2;
    let content = Functions.youtube_parser(portfolio_path);
    if (content === false) {
      Swal.fire({
        title: "Fail",
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    } else {
      this.handleSubmit(portfolio_name, portfolio_path, portfolio_type);
    }
  };
  componentDidMount() {
    this.refreshDataPDF();
    this.refreshDataYoutube();
  }

  render() {
    const { pdf_path } = this.state;
    const { youtube_path } = this.state;
    return (
      <div>
        <h1>Portfolio</h1>
        <div>
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  <h4>Portfolio Priview</h4>
                </Col>
                <Col>
                  <div align="right">
                    <React.Fragment>
                      <Button
                        variant="primary"
                        onClick={() => this.refs.fileInput.click()}
                      >
                        Upload PDF
                      </Button>
                      <Form.Control
                        type="file"
                        onChange={this.uploadFile}
                        id="reward_file_path"
                        ref="fileInput"
                        style={{ display: "none" }}
                        accept=".pdf"
                      />
                    </React.Fragment>
                  </div>
                </Col>
              </Row>

              {pdf_path !== "" && (
                <iframe
                  style={{ width: "100%", height: "750px", paddingTop: "45px" }}
                  src={BASE_IMAGE + pdf_path}
                  title="Portfolio PDF File"
                ></iframe>
              )}
            </Card.Body>
          </Card>
        </div>
        <div style={{ paddingTop: "50px" }}>
          <Card>
            <Card.Body>
              <h4>Video Present</h4>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default">
                      URL Youtube
                    </InputGroup.Text>
                    <Form.Control
                      onChange={(e) =>
                        this.setState({ youtube_path: e.target.value })
                      }
                    />
                  </InputGroup>
                </Col>
                <Col>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={this.formYoutube}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
              <div>
                {youtube_path !== "" &&
                  Functions.youtube_parser(youtube_path) !== false && (
                    <iframe
                      width="100%"
                      height="450"
                      //   src="https://www.youtube.com/embed/CM4CkVFmTds"
                      src={`https://www.youtube.com/embed/${Functions.youtube_parser(
                        youtube_path
                      )}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}
