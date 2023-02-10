import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Common from "../../common";

import axios from "axios";

export default class CandidateDetailExperience extends Component {
  state = {
    exp_id: 0,
    exp_comapany: "",
    exp_year_start: "",
    exp_year_end: "",
    exp_last_position: "",
    exp_last_salary: 0,
    exp_responsibility: "",
    active: 1,
    data: [],
    msg: "",
  };

  refreshData = async () => {
    try {
      await axios
        .get(
          Common.API_URL + `user/experience/${this.props.user_id}`,
          Common.options
        )
        .then((response) => {
          let res = response.data;
          this.setState({ data: res });
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleEditClick = async (res) => {
    let active = res.active;
    let setactvie;
    if (active === 1) {
      setactvie = 0;
    } else {
      setactvie = 1;
    }

    await new Promise((accept) =>
      this.setState(
        {
          exp_id: res.exp_id,
          exp_comapany: res.exp_comapany,
          exp_year_start: res.exp_year_start,
          exp_year_end: res.exp_year_end,
          exp_last_position: res.exp_last_position,
          exp_last_salary: res.exp_last_salary,
          exp_responsibility: res.exp_responsibility,
          active: setactvie,
        },
        accept
      )
    );
    this.handleUpdateSubmit();
  };

  handleUpdateSubmit = () => {
    if (
      this.state.exp_comapany === "" ||
      this.state.exp_year_start === 0 ||
      this.state.exp_year_end === 0 ||
      this.state.exp_last_position === "" ||
      this.state.exp_last_salary === "" ||
      this.state.exp_responsibility === ""
    ) {
      this.setState({ msg: "Invalid data" });
      return false;
    }
    if (
      parseInt(this.state.exp_year_start) > parseInt(this.state.exp_year_end)
    ) {
      this.setState({ msg: "Invalid data" });
      return false;
    }

    try {
      axios
        .put(
          Common.API_URL + `user/experience/${this.state.exp_id}`,
          {
            exp_comapany: this.state.exp_comapany,
            exp_year_start: this.state.exp_year_start,
            exp_year_end: this.state.exp_year_end,
            exp_last_position: this.state.exp_last_position,
            exp_last_salary: this.state.exp_last_salary,
            exp_responsibility: this.state.exp_responsibility,
            active: this.state.active,
            user_id: this.props.user_id,
          },
          Common.options
        )
        .then((res) => {
          this.clearState();
          this.refreshData();
        });
    } catch (error) {
      console.log(error);
      this.setState({ msg: "Invalid data" });
    }
  };

  clearState = () => {
    this.setState({
      exp_id: 0,
      exp_comapany: "",
      exp_year_start: "",
      exp_year_end: "",
      exp_last_position: "",
      exp_last_salary: 0,
      exp_responsibility: "",
      active: 1,
      msg: "",
    });
  };

  componentDidMount() {
    this.refreshData();
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        {data !== undefined && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Duration</th>
                <th>Company's Name</th>
                <th>Last Position</th>
                <th>Last Salary (Bath./Month)</th>
                <th>Responibility</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {data.map((rs, index) => (
                <tr key={index}>
                  <td>
                    {rs.exp_year_start} - {rs.exp_year_end}
                  </td>
                  <td>{rs.exp_comapany}</td>
                  <td>{rs.exp_last_position}</td>
                  <td>{rs.exp_last_salary}</td>
                  <td>{rs.exp_responsibility}</td>
                  <td align="center">
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      defaultChecked={rs.active === 1 ? true : false}
                      onChange={() => this.handleEditClick(rs)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    );
  }
}
