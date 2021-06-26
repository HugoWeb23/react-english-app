import { useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { userContext } from '../Contexts/Contexts'
import { LinkContainer } from 'react-router-bootstrap'

export const Navigation = ({ children }: {children: JSX.Element}) => {

  return <>
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Navbar.Brand href="#home">Administration</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
              <LinkContainer to="/questions"><Nav.Link>Gestion des questions</Nav.Link></LinkContainer>
              <LinkContainer to="/themes"><Nav.Link>Gestion des thèmes</Nav.Link></LinkContainer>
              <LinkContainer to="/manageaccounts"><Nav.Link>Gestion des comptes</Nav.Link></LinkContainer>
        </Nav>
        <Nav>
        <LinkContainer to="/part"><Nav.Link>Quitter l'administration</Nav.Link></LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    {children}
  </>
}