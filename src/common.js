const exports = {};
exports.app_name = "jinjijob";
exports.API_URL = "https://jinjiapi.herokuapp.com/";
exports.IMAGE_URL = "https://jinjiapi.herokuapp.com/general/render/?file_path=";
exports.options = {
  headers: {
    "content-type": "application/json",
    Authorization: "Bearer gGaQfRuJ80k4JTErVxA5V9NQ8OB9fP",
  },
};
if (JSON.parse(localStorage.getItem("token_profile")) === null) {
  exports.getUserLoginData = {
    user_id: "",
    username: "",
    firstname: "",
    lastname: "",
    user_image_prifile: null,
    user_image_cover: null,
    user_type: 0,
  };
} else {
  exports.getUserLoginData = JSON.parse(localStorage.getItem("token_profile"));
}

exports.customSelectStyles = {
  control: (base) => ({
    ...base,
    height: 47,
    minHeight: 47,
  }),
};
export default exports;
