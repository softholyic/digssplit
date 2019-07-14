import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import logo from './../img/digssplit_logo.png'
import backgroundImg from './../img/background.jpg'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		background:'transparent',
		
	},
	menuButton: {
        // marginRight: theme.spacing(2),
		marginLeft: "auto",
		color:"black"
	},
	img: {
		marginTop:"10px",
    },
    container:{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition:"20% 50%",
        height:"100vh"
        
	},
	AppBar:{
		background:'transparent',
		boxShadow:'none',
	}
}));

export default function TemplatePage(props) {

		const classes = useStyles();
		return (
			<React.Fragment>
				<CssBaseline />

				
                <Container maxWidth="lg" className={classes.container} >
                    <div className={classes.root}>
					<AppBar position="static"  className={classes.AppBar}>
						<Toolbar disableGutters={true}>
							
							<img src={logo} className={classes.img} alt="Kitten" height="75" width="75" />
                            <IconButton
								edge="start"
								className={classes.menuButton}
								aria-label="Menu"
							>
								<MenuIcon />
							</IconButton>
						</Toolbar>
					</AppBar>
				</div>
                    {props.children}
                </Container>
			</React.Fragment>
		);
	
}
