import { Navbar, NavDropdown, NavItem, NavLink } from "react-bootstrap";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

function AppNav() {
  const { t } = useTranslation();

  return (
    <header className="site-header">
      <Navbar bg="white" expand="lg">
          <Navbar.Brand href="#home">
            <img src="/logo.svg" alt="Thomas More" height="53" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end bg-white">
            <NavItem className="normal-link">
              <NavLink href="https://thomasmore.be">Home</NavLink>
            </NavItem>
            <NavItem className="normal-link">
              <NavLink href="https://thomasmore.be">Opleidingen</NavLink>
            </NavItem>
            <NavDropdown title={t("select_language")}>
              <NavDropdown.Item onClick={() => i18n.changeLanguage("nl")}>NL</NavDropdown.Item>
              <NavDropdown.Item onClick={() => i18n.changeLanguage("EN")}>EN</NavDropdown.Item>
            </NavDropdown>
          </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

export default AppNav;
