require('./passport');
import { P } from 'pino';
import db from '../firebase';

const routerController = {
	home: async (req, res) => {
		try {
			// Render the "home" template as HTML

			req.session.viewed = true;
			if (req.session.passport) {
				res.render('home', {
					user: req.session.passport.user,
				});
			} else {
				res.render('home');
			}
			console.log('home middleware working');
		} catch (err) {
			console.log(err);
		}
	},

	calendar: (req, res) => {
		try {
			// Render the "calendar" template as HTML
			res.render('calendar');
			console.log('calendar middleware working');
		} catch (err) {
			this.log.error(err);
		}
	},

	profile: (req, res) => {
		try {
			// Render the "profile" template as HTML
			res.render('profile', {
				user: req.session.passport.user,
				evaluations: req.session.evaluations,
			});
			console.log('profile middleware working');
		} catch (err) {
			this.log.error(err);
		}
	},

	login: (req, res) => {
		try {
			// Render the "login" template as HTML
			res.render('login');
			console.log('login middleware working');
		} catch (err) {
			this.log.error(err);
		}
	},

	admin: async (req, res) => {
		try {
			const usersRef = db.collection('users');
			const emails = [];
			await usersRef
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						// Extract the "name" field from each document
						emails.push({ email: doc.data().email });
					});
					// Do whatever you want with the names here
				})
				.catch((error) => {
					console.error('Error fetching documents: ', error);
				});
			// Render the "admin" template as HTML
			res.render('admin', {
				emails: emails,
			});
			console.log('admin middleware working');
		} catch (err) {
			console.log(err);
		}
	},

	teams: async (req, res, next) => {
		try {
			var teams = [];
			var temp = [];
			const UserRef = db.collection('users');
			const snapshot = await UserRef.where('team', '!=', null).get();
			if (snapshot.empty) {
				console.log('No matching documents.');
			}

			snapshot.forEach((doc) => {
				temp.push(doc.data().team);
				// need to compare teams within players to seperate players based on team
			});

			for (let i = 0; i < temp.length; i++) {
				if (temp[i] != temp[i - 1]) {
					teams.push(temp[i]);
				}
			}
			console.log(teams);
			// Render the "teamsViewer" template as HTML
			res.render('teamsViewer', {
				teams: temp,
				// players: teams,
			});
			console.log('teams viewer middleware working');
		} catch (err) {
			console.log(err);
		}
	},

	google: (req, res, next) => {
		console.log('Google route working');
		console.log('google middleware working');
		next();
	},

	gCallback: (req, res) => {
		// Successful authentication, redirect to profile.
		console.log('google callback middleware working');
		res.redirect('/');
	},

	googleCallback: (req, res) => {
		console.log(req.session.passport.user.username + ' : Signed in.');
	},

	// Route to create evaluation
	// Delete this route and handlebars template, using buttons and modals instead
	evaluation: (req, res, next) => {
		console.log('Evaluation route working');
		console.log(req.session.passport.user.username);
		res.render('evaluation');
	},

	pitchingEval: (req, res, next) => {
		try {
			const date = new Date();
			let day = date.getDate();
			let month = date.getMonth() + 1;
			let year = date.getFullYear();
			let currentDate = `${month}-${day}-${year}`;
			// Render the "calendar" template as HTML
			res.render('pitchingEval', {
				user: req.session.passport.user,
				currentDate: currentDate,
			});
			console.log('pitchingEval middleware working');
		} catch (err) {
			this.log.error(err);
		}
	},

	hittingEval: (req, res, next) => {
		try {
			const date = new Date();
			let day = date.getDate();
			let month = date.getMonth() + 1;
			let year = date.getFullYear();
			let currentDate = `${month}-${day}-${year}`;
			// Render the "calendar" template as HTML
			res.render('hittingEval', {
				user: req.session.passport.user,
				currentDate: currentDate,
			});
			console.log('hittingEval middleware working');
		} catch (err) {
			this.log.error(err);
		}
	},

	strengthEval: (req, res, next) => {
		try {
			const date = new Date();
			let day = date.getDate();
			let month = date.getMonth() + 1;
			let year = date.getFullYear();
			let currentDate = `${month}-${day}-${year}`;
			// Render the "calendar" template as HTML
			res.render('strengthEval', {
				user: req.session.passport.user,
				currentDate: currentDate,
			});
			console.log('strengthEval middleware working');
		} catch (err) {
			this.log.error(err);
		}
	},

	workout: (req, res, next) => {
		try {
			const date = new Date();
			let day = date.getDate();
			let month = date.getMonth() + 1;
			let year = date.getFullYear();
			let currentDate = `${month}-${day}-${year}`;
			// Render the "calendar" template as HTML
			res.render('workout', {
				user: req.session.passport.user,
				currentDate: currentDate,
			});
			console.log('workout middleware working');
		} catch (err) {
			this.log.error(err);
		}
	},
};

export default routerController;
