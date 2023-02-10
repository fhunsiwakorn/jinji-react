import Container from "react-bootstrap/Container";

function ErrorPage() {
  return (
    <Container>
      <div style={{ paddingTop: "25px", height: "750px" }} align="center">
        <span style={{ fontSize: "20em", fontWeight: "bold" }}>404</span>

        <h1>PAGE NOT FOUND</h1>
      </div>
    </Container>
  );
}

export default ErrorPage;
