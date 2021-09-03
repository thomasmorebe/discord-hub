import { Component } from "react";
import { Card, Button, Modal, Row, Col, Form, Alert, Toast } from "react-bootstrap"
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { ToastService } from "../../_services/toastService";
import { withTranslation } from 'react-i18next';


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
    const { t } = this.props;
    return (
      <>
        <Card>
          <Card.Img variant="top" src="" />
          <Card.Body>
            <Card.Title>{t("programme_not_here")}</Card.Title>
            <Card.Text>
              {t("programme_not_here_desc")}
            </Card.Text>
            <Button variant="info" onClick={this.openModal} >{t('let_me_know')}</Button>
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

export default withTranslation()(NotYet);