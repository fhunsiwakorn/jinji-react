import React, { Component } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import axios from "axios";
import Swal from "sweetalert2";
import Common from "../../common";
import Functions from "../../functions";

const user_id = Common.getUserLoginData.user_id;
const username = Common.getUserLoginData.username;
const user_image_prifile = Common.getUserLoginData.user_image_prifile;
const user_image_cover = Common.getUserLoginData.user_image_cover;
const user_image_cover_position =
  Common.getUserLoginData.user_image_cover_position;
const user_type = Common.getUserLoginData.user_type;
const textbox_radius = { borderRadius: "40px" };

const customStyles = {
  control: (base) => ({
    ...base,
    height: 80,
    minHeight: 80,
    borderRadius: "40px",
    paddingLeft: "60px !important",
  }),
};
const list_uh_type = [
  { value: 1, label: "Full time" },
  { value: 2, label: "Part time" },
  { value: 3, label: "Freelance" },
  { value: 4, label: "Apprentice" },
];

export default class ProfileGeneral extends Component {
  state = {
    ud_bio: "",
    ud_birhday: "",
    ud_gender: 0,
    ud_phone: "",
    ud_address: "",
    email: "",

    username: "",
    firstname: "",
    lastname: "",

    tambon_id: 100101,

    // เงินเดือน
    us_salary_start: 0,
    us_salary_end: 0,

    // ประเภทการว่าจ้าง
    uh_type_post: [],
    list_uh_type: list_uh_type,
    defaultUh_type: [],

    // ประเภทงาน
    work_type_post: [],
    list_work_type: [],
    defaultWork_type: [],
  };

  refreshData = async () => {
    try {
      await axios
        .get(Common.API_URL + `user/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          let user_detail = res.user_main_detail[0];

          this.setState({
            username: res.username,
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
              tambon_id: tambon.tambon_id,
              country_id: user_detail.country_id,
              defaultLocation: { value: tambon.tambon_id, label: label },
              defaultCountry: {
                value: country.country_id,
                label:
                  country.country_name_th +
                  " - " +
                  country.country_official_name_th,
              },
            });
            // console.log(user_detail.email);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  FormatDate = async (e) => {
    // console.log(e.month.number);
    // console.log(e.year);
    let getmonth = e.month.number;
    let getyear = e.year;
    let getday = e.day;
    let fulldate = getyear + "-" + getmonth + "-" + getday;
    this.setState({ ud_birhday: fulldate });
    // console.log(fulldate);
  };

  handleSubmit = () => {
    if (
      this.state.ud_birhday === "" ||
      this.state.ud_phone === "" ||
      this.state.email === "" ||
      this.state.ud_address === "" ||
      this.state.tambon_id === "" ||
      this.state.country_id === ""
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
          Common.API_URL + `user/${user_id}`,
          {
            username: this.state.username,
            password: "",
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email, //ถ้าใส่ค่าว่าง ระบบจะไม่เปลี่ยน password เดิม
            user_image_prifile: user_image_prifile,
            user_image_cover: user_image_cover,
            user_image_cover_position: user_image_cover_position,
            user_type: 3,
            active: 1,
          },
          Common.options
        )
        .then((res) => {
          this.handleSubmitDetail();
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleSubmitDetail = () => {
    this.handleSubmitSalary();

    if (this.state.uh_type_post.length > 0) {
      this.handleSubmitHiretype();
    }
    if (this.state.work_type_post.length > 0) {
      this.handleSubmitWorktype();
    }

    try {
      axios
        .put(
          Common.API_URL + `user/detail/${user_id}`,
          {
            ud_bio: this.state.ud_bio,
            ud_birhday: this.state.ud_birhday,
            ud_phone: this.state.ud_phone,
            ud_gender: this.state.ud_phone,
            ud_address: this.state.ud_address,
            tambon_id: this.state.tambon_id,
            country_id: this.state.country_id,
          },
          Common.options
        )
        .then((res) => {
          Functions.setUserStorage(
            user_id,
            username,
            this.state.firstname,
            this.state.lastname,
            this.state.email,
            user_image_prifile,
            user_image_cover,
            user_image_cover_position,
            user_type
          );

          window.location.reload();
        });
    } catch (error) {
      console.log(error);
    }
  };

  getSalaryData = async () => {
    try {
      await axios
        .get(Common.API_URL + `userpart2/salary/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;

          this.setState({
            us_salary_start: res.us_salary_start,
            us_salary_end: res.us_salary_end,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleSubmitSalary = () => {
    try {
      axios.post(
        Common.API_URL + `userpart2/salary/${user_id}`,
        {
          us_salary_start: this.state.us_salary_start,
          us_salary_end: this.state.us_salary_end,
        },
        Common.options
      );
    } catch (error) {
      console.log(error);
    }
  };

  getWorkTypeMasterData = () => {
    // console.log(inputValue);
    try {
      axios
        .get(Common.API_URL + "masterdata/work_parent", Common.options)
        .then((response) => {
          let list = response.data;
          let arr = [];
          // Main
          for (let i = 0; i < list.length; i++) {
            let obj = list[i];
            let wp_wc = obj.wp_wc;

            // Sub
            let arr2 = [];
            for (let i2 = 0; i2 < wp_wc.length; i2++) {
              let obj2 = wp_wc[i2];
              arr2.push({
                value: obj2.wc_id,
                label: obj2.wc_name,
              });
            }
            // console.log(arr2);
            arr.push({
              label: obj.wp_name,
              options: arr2,
            });
          }
          //   console.log(arr);

          new Promise((accept) => {
            setTimeout(() => {
              this.setState(
                {
                  list_work_type: arr,
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

  getHiretypeData = async () => {
    try {
      await axios
        .get(Common.API_URL + `userpart2/hiretype/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          let arr = [];
          for (let i = 0; i < res.length; i++) {
            let obj = res[i];
            let label;
            if (obj.uh_type === 1) {
              label = "Full time";
            } else if (obj.uh_type === 2) {
              label = "Part time";
            } else if (obj.uh_type === 3) {
              label = "Freelance";
            } else if (obj.uh_type === 4) {
              label = "Apprentice";
            } else {
              label = "-";
            }

            arr.push({
              value: obj.uh_type,
              label: label,
            });
          }
          new Promise((accept) => {
            setTimeout(() => {
              this.setState(
                {
                  defaultUh_type: arr,
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

  getWorktypeData = async () => {
    try {
      await axios
        .get(Common.API_URL + `userpart2/worktype/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          let arr = [];

          for (let i = 0; i < res.length; i++) {
            let obj = res[i];
            let user_work_child = obj.user_work_child;
            let label = user_work_child.wc_name;

            arr.push({
              value: obj.wc_id,
              label: label,
            });
          }
          new Promise((accept) => {
            setTimeout(() => {
              this.setState(
                {
                  defaultWork_type: arr,
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
  handleSubmitHiretype = () => {
    try {
      axios.post(
        Common.API_URL + `userpart2/hiretype/${user_id}`,
        this.state.uh_type_post,
        Common.options
      );
    } catch (error) {
      console.log(error);
    }
  };

  handleSubmitWorktype = () => {
    try {
      axios.post(
        Common.API_URL + `userpart2/worktype/${user_id}`,
        this.state.work_type_post,
        Common.options
      );
    } catch (error) {
      console.log(error);
    }
  };

  setUh_type = async (e) => {
    let arr = [];
    for (let i = 0; i < e.length; i++) {
      let obj = e[i];

      // console.log(obj.value);
      arr.push({
        uh_type: obj.value,
      });
    }
    this.setState({
      uh_type_post: arr,
    });
    // console.log(this.state.uh_type_post);
  };

  setWork_type = async (e) => {
    let arr = [];
    for (let i = 0; i < e.length; i++) {
      let obj = e[i];

      // console.log(obj.value);
      arr.push({
        wc_id: obj.value,
      });
    }
    this.setState({
      work_type_post: arr,
    });
    // console.log(this.state.uh_type_post);
  };

  componentDidMount() {
    this.refreshData();
    this.getSalaryData();
    this.getHiretypeData();
    this.getWorkTypeMasterData();
    this.getWorktypeData();
  }

  render() {
    const { list_uh_type } = this.state;
    const { defaultUh_type } = this.state;
    const { list_work_type } = this.state;
    const { defaultWork_type } = this.state;

    return (
      <div>
        <h3
          style={{
            paddingTop: "20px",
          }}
        >
          General
        </h3>
        {/* {JSON.stringify(defaultWork_type)} */}
        <Row>
          <Col sm="12" lg="6" md="6">
            <Form.Group style={{ paddingTop: "30px" }}>
              <div className="form-inside left-inner-addon">
                <Form.Control
                  type="text"
                  id="firstname"
                  size="lg"
                  defaultValue={this.state.firstname}
                  onChange={(e) => this.setState({ firstname: e.target.value })}
                  placeholder="Firstname"
                  style={textbox_radius}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-person-fill icon-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
              </div>
            </Form.Group>
          </Col>
          <Col sm="12" lg="6" md="6">
            <Form.Group style={{ paddingTop: "30px" }}>
              <div className="form-inside left-inner-addon">
                <Form.Control
                  type="text"
                  id="lastname"
                  defaultValue={this.state.lastname}
                  onChange={(e) => this.setState({ lastname: e.target.value })}
                  placeholder="Lastname"
                  style={textbox_radius}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-person-fill icon-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
              </div>
            </Form.Group>
          </Col>
          <Col sm="12" lg="6" md="6">
            <Form.Group style={{ paddingTop: "30px" }}>
              <div className="form-inside left-inner-addon">
                <Form.Control
                  type="text"
                  id="ud_phone"
                  defaultValue={this.state.ud_phone}
                  onChange={(e) => this.setState({ ud_phone: e.target.value })}
                  placeholder="Phone number"
                  style={textbox_radius}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-telephone-fill icon-circle"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                  />
                </svg>
              </div>
            </Form.Group>
          </Col>

          <Col sm="12" lg="6" md="6">
            <Form.Group style={{ paddingTop: "30px" }}>
              <div className="form-inside left-inner-addon">
                <Form.Control
                  type="email"
                  id="email"
                  defaultValue={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  placeholder="E-mail"
                  style={textbox_radius}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-envelope-fill icon-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                </svg>
              </div>
            </Form.Group>
          </Col>

          <Col sm="12" lg="6" md="6">
            <Form.Group style={{ paddingTop: "30px" }}>
              <div className="form-inside left-inner-addon">
                <DatePicker
                  id="ud_birhday"
                  style={{
                    height: "80px",
                    width: "100%",
                    borderRadius: "40px",
                  }}
                  containerStyle={{
                    width: "100%",
                  }}
                  onChange={(e) => this.FormatDate(e)}
                  value={this.state.ud_birhday}
                  placeholder="Day of Birth"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-calendar2-date-fill icon-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.402 10.246c.625 0 1.184-.484 1.184-1.18 0-.832-.527-1.23-1.16-1.23-.586 0-1.168.387-1.168 1.21 0 .817.543 1.2 1.144 1.2z" />
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zm9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5zm-4.118 9.79c1.258 0 2-1.067 2-2.872 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684c.047.64.594 1.406 1.703 1.406zm-2.89-5.435h-.633A12.6 12.6 0 0 0 4.5 8.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675V7.354z" />
                </svg>
              </div>
            </Form.Group>
          </Col>

          <Col sm="12" lg="3" md="6">
            <Form.Group style={{ paddingTop: "30px" }}>
              <div className="form-inside left-inner-addon">
                <Form.Control
                  type="number"
                  id="us_salary_start"
                  value={this.state.us_salary_start}
                  onChange={(e) =>
                    this.setState({ us_salary_start: e.target.value })
                  }
                  placeholder="Start Salary"
                  style={textbox_radius}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-cash icon-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                  <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2H3z" />
                </svg>
              </div>
            </Form.Group>
          </Col>
          <Col sm="12" lg="3" md="6">
            <Form.Group style={{ paddingTop: "30px" }}>
              <div className="form-inside left-inner-addon">
                <Form.Control
                  type="number"
                  id="us_salary_end"
                  value={this.state.us_salary_end}
                  onChange={(e) =>
                    this.setState({ us_salary_end: e.target.value })
                  }
                  placeholder="End Salary"
                  style={textbox_radius}
                />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-cash icon-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                  <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2H3z" />
                </svg>
              </div>
            </Form.Group>
          </Col>
          <Col sm="12" lg="6" md="6">
            <Form.Group className="mb-3" style={{ paddingTop: "30px" }}>
              <div className="form-inside">
                <Select
                  options={list_uh_type}
                  isMulti
                  styles={customStyles}
                  placeholder="Employment type"
                  onChange={this.setUh_type}
                  defaultValue={defaultUh_type}
                  key={defaultUh_type}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-clock-fill icon-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                </svg>
              </div>
            </Form.Group>
          </Col>
          <Col sm="12" lg="6" md="6">
            <Form.Group className="mb-3" style={{ paddingTop: "30px" }}>
              <div className="form-inside">
                <Select
                  options={list_work_type}
                  isMulti
                  styles={customStyles}
                  placeholder="Works type"
                  onChange={this.setWork_type}
                  defaultValue={defaultWork_type}
                  key={defaultWork_type}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-question-octagon-fill icon-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zM5.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z" />
                </svg>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <div align="center" style={{ paddingTop: "20px" }}>
          <Button
            variant="primary"
            onClick={this.handleSubmit}
            style={{ borderRadius: "40px" }}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
}
