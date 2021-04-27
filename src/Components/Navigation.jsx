import { useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {userContext} from '../Contexts/Contexts'
import { LinkContainer } from 'react-router-bootstrap'

export const Navigation = () => {

const {user, toggleUser} = useContext(userContext);

const userLogout = () => {
  localStorage.removeItem('token');
  toggleUser(null);
}
  
return <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
<Navbar.Brand href="#home">Anglais-App</Navbar.Brand>
<Navbar.Toggle aria-controls="responsive-navbar-nav" />
<Navbar.Collapse id="responsive-navbar-nav">
  <Nav className="mr-auto">
  {user && user.admin ? 
      <>
    <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
        <LinkContainer to="/test"><NavDropdown.Item>Test</NavDropdown.Item></LinkContainer>
      <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
      <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
    </NavDropdown>
    </>
    : null }
  </Nav>
  <Nav>
      {user ? 
      <>
      <Nav.Link href="#deets">Bonjour {user.prenom}</Nav.Link>
      <Nav.Link href="#" onClick={userLogout}>Déconnexion</Nav.Link>
      </> :
      <>
       <LinkContainer to="/login"><Nav.Link href="#deets">Connexion</Nav.Link></LinkContainer>
       <LinkContainer to="/register"><Nav.Link href="#deets">Inscription</Nav.Link></LinkContainer>
      </>
      }
      </Nav>
</Navbar.Collapse>
</Navbar>
}