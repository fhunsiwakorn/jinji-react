import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Common from "../../common";
import Functions from "../../functions";
import axios from "axios";
const degree_list = Functions.degree_type;
export default class CandidateDetailEducation extends Component {
  state = {
    edu_id: 0,
    edu_degree: 0,
    edu_faculty: "",
    edu_major: "",
    edu_graduation_year: "",
    edu_gpa: 0,
    active: 1,
    institution_id: 0,
    data: [],
    msg: "",
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

  refreshData = async () => {
    try {
      await axios
        .get(
          Common.API_URL + `user/education/${this.props.user_id}`,
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
          edu_id: res.edu_id,
          edu_degree: res.edu_degree,
          edu_faculty: res.edu_faculty,
          edu_major: res.edu_major,
          edu_graduation_year: res.edu_graduation_year,
          edu_gpa: res.edu_gpa,
          active: setactvie,
          institution_id: res.institution_id,
        },
        accept
      )
    );
    this.handleUpdateSubmit();
  };

  handleUpdateSubmit = () => {
    if (
      this.state.edu_degree === 0 ||
      this.state.edu_faculty === "" ||
      this.state.edu_major === "" ||
      this.state.edu_graduation_year === 0 ||
      this.state.edu_gpa === 0 ||
      this.state.institution_id === 0
    ) {
      this.setState({ msg: "Invalid data" });
      return false;
    }

    try {
      axios
        .put(
          Common.API_URL + `user/education/${this.state.edu_id}`,
          {
            edu_degree: this.state.edu_degree,
            edu_faculty: this.state.edu_faculty,
            edu_major: this.state.edu_major,
            edu_graduation_year: this.state.edu_graduation_year,
            edu_gpa: this.state.edu_gpa,
            active: this.state.active,
            institution_id: this.state.institution_id,
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
      edu_id: 0,
      edu_degree: "",
      edu_faculty: "",
      edu_major: "",
      edu_graduation_year: "",
      edu_gpa: 0,
      active: 1,
      institution_id: 0,
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
                <th>Year</th>
                <th>Instritution</th>
                <th>Faculty</th>
                <th>Major</th>
                <th>Degree</th>
                <th>GPA</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {data.map((rs, index) => (
                <tr key={index}>
                  <td>{rs.edu_graduation_year}</td>
                  <td>{rs.edu_institution.institution_name}</td>
                  <td>{rs.edu_faculty}</td>
                  <td>{rs.edu_major}</td>
                  <td>
                    {
                      this.filterDegree(parseInt(rs.edu_degree))[0]
                        .degree_name_eng
                    }
                  </td>
                  <td>{rs.edu_gpa}</td>
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
