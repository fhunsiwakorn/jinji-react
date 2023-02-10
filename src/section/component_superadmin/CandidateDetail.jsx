import React, { Component, Suspense } from "react";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Card from "react-bootstrap/Card";
import CandidateDetailEducation from "./CandidateDetailEducation";
import CandidateDetailExperience from "./CandidateDetailExperience";
import CandidateDetailLanguage from "./CandidateDetailLanguage";
import CandidateDetailSkill from "./CandidateDetailSkill";

import Loading_2 from "../../asset/images/Loading_2.gif";

const GetDataForm = () => {
  const { user_id } = useParams();

  return <CandidateDetail user_id={user_id} />;
};
export default GetDataForm;

class CandidateDetail extends Component {
  render() {
    return (
      <div>
        <Suspense
          fallback={
            <div align="center">
              <Card.Img
                variant="top"
                src={Loading_2}
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          }
        >
          <Row>
            <Col sm={8}>
              <h3>Candidate</h3>
            </Col>
            <Col sm={4}>
              <Breadcrumb>
                <Breadcrumb.Item href="/">home</Breadcrumb.Item>

                <LinkContainer to="/candidate">
                  <Breadcrumb.Item>Candidate</Breadcrumb.Item>
                </LinkContainer>

                <Breadcrumb.Item active>Detail</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <Tabs
            defaultActiveKey="education"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="education" title="Education">
              <CandidateDetailEducation user_id={this.props.user_id} />
            </Tab>
            <Tab eventKey="experience" title="Experience">
              <CandidateDetailExperience user_id={this.props.user_id} />
            </Tab>
            <Tab eventKey="language" title="Language">
              <CandidateDetailLanguage user_id={this.props.user_id} />
            </Tab>
            <Tab eventKey="skills" title="Skills">
              <CandidateDetailSkill user_id={this.props.user_id} />
            </Tab>
          </Tabs>
        </Suspense>
      </div>
    );
  }
}
