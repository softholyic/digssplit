import React, { Component } from 'react';
import {
	BrowserRouter,
	Route,
	Switch,
	withRouter,
	Redirect
} from 'react-router-dom';
import axios from 'axios';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Expenses from './pages/Expenses';
import TemplatePage from './pages/TemplatePage';
import About from './pages/About';
import Confirmation from './components/Confirmation';

const getInitialState = () => ({
	drawer: false,
	username: '',
	user: JSON.parse(localStorage.getItem('user')) || '',
	email: '',
	password: '',
	usernameSignUp: '',
	emailSignUp: '',
	passwordSignUp: '',
	passwordSignUpConfirm: '',
	createDigs: 'true',
	joiningDigs: '',
	digs: '',
	loading: false,
	existingDigs: [],
	expenses: JSON.parse(localStorage.getItem('expenses')) || '',
	path: '',
	payed: [],
	isDialogOpen: false,
	expensename: '',
	amount: '',

	categories: JSON.parse(localStorage.getItem('categories')) || [],
	selectedCategory: '',
	digsMates: JSON.parse(localStorage.getItem('digsMates')) || [0, 1, 2, 3, 4],
	selecteddigsMates: [],
	AUTH_TOKEN: localStorage.getItem('AUTH_TOKEN') || '',
	AUTHENTICATED: localStorage.getItem('AUTHENTICATED') || false,
	error: '',
	inviteModal: false,
	inviteName: '',
	inviteEmail: '',
	expenseDeleted: false,
	confirmationMsg: 'heyy'
});

const categoriesList = [
	'UTILITIES',
	'HOUSEHOLD ITEMS',
	'TRANSPORT',
	'FOOD',
	'ENTERTAINMENT',
	'BOOZE',
	'LOAN SHARK'
];

class App extends Component {
	state = getInitialState();

	// axios.defaults.headers.common['Authorization'] = this.state.AUTH_TOKEN;

	toggleDrawer = open => event => {
		if (
			event.type === 'keydown' &&
			(event.key === 'Tab' || event.key === 'Shift')
		) {
			return;
		}
		this.setState({ drawer: open });
	};

	currentPath = () => window.location.href;

	handleSubmitSignIn = event => {
		event.preventDefault();
		this.setState({ loading: true });
		this.signIn();
	};
	handleSubmitSignUp = event => {
		event.preventDefault();
		const { passwordSignUp, passwordSignUpConfirm } = this.state;
		if (passwordSignUp === passwordSignUpConfirm) {
			this.setState({ loading: true });
			this.signUp();
		} else {
			this.setState({ error: { password: "The passwords don't match" } });
		}
	};

	clearConfirmationMsg = () => this.setState({ confirmationMsg: '' });

	signIn = async () => {
		console.log('You are trying to login');
		try {
			const signIn = await axios.post(
				'http://localhost:8000/rest-auth/login/',
				{
					email: this.state.email,
					password: this.state.password
				}
			);
			let responseKey = 'Token ' + signIn.data.key;

			const getUser = await axios.get('http://localhost:8000/users/current', {
				headers: { Authorization: `${responseKey}` }
			});
			let responseUser = getUser.data;

			const getDigsMates = await axios.get(
				`http://localhost:8000/users/?digs=${responseUser.digs.id}`
			);
			const digsMates = getDigsMates.data;

			const getDigsExpenses = await axios.get(
				`http://localhost:8000/expenses/?digs=${responseUser.digs.id}`
			);

			const expenses = getDigsExpenses.data;
			const categories = [
				...new Set(expenses.map(expense => expense.category))
			];
			this.setState({
				AUTH_TOKEN: responseKey,
				AUTHENTICATED: true,
				user: responseUser,
				digsMates,
				expenses,
				categories,
				loading: false
			});
			localStorage.setItem('AUTH_TOKEN', responseKey);
			localStorage.setItem('categories', JSON.stringify(categories));
			localStorage.setItem('AUTHENTICATED', true);
			localStorage.setItem('user', JSON.stringify(responseUser));
			localStorage.setItem('digsMates', JSON.stringify(digsMates));
			localStorage.setItem('expenses', JSON.stringify(expenses));
		} catch (err) {
			// console.log(err.response.data.non_field_errors);
			// this.setState({ error: err.response.data.non_field_errors });
			this.setState({ error: err.response.data, loading: false });
		}
	};

	signUp = async () => {
		try {
			const signUp = await axios.post(
				'http://localhost:8000/rest-auth/registration/',
				{
					username: this.state.usernameSignUp,
					email: this.state.emailSignUp,
					password1: this.state.passwordSignUp,
					password2: this.state.passwordSignUpConfirm,
					digs: {
						name: this.state.joiningDigs
							? this.state.joiningDigs
							: this.state.digs
					}
				}
			);

			let responseKey = 'Token ' + signUp.data.key;
			const getUser = await axios.get('http://localhost:8000/users/current', {
				headers: { Authorization: `${responseKey}` }
			});
			let responseUser = getUser.data;

			const getDigsMates = await axios.get(
				`http://localhost:8000/users/?digs=${responseUser.digs.id}`
			);
			const digsMates = getDigsMates.data;

			const getDigsExpenses = await axios.get(
				`http://localhost:8000/expenses/?digs=${responseUser.digs.id}`
			);
			const expenses = getDigsExpenses.data;
			const categories = [
				...new Set(expenses.map(expense => expense.category))
			];
			this.setState({
				AUTH_TOKEN: responseKey,
				AUTHENTICATED: true,
				user: responseUser,
				digsMates,
				expenses,
				categories,
				loading: false
			});
			localStorage.setItem('AUTH_TOKEN', responseKey);
			localStorage.setItem('categories', JSON.stringify(categories));
			localStorage.setItem('AUTHENTICATED', true);
			localStorage.setItem('user', JSON.stringify(responseUser));
			localStorage.setItem('digsMates', JSON.stringify(digsMates));
			localStorage.setItem('expenses', JSON.stringify(expenses));
		} catch (error) {
			console.log(error);
			this.setState({ error: error.response.data, loading: false });
		}
	};

	getDigs = () => {
		axios
			.get('http://localhost:8000/digs/')
			.then(response => {
				console.log(response);
				let digsArray = response.data.map(dig => ({ label: dig.name }));
				this.setState({ existingDigs: digsArray });
			})
			.catch(error => {
				console.log(error);
			});
	};

	getUser = () => {
		axios
			.get('http://localhost:8000/users/current', {
				headers: { Authorization: `${this.state.AUTH_TOKEN}` }
			})
			.then(response => {
				console.log(response.data);
				this.setState({ user: response.data });
			})
			.catch(error => {
				console.log(error);
			});
	};

	signOut = () => {
		localStorage.clear();
		this.setState(getInitialState());
	};

	handleChange = event => {
		let name = event.target.name;
		this.setState({ ...this.state, [name]: event.target.value });
		console.log('THis works?');
	};

	handleChangeRadio = event => {
		this.setState({ createDigs: event.target.value });
	};

	handleAutoComplete = input => {
		this.setState({ joiningDigs: input });
	};

	handleCheckBox = e => {
		const { payed } = this.state;
		let userId = e.target.value;
		let index = payed.indexOf(userId);
		//check if the it's already selected else add it to the payed array
		if (index !== -1) {
			payed.splice(index, 1);
		} else {
			payed.push(userId);
		}

		this.setState({ payed });
	};

	handleInviteModal = () => {
		this.setState(prevState => ({
			inviteModal: !prevState.inviteModal
		}));
	};

	sendInvite = () => {
		const { inviteName, inviteEmail } = this.state;
		const message = `You are being invited by ${
			this.state.user.username
		} to join digssplit, go to
		www.digssplit.herokuapp.com/signup and search for ${this.state.user.digs.name.toUpperCase()} to sign up and join your mate.`;
		let invite = { name: inviteName, email: inviteEmail, message: message };
		axios
			.post('http://localhost:8000/invite/', invite, {
				headers: { Authorization: `${this.state.AUTH_TOKEN}` }
			})
			.then(response => {
				this.setState({ inviteName: '', inviteEmail: '', inviteModal: false });
			})
			.catch(error => {
				console.log(error);
			});
	};

	confirmation = confirmationText =>
		setTimeout(() => {
			this.setState({ expenseDeleted: false });
			return <Confirmation confirmationText={confirmationText} />;
		}, 2000);

	//returns the digsmates id given the name of the user
	digsMateId = name => {
		let userIdArray = this.state.digsMates.filter(digsmate => {
			return digsmate.username === name;
		});
		return userIdArray[0].id;
	};

	//updates expenses when digmates who have payed are selected
	updatePayments = () => {
		const { expenses, payed } = this.state;

		//get the expenses name from state payed which looks like ['username,expensename']
		let payedExpenses = payed.map(payer => {
			let expense = payer.split(',');
			return expense[1];
		});
		//get the usernames of the selected digsmates from payed state
		let expensePayer = payed.map(payer => {
			let expense = payer.split(',');
			return expense[0];
		});
		console.log('expense payer', expensePayer, 'payedExpense', payedExpenses);
		//get the expenses from state using the names of the expenses
		let filteredExpense = expenses.filter(expense => {
			return payedExpenses.indexOf(expense.name) !== -1;
		});
		let filteredExpenses = [];
		payedExpenses.map(payed => {
			for (let i = 0; i < expenses.length; i++) {
				if (expenses[i].name === payed) {
					filteredExpenses.push(expenses[i]);
				}
			}
			return null;
		});

		console.log(filteredExpenses);

		//get indexes of the payed expenses from state and store them indexes array
		let indexes = [];
		expenses.map((expense, index) => {
			filteredExpenses.map(filtered => {
				if (filtered.name === expense.name) {
					indexes.push(index);
				}
				return null;
			});
			return null;
		});
		expensePayer.map((payer, index) => {
			let expense = expenses[indexes[index]];
			let amountPerPayer = expense.amount / expense.members_owing.length;
			let indexOfId = expense.members_owing.indexOf(this.digsMateId(payer));
			if (indexOfId !== -1) {
				expense.members_owing.splice(indexOfId, 1);
				expense.amount = Math.round(
					((expense.amount - amountPerPayer) * 100) / 100
				);
				axios
					.put(`http://localhost:8000/expenses/${expense.id}/`, expense, {
						headers: { Authorization: `${this.state.AUTH_TOKEN}` }
					})
					.then(response => {
						console.log(response);
						expenses[indexes[index]] = expense;
						this.setState({ expenses, payed: [] }, () =>
							localStorage.setItem(
								'expenses',
								JSON.stringify(this.state.expenses)
							)
						);
					})
					.catch(error => {
						console.log(error);
					});
			}
			return null;
		});

		payedExpenses = [];
		expensePayer = [];
		filteredExpense = [];
		indexes = [];
	};

	DigsmateId = members_owing => {
		let digsMatesId = members_owing.map(digsmateUsername => {
			let filterId = this.state.digsMates.filter(mate => {
				return mate.username === digsmateUsername ? mate.id : '';
			});
			return filterId[0].id;
		});
		return digsMatesId;
	};

	handleDeleteExpense = id => {
		const { expenses } = this.state;
		const index = expenses.findIndex(expense => expense.id === id);
		expenses.splice(index, 1);

		axios
			.delete(`http://localhost:8000/expenses/${id}`, {
				headers: { Authorization: `${this.state.AUTH_TOKEN}` }
			})
			.then(response => {
				console.log(response);
				this.setState({ expenses, expenseDeleted: true }, () =>
					localStorage.setItem('expenses', JSON.stringify(this.state.expenses))
				);
			})
			.catch(error => {
				console.log(error);
			});
	};

	handleAddExpense = () => {
		const {
			expenses,
			expensename,
			amount,
			selectedCategory,
			selecteddigsMates,
			user,
			categories
		} = this.state;
		let selectedDigsMatesID = this.DigsmateId(selecteddigsMates);

		let expense = {
			name: expensename,
			amount: amount,
			category: selectedCategory.substring(0, 1),
			members_owing: selectedDigsMatesID,
			digs: user.digs.id
		};
		axios
			.post('http://localhost:8000/expenses/', expense, {
				headers: { Authorization: `${this.state.AUTH_TOKEN}` }
			})
			.then(response => {
				expenses.push(response.data);
				categories.push(response.data.category);
				console.log(expenses);
				this.setState(
					{
						expenses,
						expensename: '',
						selectedCategory: '',
						amount: '',
						selecteddigsMates: [],
						categories
					},
					() => {
						localStorage.setItem(
							'expenses',
							JSON.stringify(this.state.expenses)
						);
						localStorage.setItem(
							'categories',
							JSON.stringify(this.state.categories)
						);
					}
				);
			})
			.catch(error => {
				console.log(error);
			});

		console.log(expenses);

		this.handleDialog();
	};

	handleDialog = () => {
		this.setState(prevState => ({
			isDialogOpen: !prevState.isDialogOpen
		}));
	};

	componentDidMount() {
		this.setState({ path: window.location.href });
		this.getDigs();
	}

	render() {
		return (
			<div className="App">
				<BrowserRouter>
					<TemplatePage
						drawer={this.state.drawer}
						inviteEmail={this.state.inviteEmail}
						inviteName={this.state.inviteName}
						inviteModal={this.state.inviteModal}
						handleInviteModal={this.handleInviteModal}
						sendInvite={this.sendInvite}
						toggleDrawer={this.toggleDrawer}
						handleChange={this.handleChange}
						AUTHENTICATED={this.state.AUTHENTICATED}
						signOut={this.signOut}
						loading={this.state.loading}
						confirmationMsg={this.state.confirmationMsg}
						clearConfirmationMsg={this.clearConfirmationMsg}
						handleDialog={this.handleDialog}
						path={this.state.path}
					>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route
								exact
								path="/login"
								render={props => (
									<Login
										{...props}
										email={this.state.email}
										password={this.state.password}
										AUTHENTICATED={this.state.AUTHENTICATED}
										handleChange={this.handleChange}
										handleSubmit={this.handleSubmitSignIn}
										error={this.state.error}
									/>
								)}
							/>
							<Route
								exact
								path="/signup"
								render={props => (
									<Signup
										{...props}
										usernameSignUp={this.state.usernameSignUp}
										emailSignUp={this.state.emailSignUp}
										passwordSignUp={this.state.passwordSignUp}
										passwordSignUpConfirm={this.state.passwordSignUpConfirm}
										handleChange={this.handleChange}
										handleChangeRadio={this.handleChangeRadio}
										createDigs={this.state.createDigs}
										handleAutoComplete={this.handleAutoComplete}
										error={this.state.error}
										loading={this.state.loading}
										AUTHENTICATED={this.state.AUTHENTICATED}
										digs={this.state.digs}
										signUp={this.signUp}
										suggestions={this.state.existingDigs}
										handleSubmit={this.handleSubmitSignUp}
									/>
								)}
							/>
							<Route
								exact
								path="/expenses"
								render={props => (
									<Expenses
										{...props}
										categories={this.state.categories}
										expenses={this.state.expenses}
										AUTHENTICATED={this.state.AUTHENTICATED}
										checkbox={this.state.checkbox}
										expensename={this.state.expensename}
										amount={this.state.amount}
										digsMates={this.state.digsMates}
										username={this.state.user.username}
										categoriesList={categoriesList}
										selectedCategory={this.state.selectedCategory}
										handleCheckBox={this.handleCheckBox}
										updatePayments={this.updatePayments}
										handleAddExpense={this.handleAddExpense}
										handleDialog={this.handleDialog}
										handleDeleteExpense={this.handleDeleteExpense}
										handleChange={this.handleChange}
										handleChangeSelect={this.handleChangeSelect}
										open={this.state.isDialogOpen}
										selecteddigsMates={this.state.selecteddigsMates}
										confirmation={this.confirmation}
										expenseDeleted={this.state.expenseDeleted}
									/>
								)}
							/>
							<Route
								exact
								path="/about"
								render={props => <About {...props} />}
							/>
						</Switch>
					</TemplatePage>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
