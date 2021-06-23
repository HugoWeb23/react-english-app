import { useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { userContext } from '../Contexts/Contexts'
import { LinkContainer } from 'react-router-bootstrap'

export const Navigation = ({ children }: {children: JSX.Element}) => {

  const value = useContext(userContext);

  const userLogout = () => {
    localStorage.removeItem('token');
    value.toggleUser();
  }

  return <>
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Navbar.Brand href="#home">Administration</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          {value.user && value.user.admin ?
            <>
              <NavDropdown title="Administration" id="collasible-nav-dropdown">
                <LinkContainer to="/part"><NavDropdown.Item>Lancer une partie</NavDropdown.Item></LinkContainer>
                <LinkContainer to="/gamehistory"><NavDropdown.Item>Historique des parties</NavDropdown.Item></LinkContainer>
                <LinkContainer to="/test"><NavDropdown.Item>Test</NavDropdown.Item></LinkContainer>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
              <LinkContainer to="/questions"><Nav.Link>Gestion des questions</Nav.Link></LinkContainer>
              <LinkContainer to="/themes"><Nav.Link>Gestion des thèmes</Nav.Link></LinkContainer>
              <LinkContainer to="/manageaccounts"><Nav.Link>Gestion des comptes</Nav.Link></LinkContainer>
            </>
            : null}
        </Nav>
        <Nav>
        <LinkContainer to="/part"><Nav.Link>Quitter l'administration</Nav.Link></LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    {children}
  </>
}