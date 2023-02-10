import React, { Component } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Image,
  Form,
  InputGroup,
} from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import Common from "../../common";
import Functions from "../../functions";
import EmptyImageProfile from "../../asset/images/company_nologo.png";
const BASE_IMAGE = Common.IMAGE_URL;
const user_id = Common.getUserLoginData.user_id;
const username = Common.getUserLoginData.username;
const firstname = Common.getUserLoginData.firstname;
const lastname = Common.getUserLoginData.lastname;
const email = Common.getUserLoginData.email;
const customStyles = {
  control: (base) => ({
    ...base,
    height: 45,
    minHeight: 45,
  }),
};

export default class ProfileUpdate extends Component {
  state = {
    // main
    // user_id: 0,
    // username: "",
    // password: "",
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

    youtube_path: "",
    filecore_logo: "",

    bt_id: 0,
    bt_data: [],

    list_business: [],
    defaultBusiness: {
      value: 0,
      label: "Business Type",
    },

    country_id: 19,
    list_country: [],
    defaultCountry: {
      value: 19,
      label: "Thailand - ไทย",
    },

    tambon_id: 0,
    list_tambon: [],
    defaultTambon: {
      value: 0,
      label: "",
    },
  };
  refreshData = async () => {
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
              tambon.postcode;

            this.setState({
              ud_bio: user_detail.ud_bio,
              ud_birhday: user_detail.ud_birhday,
              ud_phone: user_detail.ud_phone,
              ud_gender: user_detail.ud_gender,
              ud_address: user_detail.ud_address,
              tambon_id: user_detail.tambon_id,
              country_id: user_detail.country_id,
              defaultTambon: { value: tambon.tambon_id, label: label },
              defaultCountry: {
                value: country.country_id,
                label:
                  country.country_name_eng + " - " + country.country_name_th,
              },
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

  readURL = (event, id) => {
    if (event.target.files && event.target.files[0]) {
      var output = document.getElementById(id);
      output.src = URL.createObjectURL(event.target.files[0]);
      output.onload = function () {
        URL.revokeObjectURL(output.src); // free memory
      };
      this.setState({
        filecore_logo: event,
      });
    }
  };
  getBusinessType = async () => {
    try {
      await axios
        .get(Common.API_URL + "masterdata/business_type", Common.options)
        .then((response) => {
          let list = response.data;
          var arr = [];
          for (let i = 0; i < list.length; i++) {
            let obj = list[i];
            arr.push({
              value: obj.bt_id,
              label: obj.bt_name,
            });
          }
          //   console.log(arr);
          this.setState({
            list_business: arr,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  getCountry = (newValue) => {
    // console.log(newValue);
    try {
      axios
        .post(
          Common.API_URL + "masterdata/country",
          {
            page: 1,
            per_page: 25,
            search_value: newValue,
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          //   console.log(res.data);
          let list = res.data;
          var arr = [];
          for (let i = 0; i < list.length; i++) {
            let obj = list[i];
            arr.push({
              value: obj.country_id,
              label: obj.country_name_eng + " - " + obj.country_name_th,
            });
          }
          //   console.log(arr);
          this.setState({
            list_country: arr,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  getLocation = (newValue) => {
    // console.log(inputValue);
    try {
      axios
        .post(
          Common.API_URL + "masterdata/tambon",
          {
            page: 1,
            per_page: 25,
            search_value: newValue,
          },
          Common.options
        )
        .then((response) => {
          let res = response.data;
          //   console.log(res.data);
          let list = res.data;
          let arr = [];
          for (let i = 0; i < list.length; i++) {
            let obj = list[i];

            // console.log(obj.rs_id);
            let label =
              obj.tambon_eng +
              " / " +
              obj.tambon_thai +
              " - " +
              obj.district_eng +
              " / " +
              obj.district_thai +
              " - " +
              obj.province_eng +
              " / " +
              obj.province_thai +
              " - " +
              obj.postcode;

            arr.push({
              value: obj.tambon_id,
              label: label,
            });
          }
          //   console.log(arr);

          new Promise((accept) => {
            setTimeout(() => {
              this.setState(
                {
                  list_tambon: arr,
                },
                accept
              );
            }, 1000);
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  setBt_id = async (e) => {
    this.setState({ bt_id: e.value, defaultBusiness: e });
  };
  setCountry_id = async (e) => {
    this.setState({ country_id: e.value, defaultCountry: e });
  };
  setLocation_id = async (e) => {
    this.setState({ tambon_id: e.value, defaultTambon: e });
  };
  onClickUploadCover = () => {
    document.getElementById("logoUpload").click();
  };

  handleSubmit = () => {
    if (
      this.state.firstname === "" ||
      this.state.lastname === "" ||
      this.state.ud_phone === "" ||
      this.state.email === "" ||
      this.state.country_id === "" ||
      this.state.bt_id === 0 ||
      this.state.uc_company_name === ""
    ) {
      console.log(this.state.email);
      Swal.fire({
        title: "Error!",
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "Continue",
      });
      return false;
    }
    if (this.state.youtube_path !== "") {
      this.formYoutube();
    }

    try {
      axios
        .put(
          Common.API_URL + `userpart2/company/${user_id}`,
          {
            main: {
              username: username,
              password: "", //ว่างไว้เพื่อไม่ Update Password
              firstname: this.state.firstname,
              lastname: this.state.lastname,
              email: this.state.email,
              user_image_prifile: this.state.user_image_prifile,
              user_image_cover: this.state.user_image_cover,
              user_image_cover_position: this.state.user_image_cover_position,
              user_type: 2,
              active: 1,
            },
            detail: {
              ud_bio: this.state.ud_bio,
              ud_birhday: this.state.ud_birhday,
              ud_gender: this.state.ud_gender,
              ud_phone: this.state.ud_phone,
              ud_address: this.state.ud_address,
              tambon_id: this.state.tambon_id,
              country_id: this.state.country_id,
            },
            company: {
              uc_company_name: this.state.uc_company_name,
              uc_company_website: this.state.uc_company_website,
              uc_company_remark1: this.state.uc_company_remark1,
              uc_company_remark2: this.state.uc_company_remark2,
              uc_company_cover: this.state.uc_company_cover,
              bt_id: this.state.bt_id,
            },
          },
          Common.options
        )
        .then((res) => {
          this.refreshData();
          Swal.fire({
            title: "Successfully",
            text: "Do you want to continue",
            icon: "success",
            confirmButtonText: "OK",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  handleSubmit2 = (uc_company_cover) => {
    if (
      this.state.firstname === "" ||
      this.state.lastname === "" ||
      this.state.ud_phone === "" ||
      this.state.email === "" ||
      this.state.country_id === "" ||
      this.state.bt_id === 0 ||
      this.state.uc_company_name === ""
    ) {
      Swal.fire({
        title: "Error!",
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "Continue",
      });
      return false;
    }
    try {
      axios
        .put(
          Common.API_URL + `userpart2/company/${user_id}`,
          {
            main: {
              username: username,
              password: "", //ว่างไว้เพื่อไม่ Update Password
              firstname: this.state.firstname,
              lastname: this.state.lastname,
              email: this.state.email,
              user_image_prifile: this.state.user_image_prifile,
              user_image_cover: this.state.user_image_cover,
              user_image_cover_position: this.state.user_image_cover_position,
              user_type: 2,
              active: 1,
            },
            detail: {
              ud_bio: this.state.ud_bio,
              ud_birhday: this.state.ud_birhday,
              ud_gender: this.state.ud_gender,
              ud_phone: this.state.ud_phone,
              ud_address: this.state.ud_address,
              tambon_id: this.state.tambon_id,
              country_id: this.state.country_id,
            },
            company: {
              uc_company_name: this.state.uc_company_name,
              uc_company_website: this.state.uc_company_website,
              uc_company_remark1: this.state.uc_company_remark1,
              uc_company_remark2: this.state.uc_company_remark2,
              uc_company_cover: uc_company_cover,
              bt_id: this.state.bt_id,
            },
          },
          Common.options
        )
        .then((res) => {
          this.refreshData();
          Swal.fire({
            title: "Successfully",
            text: "Do you want to continue",
            icon: "success",
            confirmButtonText: "OK",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  uploadLogo = async (event) => {
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
          if (this.state.uc_company_cover !== "") {
            this.DeleteImage(this.state.uc_company_cover);
          }

          let r = res.data;
          // let uc_company_cover = r.file_url;
          // this.setState({
          //   uc_company_cover: uc_company_cover,
          // });
          this.handleSubmit2(r.file_path);
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
  onSubmitWithLogo = () => {
    this.uploadLogo(this.state.filecore_logo);
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
  handleSubmitYoutube = (portfolio_name, portfolio_path, portfolio_type) => {
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
      this.handleSubmitYoutube(portfolio_name, portfolio_path, portfolio_type);
    }
  };

  componentDidMount() {
    this.getBusinessType();
    this.refreshData();
    this.refreshDataYoutube();
  }
  render() {
    const { list_country } = this.state;
    const { defaultCountry } = this.state;
    const { list_business } = this.state;
    const { defaultBusiness } = this.state;
    const { list_tambon } = this.state;
    const { defaultTambon } = this.state;
    const { youtube_path } = this.state;
    return (
      <div>
        <h1>Company Profile</h1>
        <Card>
          <Card.Body>
            <Row>
              <Col lg="3" md="6" sm="12" align="center">
                <div>
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

                  <Form.Control
                    type="file"
                    size="sm"
                    accept=".png, .jpg, .jpeg"
                    onChange={(e) => this.readURL(e, "imglogo")}
                    id="logoUpload"
                    style={{ display: "none" }}
                  />
                </div>
                <div style={{ paddingTop: "15px" }}>
                  <Button
                    variant="outline-primary"
                    onClick={this.onClickUploadCover}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-upload"
                      viewBox="0 0 16 16"
                    >
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                      <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                    </svg>{" "}
                    Upload Logo
                  </Button>
                </div>
              </Col>
              <Col lg="9" md="6" sm="12">
                <Row>
                  <Col lg="6" sm="12">
                    <Form.Group>
                      <Form.Label>Company Name</Form.Label>{" "}
                      <label style={{ color: "red" }}> *</label>
                      <Form.Control
                        type="text"
                        id="uc_company_name"
                        placeholder="Company Name"
                        defaultValue={this.state.uc_company_name}
                        onChange={(e) =>
                          this.setState({ uc_company_name: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg="6" sm="12">
                    <Form.Group>
                      <Form.Label>Business Type</Form.Label>{" "}
                      <label style={{ color: "red" }}> *</label>
                      <Select
                        id="bt_id"
                        options={list_business}
                        styles={customStyles}
                        onChange={this.setBt_id}
                        value={defaultBusiness}
                        placeholder="test"
                      />
                    </Form.Group>
                  </Col>
                  <Col lg="6" sm="12">
                    <Form.Group>
                      <Form.Label>Contact Person</Form.Label>{" "}
                      <label style={{ color: "red" }}> *</label>
                      <InputGroup className="mb-3">
                        <Form.Control
                          placeholder="First name"
                          id="firstname"
                          defaultValue={firstname}
                          onChange={(e) =>
                            this.setState({ firstname: e.target.value })
                          }
                        />
                        <Form.Control
                          placeholder="Last name"
                          id="lastname"
                          defaultValue={lastname}
                          onChange={(e) =>
                            this.setState({ lastname: e.target.value })
                          }
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col lg="6" sm="12">
                    <Form.Group>
                      <Form.Label>Email</Form.Label>{" "}
                      <label style={{ color: "red" }}> *</label>
                      <Form.Control
                        type="email"
                        id="email"
                        placeholder="Email"
                        defaultValue={email}
                        onChange={(e) =>
                          this.setState({ email: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg="6" sm="12">
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>{" "}
                      <label style={{ color: "red" }}> *</label>
                      <Form.Control
                        type="text"
                        id="ud_phone"
                        placeholder="Phone"
                        defaultValue={this.state.ud_phone}
                        onChange={(e) =>
                          this.setState({ ud_phone: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg="6" sm="12">
                    <Form.Group>
                      <Form.Label>Website</Form.Label>
                      <Form.Control
                        type="text"
                        id="uc_company_website"
                        placeholder="Website"
                        defaultValue={this.state.uc_company_website}
                        onChange={(e) =>
                          this.setState({ uc_company_website: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col lg="6" sm="12">
                    <Form.Group>
                      <Form.Label>Country</Form.Label>{" "}
                      <label style={{ color: "red" }}> *</label>
                      <Select
                        id="country_id"
                        options={list_country}
                        styles={customStyles}
                        onInputChange={this.getCountry}
                        onChange={this.setCountry_id}
                        value={defaultCountry}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg="6" sm="12">
                    <Form.Group>
                      <Form.Label>Address</Form.Label>{" "}
                      <label style={{ color: "red" }}> *</label>
                      <Select
                        id="tambon_id "
                        options={list_tambon}
                        onInputChange={this.getLocation}
                        styles={customStyles}
                        onChange={this.setLocation_id}
                        defaultValue={defaultTambon}
                        value={defaultTambon}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg="12">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Company Profile and Business Operation
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        defaultValue={this.state.uc_company_remark1}
                        onChange={(e) =>
                          this.setState({ uc_company_remark1: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg="12">
                    <Form.Group className="mb-3">
                      <Form.Label>Welfare and Benefits</Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={3}
                        defaultValue={this.state.uc_company_remark2}
                        onChange={(e) =>
                          this.setState({ uc_company_remark2: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>

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
          <div align="right" style={{ paddingTop: "25px" }}>
            <Button
              variant="primary"
              size="lg"
              onClick={
                this.state.filecore_logo !== ""
                  ? this.onSubmitWithLogo
                  : this.handleSubmit
              }
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
