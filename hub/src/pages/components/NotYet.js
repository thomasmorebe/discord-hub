import { useState } from "react";
import { Card, Button, Modal, Row, Col, Form, Alert, Toast } from "react-bootstrap"
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { ToastService } from "../../_services/toastService";
import { useTranslation, withTranslation } from 'react-i18next';


function NotYet() {
  const [showModal, setShowModal] = useState(false);
  const [hcapthaToken, setHcapthaToken] = useState('');
  const [email, setEmail] = useState('');
  const [campus, setCampus] = useState('select');
  const [programme, setProgramme] = useState('');
  const [error, setError] = useState('');

  const campuses = [
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

  const onFormSubmit = (event) => {
    event.preventDefault();

    if (!hcapthaToken) {
      setError("Please verify you are human!")
      return;
    }
    if (campus === "select") {
      setError("Please select your campus!")
      return;
    }


    fetch("https://camplus.club/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        campus: campus,
        programme: programme,
        "h-captcha-response": hcapthaToken
      })
    }).then(res => res.json()).then(data => {
      if (data.error) {
        setError(data.error)
      } else {
        setShowModal(false);
        setEmail('');
        setCampus('select');
        setProgramme('');
        setHcapthaToken('');

        ToastService.send({ message: "Thank you! We signed you up for updates!" })
      }
    })
  }



  const { t } = useTranslation();
  return (
    <>
      <Card>
        <Card.Img variant="top" src="/opdehoogte.jpg" alt="find feel join your next level" />
        <Card.Body>
          <Card.Title>{t("programme_not_here")}</Card.Title>
          <Card.Text>
            {t("programme_not_here_desc")}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="info" onClick={() => setShowModal(true)} >{t('let_me_know')}</Button>
        </Card.Footer>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false} centered size="lg" >
        <Modal.Header closeButton>
          <Modal.Title>{t('let_me_know_when_discord_launches')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={7}>
              {error &&
                <Alert variant="danger">
                  {error}
                </Alert>
              }
              <p>{t('fill_in_your_details')}</p>

              <Form onSubmit={onFormSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('email_address')}</Form.Label>
                  <Form.Control type="email" placeholder={t('enter_email')} required onChange={(e) => setEmail(e.target.value)} value={email} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{t("campus")}</Form.Label>
                  <Form.Select onChange={(e) => setCampus(e.target.value)} value={campus} required>
                    <option value="select" disabled selected>{t('select_your_campus')}</option>
                    {campuses.map(campus => (
                      <option key={campus} value={campus}>{campus}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{t('programme')}</Form.Label>
                  <Form.Control type="text" placeholder={t('enter_your_programme')} onChange={(e) => setProgramme(e.target.value)} value={programme} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <HCaptcha
                    sitekey="e28461d3-e633-4af7-abe4-8169abe9ba42"
                    onVerify={(token) => setHcapthaToken(token)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  {t('sign_up')}
                </Button>
              </Form>
            </Col>
            <Col xs={5}>
              <img src="/thomas-sad.png" alt={t('sad_thomas_bot')} className={"img-fluid"} />
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NotYet;