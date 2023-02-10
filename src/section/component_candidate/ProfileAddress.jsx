import React, { Component } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";

import Common from "../../common";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
const user_id = Common.getUserLoginData.user_id;
// const textbox_radius = { borderRadius: "40px" };
const customStyles = {
  control: (base) => ({
    ...base,
    height: 80,
    minHeight: 80,
    borderRadius: "40px",
    paddingLeft: "60px !important",
  }),
};

export default class ProfileAddress extends Component {
  state = {
    ud_bio: "",
    ud_birhday: "",
    ud_gender: 0,
    ud_phone: "",
    ud_address: "",

    tambon_id: 0,
    list_tambon: [],
    defaultTambon: {
      value: 0,
      label: "",
    },

    country_id: 19,
    list_country: [],
    defaultCountry: {
      value: 19,
      label: "Thai - ไทย",
    },

    msg: "",
    checkEditForm: false,
  };

  refreshData = async () => {
    try {
      await axios
        .get(Common.API_URL + `user/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          let user_detail = res.user_main_detail[0];
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
            // console.log(user_detail.ud_email);
          }
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

          new Promise((accept) => {
            setTimeout(() => {
              this.setState(
                {
                  list_country: arr,
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

  setLocation_id = async (e) => {
    // console.log(e);
    if (e.value !== this.state.tambon_id) {
      this.setState({ checkEditForm: true });
    }
    this.setState({ tambon_id: e.value, defaultTambon: e });
  };
  setCountry_id = async (e) => {
    if (e.value !== this.state.tambon_id) {
      this.setState({ checkEditForm: true });
    }
    this.setState({ country_id: e.value, defaultCountry: e });
  };
  handleSubmitDetail = () => {
    try {
      axios
        .put(
          Common.API_URL + `user/detail/${user_id}`,
          {
            ud_bio: this.state.ud_bio,
            ud_birhday: this.state.ud_birhday,
            ud_phone: this.state.ud_phone,
            ud_gender: this.state.ud_gender,
            ud_address: this.state.ud_address,
            tambon_id: this.state.tambon_id,
            country_id: this.state.country_id,
          },
          Common.options
        )
        .then((res) => {
          this.setState({ checkEditForm: false });

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
  componentDidMount() {
    this.refreshData();
  }

  render() {
    const { list_tambon } = this.state;
    const { defaultTambon } = this.state;
    const { checkEditForm } = this.state;
    const { list_country } = this.state;
    const { defaultCountry } = this.state;

    return (
      <div>
        <h3
          style={{
            paddingTop: "20px",
          }}
        >
          Address
        </h3>

        <Row>
          <Col sm="12" lg="8" md="6" style={{ paddingTop: "30px" }}>
            <Form.Group>
              <div className="form-inside">
                <Select
                  id="tambon_id "
                  options={list_tambon}
                  onInputChange={this.getLocation}
                  styles={customStyles}
                  onChange={this.setLocation_id}
                  defaultValue={defaultTambon}
                  value={defaultTambon}
                  menuPlacement="top"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pin-map-fill icon-circle"
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
                </svg>
              </div>
            </Form.Group>
          </Col>

          <Col sm="12" lg="4" md="6">
            <Form.Group className="mb-3" style={{ paddingTop: "30px" }}>
              <div className="form-inside">
                <Select
                  id="country_id"
                  options={list_country}
                  onInputChange={this.getCountry}
                  styles={customStyles}
                  onChange={this.setCountry_id}
                  value={defaultCountry}
                  cacheOptions
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-flag-fill icon-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
                </svg>
              </div>
            </Form.Group>
          </Col>
        </Row>

        <div align="center">
          <Button
            variant="primary"
            onClick={this.handleSubmitDetail}
            style={{ borderRadius: "40px" }}
            disabled={checkEditForm === true ? false : true}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
}
