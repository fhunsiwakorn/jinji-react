function Logout() {
  localStorage.clear();
  window.location = "/logout";
  return true;
}

export default Logout;
