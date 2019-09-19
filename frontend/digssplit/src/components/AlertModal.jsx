import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import Textfield from './../components/Textfield';
import Select from './../components/Select';
import MultiSelect from './../components/MultiSelect';
import CustomButton from './../components/Button';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="left" ref={ref} {...props} />;
});

const styles = {
	select: {
		marginBottom: '16px',
		width: '220'
	},
	dialogTitle: {
		padding: '16px 24px 8px 24px'
	},
	dialogActions: {
		justifyContent: 'center'
	},
	dialog: {
		height: '385px',
		width: '265px'
	}
};

export default class AlertModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showing: false
		};
	}
	handleAlert = () => {
		this.setState(prevState => ({
			showing: !prevState.showing
		}));
	};

	confirmDelete = () => {
		this.props.handleDeleteExpense(this.props.id);
		this.handleAlert();
	};

	render() {
		return (
			<div>
				{this.props.expenseDeleted}
				<Button onClick={this.handleAlert}>Delete</Button>
				<Dialog
					open={this.state.showing}
					onClose={this.handleAlert}
					TransitionComponent={Transition}
					aria-labelledby="form-dialog-title"
					//style={styles.dialog}
					fullWidth={true}
				>
					<DialogTitle id="form-dialog-title" style={styles.dialogTitle}>
						WARNING
					</DialogTitle>

					<DialogContent>
						<h4>Are you sure you want to delete this expense?</h4>
					</DialogContent>

					<DialogActions style={styles.dialogActions}>
						<CustomButton
							onClick={this.confirmDelete}
							style={styles.signInButton}
							text={'Delete'}
						/>

						<CustomButton
							onClick={this.handleAlert}
							style={styles.signInButton}
							text={'Cancel'}
						/>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}
