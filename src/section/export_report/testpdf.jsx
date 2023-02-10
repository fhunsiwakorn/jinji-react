import React, { Component } from "react";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import axios from "axios";
import Common from "../../common";
import Testpdf from "./testpdf";
import EmptyImageProfile from "../../asset/images/no-user-image-icon-26.jpg";

const BASE_IMAGE = Common.IMAGE_URL;
const printRef = React.createRef();
export default class ResumePDF extends Component {
  state = {
    image_profile: EmptyImageProfile,
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    email: "",
  };

  getProfile = async (user_id) => {
    try {
      await axios
        .get(Common.API_URL + `user/${user_id}`, Common.options)
        .then((response) => {
          let res = response.data;
          let user_detail = res.user_main_detail[0];
          if (user_detail !== undefined) {
            let tambon = user_detail.user_tambon;
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
            let imgprofile;
            if (
              res.user_image_prifile === "" ||
              res.user_image_prifile === undefined ||
              res.user_image_prifile === null
            ) {
              imgprofile = EmptyImageProfile;
            } else {
              imgprofile = BASE_IMAGE + res.user_image_prifile;
            }
            this.setState({
              firstname: res.firstname,
              lastname: res.lastname,
              email: res.email,
              address: label,
              phone: user_detail.ud_phone,
              image_profile: imgprofile,
            });
            console.log(imgprofile);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleDownloadPdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("print.pdf");
  };

  componentDidMount() {
    let user_id = this.props.user_id;
    this.getProfile(user_id);
  }
  render() {
    return (
      <div>
        <button type="button" onClick={this.handleDownloadPdf}>
          Download as PDF
        </button>
        <div ref={printRef}>
          <Testpdf />
        </div>
      </div>
    );
  }
}
