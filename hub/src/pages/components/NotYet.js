import { Component } from "react";
import { Card, Button, Modal, Row, Col, Form } from "react-bootstrap"
import HCaptcha from '@hcaptcha/react-hcaptcha';


class NotYet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
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
    this.setState({showModal: true})
  }

  closeModal = () => {
    this.setState({showModal: false})
  }

  handleVerificationSuccess = (token, ekey) => {
    fetch(`https://camplus.club/api/servers/${this.state.server.guildID}/join`, {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

      //make sure to serialize your JSON body
      body: JSON.stringify({
        "h-captcha-response": token,
        ekey: ekey
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          alert(res.error);
          return
        }

        window.open(`https://discord.gg/${res.invite}`, '_blank');
        this.setState({inviteURL: `https://discord.gg/${res.invite}`});
      }
    );
  }

  render() {
    return (
      <>
        <Card>
          <Card.Img variant="top" src=""/>
          <Card.Body>
            <Card.Title>Your programme not here?</Card.Title>
            <Card.Text>
              Your programme is not here yet. Do you want to know when they launch a Discord community? Sign up below and we will let you know when there is news!
            </Card.Text>
            <Button variant="info"onClick={this.openModal} >Let me know!</Button>
          </Card.Body>
        </Card>
        <Modal show={this.state.showModal} onHide={this.closeModal} backdrop="static" keyboard={false} centered size="lg" >
          <Modal.Header closeButton>
            <Modal.Title>Let me know when our Discord launches!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs={7}>
                <p>Fill in your details below, don't worry I will not spam you (I am a friendly robot)!</p>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Campus</Form.Label>
                    <Form.Select required>
                      <option disabled selected>Select your campus</option>
                      {this.campuses.map(campus => (
                        <option key={campus} value={campus}>{campus}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Programme</Form.Label>
                    <Form.Control type="text" placeholder="Enter your programme" required />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Submit
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