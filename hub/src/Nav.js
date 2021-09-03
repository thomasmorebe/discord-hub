import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

function AppNav() {
    const { t } = useTranslation();

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">Thomas More Discord Hub</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-end">
                <NavDropdown title={t('select_language')}>
                        <NavDropdown.Item onClick={() => {i18n.changeLanguage("nl")}} >NL</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => {i18n.changeLanguage("EN")}}>EN</NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}


export default AppNav;