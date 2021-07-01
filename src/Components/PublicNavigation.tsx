import { useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { userContext } from '../Contexts/Contexts'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useState } from 'react';

export const PublicNavigation = ({ children }: { children: JSX.Element }) => {

    const value = useContext(userContext);
    const [profileMenu, setProfileMenu] = useState<null | HTMLElement>(null)
    const profileOpen = Boolean(profileMenu)

    const userLogout = () => {
        localStorage.removeItem('token');
        value.toggleUser();
    }

    const handleMenuClose = () => {
        setProfileMenu(null)
    }

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                flexGrow: 1,
            },
            menuButton: {
                marginRight: theme.spacing(2),
            },
            title: {
                flexGrow: 1,
            }
        }),
    );

    const classes = useStyles();

    /*

     <Navbar className="mb-3" collapseOnSelect expand="lg" bg="danger" variant="dark">
            <LinkContainer to={value.user ? "/part" : "/login"}><Navbar.Brand>English App</Navbar.Brand></LinkContainer>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                {value.user && <>
                    <Nav className="mr-auto">
                        <LinkContainer to="/part"><Nav.Link>Lancer une partie</Nav.Link></LinkContainer>
                        <LinkContainer to="/gamehistory"><Nav.Link>Historique des parties</Nav.Link></LinkContainer>
                        {value.user?.admin && <LinkContainer to="/questions"><Nav.Link>Administration</Nav.Link></LinkContainer>}
                    </Nav>
                </>
                }

                <Nav>
                    {value.user ?
                        <>
                            <NavDropdown title={value.user.prenom} id="collasible-nav-dropdown">
                                <LinkContainer to="/profile"><NavDropdown.Item>Mon profil</NavDropdown.Item></LinkContainer>
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
    */

    return <>
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        English APP
                    </Typography>
                    {value.user ?
                        <>
                         <Button color="inherit" onClick={(e) => setProfileMenu(e.currentTarget)}>{value.user.prenom}</Button>
                            <Menu
                                anchorEl={profileMenu}
                                id="simple-menu"
                                keepMounted
                                open={profileOpen}
                                onClose={handleMenuClose}
                            >
                              <MenuItem component={Link} onClick={handleMenuClose} to="/profile">Mon profile</MenuItem>
                              <MenuItem onClick={() => (handleMenuClose(), userLogout())}>Déconnexion</MenuItem>
                            </Menu>

                        </> :
                        <>
                          <Button component={Link} to="/login" color="inherit">Connexion</Button>
                            <Button component={Link} to="/register" color="inherit">Inscription</Button>
                        </>
                    }
                </Toolbar>
            </AppBar>
            {children}
        </div>
    </>
}