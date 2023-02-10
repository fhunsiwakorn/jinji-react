import React, { Component } from "react";

import ProfileGeneral from "./ProfileGeneral";
import ProfileAddress from "./ProfileAddress";
import ProfileStrength from "./ProfileStrength";
import ProfileHobbies from "./ProfileHobbies";
import ProfileRewards from "./ProfileRewards";
import "../../asset/Stepper.css";

export default class Profile_Update extends Component {
  state = {
    stepperActive: 1,
  };
  setStepper = async (value) => {
    // console.log(value);
    await new Promise((accept) =>
      this.setState(
        {
          stepperActive: value,
        },
        accept
      )
    );
  };

  render() {
    const { stepperActive } = this.state;
    let content;
    if (stepperActive === 1) {
      content = <ProfileGeneral />;
    } else if (stepperActive === 2) {
      content = <ProfileAddress />;
    } else if (stepperActive === 3) {
      content = <ProfileStrength />;
    } else if (stepperActive === 4) {
      content = <ProfileHobbies />;
    } else if (stepperActive === 5) {
      content = <ProfileRewards />;
    }
    return (
      <div>
        <div className="md-stepper-horizontal orange">
          <div
            className="md-step active"
            style={{ cursor: "pointer" }}
            onClick={() => this.setStepper(1)}
          >
            <div className="md-step-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-person-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              </svg>
            </div>
            <div className="md-step-title">General</div>
            <div className="md-step-bar-left"></div>
            <div className="md-step-bar-right"></div>
          </div>
          <div
            className="md-step active"
            style={{ cursor: "pointer" }}
            onClick={() => this.setStepper(2)}
          >
            <div className="md-step-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-geo-alt-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
              </svg>
            </div>
            <div className="md-step-title">Address</div>
            <div className="md-step-bar-left"></div>
            <div className="md-step-bar-right"></div>
          </div>
          <div
            className="md-step active"
            style={{ cursor: "pointer" }}
            onClick={() => this.setStepper(3)}
          >
            <div className="md-step-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-emoji-smile-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zM4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z" />
              </svg>
            </div>
            <div className="md-step-title">Strength</div>
            <div className="md-step-bar-left"></div>
            <div className="md-step-bar-right"></div>
          </div>
          <div className="md-step active">
            <div
              className="md-step-circle"
              style={{ cursor: "pointer" }}
              onClick={() => this.setStepper(4)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-play-fill"
                viewBox="0 0 16 16"
              >
                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
              </svg>
            </div>
            <div className="md-step-title">Hobbies</div>
            <div className="md-step-bar-left"></div>
            <div className="md-step-bar-right"></div>
          </div>
          <div
            className="md-step active"
            style={{ cursor: "pointer" }}
            onClick={() => this.setStepper(5)}
          >
            <div className="md-step-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-stars"
                viewBox="0 0 16 16"
              >
                <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z" />
              </svg>
            </div>
            <div className="md-step-title">Rewards</div>
            <div className="md-step-bar-left"></div>
            <div className="md-step-bar-right"></div>
          </div>
          {/* <div className="md-step">
            <div className="md-step-circle">
              <span>4</span>
            </div>
            <div className="md-step-title">Rewards</div>
            <div className="md-step-bar-left"></div>
            <div className="md-step-bar-right"></div>
          </div> */}
        </div>

        {content}
      </div>
    );
  }
}
