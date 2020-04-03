import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {useDispatch, useSelector} from "react-redux";
import {logoutUserGet} from "../../../store/action/usersActions";
import Menu from "../Menu/Menu";
import AnonymousMenu from "./AnonymousMenu";
import UserMenu from "./UserMenu";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function ButtonAppBar() {
    const user = useSelector(state => state.users.user);
    const dispatch = useDispatch();
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        <Menu/>
                    </Typography>
                    {user ? (
                        <UserMenu user={user} logout={() => dispatch(logoutUserGet())}/>
                    ) : (
                        <>
                            <Button color="inherit"><AnonymousMenu to={"/register"}>Register</AnonymousMenu></Button>
                            <Button color="inherit"><AnonymousMenu to={"/login"}>Login</AnonymousMenu></Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}


