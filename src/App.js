import { useState } from 'react';
import './index.css';

const APIURL = 'https://64037e4d80d9c5c7bab5ad0e.mockapi.io/users';
let users = [];

// GET all user/password data from API
function getAllUsers() {
	fetch(APIURL, {
		method: 'GET',
		headers: { 'content-type': 'application/json' },
	})
		.then(res => {
			if (res.ok) {
				return res.json();
			}
			// handle error
		})
		.then(data => {
			// Do something with the data
			users = data;
		})
		.catch(error => {
			// handle error
			console.log(`Error GETting API data: ${error}`);
		});
}
getAllUsers();

//COMPONENT - App
function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState('israel');

	return (
		<div className="App">
			{!loggedIn ? (
				<Login setLoggedIn={setLoggedIn} />
			) : (
				<Countries selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
			)}
		</div>
	);
}

//COMPONENT - Login
function Login({ setLoggedIn }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [waitCover, setWaitCover] = useState('hidden');

	function handleLogIn(event) {
		event.preventDefault();

		// Check entered username against array of registered users
		const existingUser = users.some(user => user.username === username); // Returns Boolean

		if (existingUser) {
			const correctPW = users.find(user => user.username === username).password; // Returns correct pw
			if (password === correctPW) {
				// successful log in
				setLoggedIn('true');
			} else {
				// Log in Fail - good username, bad pw
				console.log('correct username, incorrect password');
				unsuccessfulLogIn();
			}
		} else {
			// Log in Fail - bad username
			console.log('incorrect username');
			unsuccessfulLogIn();
		}

		// Function for an unsuccessful log in attempt
		function unsuccessfulLogIn() {
			setPassword('');
		}
	}

	let newUser = { username: username, password: password };
	async function handleSignUp(event) {
		event.preventDefault();

		setWaitCover('');

		console.log(`POST to API attempted`);
		console.log(newUser);

		fetch(APIURL, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(newUser),
		})
			.then(res => {
				if (res.ok) {
					return res.json();
				}
				// handle error
				console.log('There was an error POSTing to the API');
			})
			.then(task => {
				// do something with the new task
				setUsername('');
				setPassword('');
				setWaitCover('hidden');
				setLoggedIn(true);
				console.log(`Successful POST of id# ${task.id}`);
			})
			.catch(error => {
				// handle error
				console.log(`Error: ${error}`);
			});
	}

	return (
		<form className="inner-window">
			<h1>Go Travel!</h1>

			<div className="input">
				<label>User name:</label>
				<input
					id="username"
					type="text"
					value={username}
					onChange={event => setUsername(event.target.value)}
					required
				/>
			</div>

			<div className="input">
				<label>Password:</label>
				<input
					id="password"
					type="password"
					value={password}
					onChange={event => setPassword(event.target.value)}
					required
				/>
			</div>

			<button onClick={handleLogIn}>
				<h3>Log in</h3>
			</button>
			<button onClick={handleSignUp}>
				<h3>Sign up</h3>
			</button>
			<div id="wait-cover" className={waitCover}>
				<h3>please wait...</h3>
			</div>
		</form>
	);
}

//COMPONENT - Countries
function Countries({ selectedCountry, setSelectedCountry }) {
	const countryList = [
		{
			name: 'israel',
			emoji: '🇮🇱',
		},
		{
			name: 'egypt',
			emoji: '🇪🇬',
		},
		{
			name: 'jordan',
			emoji: '🇯🇴',
		},
		{
			name: 'brazil',
			emoji: '🇧🇷',
		},
		{
			name: 'switzerland',
			emoji: '🇨🇭',
		},
	];

	return (
		<div id="countries">
			<div id="image-container">
				<img id="country-image" src={require(`./images/${selectedCountry}.jpeg`)} alt="" />
				<h1 id="country-title">
					{selectedCountry.charAt(0).toUpperCase() + selectedCountry.slice(1)}
				</h1>
			</div>

			<div id="navbar">
				<h1>Go Travel!</h1>
				<div className="button-group">
					{countryList.map(country => (
						<span
							key={country.name}
							className="country-button"
							onClick={() => setSelectedCountry(country.name)}
						>
							{country.emoji}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
