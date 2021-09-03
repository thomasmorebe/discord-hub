import { Component } from "react";
import { Card, Button, Modal, Row, Col, Form, Alert, Toast } from "react-bootstrap"
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { ToastService } from "../../_services/toastService";


class NotYet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      hcapthaToken: null,
      error: null,
      showToast: false,

      email: "",
      campus: "select",
      programme: "",
    }
  }
  campuses = [
    "Antwerpen",
    "Duffel",
    "Geel",
    "Lier",
    "Mechelen",
    "Sint-Katelijne-Waver",
    "Sint-Niklaas",
    "Turnhout",
    "Vorselaar"
  ];


  openModal = () => {
    this.setState({ showModal: true })
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }


  handleVerificationSuccess = (token) => {
    this.setState({ hcapthaToken: token })
  }

  onFormSubmit = (event) => {
    event.preventDefault();

    if (!this.state.hcapthaToken) {
      this.setState({ error: "Please verify you are human!" })
      return;
    }
    if (this.state.campus === "select") {
      this.setState({ error: "Please select your campus!" })
      return;
    }


    fetch("https://camplus.club/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        campus: this.state.campus,
        programme: this.state.programme,
        "h-captcha-response": this.state.hcapthaToken
      })
    }).then(res => res.json()).then(data => {
        if (data.error) {
          this.setState({ error: data.error })
        } else {
          this.setState({ showModal: false, email: "", campus: "select", programme: "", hcapthaToken: "" })
          ToastService.send({ message: "Thank you! We signed you up for updates!" })
        }
      })
  }


  render() {
    return (
      <>
        <Toast onClose={() => this.setState({showToast: false})} show={this.state.showToast} delay={3000} position="top-center" autohide>
        <Toast.Header closeButton={true}>
            </Toast.Header>
          <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
        </Toast>
        <Card>
          <Card.Img variant="top" src="" />
          <Card.Body>
            <Card.Title>Your programme not here?</Card.Title>
            <Card.Text>
              Your programme is not here yet. Do you want to know when they launch a Discord community? Sign up below and we will let you know when there is news!
            </Card.Text>
            <Button variant="info" onClick={this.openModal} >Let me know!</Button>
          </Card.Body>
        </Card>
        <Modal show={this.state.showModal} onHide={this.closeModal} backdrop="static" keyboard={false} centered size="lg" >
          <Modal.Header closeButton>
            <Modal.Title>Let me know when our Discord launches!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs={7}>
                {this.state.error ?
                  <Alert variant="danger">
                    {this.state.error}
                  </Alert> 
                  : ''}
                <p>Fill in your details below, don't worry I will not spam you (I am a friendly robot)!</p>

                <Form onSubmit={this.onFormSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" required onChange={(e) => this.setState({ email: e.target.value })} value={this.state.email} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Campus</Form.Label>
                    <Form.Select onChange={(e) => this.setState({ campus: e.target.value })} value={this.state.campus} required>
                      <option value="select" disabled selected>Select your campus</option>
                      {this.campuses.map(campus => (
                        <option key={campus} value={campus}>{campus}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Programme</Form.Label>
                    <Form.Control type="text" placeholder="Enter your programme" onChange={(e) => this.setState({ programme: e.target.value })} value={this.state.programme} required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <HCaptcha
                      sitekey="e28461d3-e633-4af7-abe4-8169abe9ba42"
                      onVerify={(token) => this.handleVerificationSuccess(token)}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Sign up!
                  </Button>
                </Form>
              </Col>
              <Col xs={5}>
                <img src="/thomas-sad.png" className={"img-fluid"} />
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default NotYet;