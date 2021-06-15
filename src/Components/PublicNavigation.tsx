import { useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { userContext } from '../Contexts/Contexts'
import { LinkContainer } from 'react-router-bootstrap'

export const PublicNavigation = ({ children }: {children: JSX.Element}) => {

    const value = useContext(userContext);

    const userLogout = () => {
        localStorage.removeItem('token');
        value.toggleUser();
        value.toggleAlert();
    }
    return <>
        <Navbar collapseOnSelect expand="lg" bg="danger" variant="dark">
            <Navbar.Brand href="#home">English App</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                            <LinkContainer to="/part"><Nav.Link>Lancer une partie</Nav.Link></LinkContainer>
                            <LinkContainer to="/gamehistory"><Nav.Link>Historique des parties</Nav.Link></LinkContainer>
                            {value.user?.admin && <LinkContainer to="/questions"><Nav.Link>Administration</Nav.Link></LinkContainer>}
                </Nav>
                <Nav>
                    {value.user ?
                        <>
                            <NavDropdown title={value.user.prenom} id="collasible-nav-dropdown">
                                <LinkContainer to="/l"><NavDropdown.Item>Mon profil</NavDropdown.Item></LinkContainer>
                            </NavDropdown>
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
        {children}
    </>
}