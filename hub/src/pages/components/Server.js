import { useState } from "react";
import { Card, Button, Modal, Row, Col, Badge } from "react-bootstrap";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useTranslation, withTranslation } from "react-i18next";

function Server({ server }) {
  const [showModal, setShowModal] = useState(false);
  const [inviteURL, setInviteURL] = useState("");

  const join = () => {
    fetch(`/api/servers/${server.id}/join`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.props.refresh();
        }
      });
  };

  const handleVerificationSuccess = (token, ekey) => {
    fetch(`https://camplus.club/api/servers/${server.guildID}/join`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      //make sure to serialize your JSON body
      body: JSON.stringify({
        "h-captcha-response": token,
        ekey: ekey,
      }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          alert(res.error);
          return;
        }

        window.open(`https://discord.gg/${res.invite}`, "_blank");
        setInviteURL(`https://discord.gg/${res.invite}`);
      });
  };

  const { t } = useTranslation();
  return (
    <>
      <Card>
        <Card.Img variant="top" src={server.bannerURL} />
        <Card.Body>
          <Card.Title>{server.name}</Card.Title>
          <Card.Text>
            <div>
              {server.tags.map(tag => (
                <Badge pill bg="primary mx-1">
                  {tag}
                </Badge>
              ))}
            </div>
            {server.description}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="info" onClick={() => setShowModal(true)}>
            {t("join_button")}
          </Button>
        </Card.Footer>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("one_step_away", { GUILD: server.name })}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={7}>
              <p>{t("only_robot_can_enter")}</p>
              <p>{t("confirm_not_robot")}</p>
              {inviteURL ? (
                <div className="mt-3">
                  Congratulations! Did Discord not open? Click below!
                  <Button variant="primary" href={inviteURL}>
                    Join on Discord
                  </Button>
                </div>
              ) : (
                <HCaptcha sitekey="e28461d3-e633-4af7-abe4-8169abe9ba42" onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)} />
              )}
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

export default withTranslation()(Server);
