import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SectionSuperAdmin from "../section/SectionSuperAdmin";
import SectionHR from "../section/SectionHR";
import SectionCandidate from "../section/SectionCandidate";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../landing-page/Login";
import RegisterCompany from "../landing-page/RegisterCompany";
import RegisterCandidate from "../landing-page/RegisterCandidate";
import ErrorPage from "../section/ErrorPage";
import Common from "../common";
import "../asset/image_box.css";
import "../asset/InputInternamIcons.css";
export default class BaseLayout extends Component {
  state = {
    user_id: "",
    user_type: 0,
    fullname: "",
  };
  checkAuthen = () => {
    // console.log(Common.getUserLoginData);
    if (Common.getUserLoginData === null) {
      this.setState({ user_id: "", user_type: 0 });
      localStorage.clear();
    } else {
      this.setState({
        user_id: Common.getUserLoginData.user_token,
        user_type: Common.getUserLoginData.user_type,
        fullname: Common.getUserLoginData.full_name,
      });
    }
  };

  componentDidMount() {
    this.checkAuthen();
  }
  render() {
    const { user_type } = this.state;

    return (
      <div>
        {user_type === 0 && (
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Login />} />
              <Route path="/companies/register" element={<RegisterCompany />} />
              <Route
                path="/candidate/register"
                element={<RegisterCandidate />}
              />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Router>
        )}
        {user_type === 1 && <SectionSuperAdmin />}
        {user_type === 2 && <SectionHR />}
        {user_type === 3 && <SectionCandidate />}
      </div>
    );
  }
}
