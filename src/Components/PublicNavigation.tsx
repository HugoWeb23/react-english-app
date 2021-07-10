import { useContext, useState } from 'react';
import { userContext } from '../Contexts/Contexts'
import { Link, NavLink } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

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
                                transitionDuration={0}
                            >
                             <MenuItem component={NavLink} onClick={handleMenuClose} activeClassName="selected" to="/profile" style={{color: 'inherit'}}>Mon profile</MenuItem>
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