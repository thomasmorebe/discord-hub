import { Component } from "react";
import { Card, Button, Modal, Row, Col, Badge } from "react-bootstrap"
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { withTranslation } from 'react-i18next';


class Server extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server: props.server,
      showModal: false,
      inviteURL: null,
    }
  }

  join() {
    fetch(`/api/servers/${this.state.server.id}/join`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.props.refresh();
        }
      }
    );
  }

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
    const { t } = this.props;
    return (
      <>
        <Card>
          <Card.Img variant="top" src={this.state.server.bannerURL} />
          <Card.Body>
            <Card.Title>{this.state.server.name}</Card.Title>
            <Card.Text>
              <div>
                {this.state.server.tags.map(tag => (
                  <Badge pill bg="primary mx-1">
                    {tag}
                  </Badge>
                ))}
              </div>
              {this.state.server.description}
            </Card.Text>
            <Button variant="info"onClick={this.openModal} >{t('join_button')}</Button>
          </Card.Body>
        </Card>
        <Modal show={this.state.showModal} onHide={this.closeModal} backdrop="static" keyboard={false} centered size="lg" >
          <Modal.Header closeButton>
            <Modal.Title>{t('one_step_away', {GUILD: this.state.server.name})}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs={7}>
                <p>{t('only_robot_can_enter')}</p>
                <p>{t('confirm_not_robot')}</p>
                {
                this.state.inviteURL ? 
                <div className="mt-3">
                  Congratulations! Did Discord not open? Click below! 
                  <Button variant="primary" href={this.state.inviteURL}>Join on Discord</Button>
                  </div>
                :  <HCaptcha
                    sitekey="e28461d3-e633-4af7-abe4-8169abe9ba42"
                    onVerify={(token,ekey) => this.handleVerificationSuccess(token, ekey)}
                  />
                }
              </Col>
              <Col xs={5}>
                <img src="/thomasbot.png" className={"img-fluid"} />
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default withTranslation()(Server);