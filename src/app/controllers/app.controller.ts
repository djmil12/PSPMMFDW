import { Request, Response, Router, request } from 'express';
import { pino } from 'pino';
import passport from 'passport';
import controller from './router.controller';
import middleware from '../middleware/middleware';
import profileMiddleware from '../middleware/profile.middleware'

require('./passport');

export class AppController {
	public router: Router = Router();
	private log: pino.Logger = pino();

	constructor() {
		this.initializeRouter();
	}

	private initializeRouter() {
		this.router.use(passport.initialize());
		this.router.use(passport.session());
		this.router.use(middleware.flashMessages);

		// Serve the home page
		this.router.get('/', controller.home);

		// Serve the calendar page
		this.router.get('/calendar', controller.calendar);

		// Serve the profile page
		this.router.get('/profile', middleware.loginCheck, profileMiddleware.evalGetter, controller.profile);

		// auth login
		this.router.get('/login', controller.login);

		// auth logout
		this.router.get('/logout', middleware.loginCheck, controller.home);

		this.router.get(
			'/google',
			controller.google,
			passport.authenticate('google', {
				scope: ['email', 'profile', 'openid'],
			})
		);

		this.router.get(
			'/google/callback',
			passport.authenticate('google', { failureRedirect: '/login' }),
			controller.gCallback
		);

		this.router.post(
			'/google/callback',
			passport.authenticate('google', { failureRedirect: '/login' }),
			controller.googleCallback
		);

		// Evaluation route
		this.router.get( '/evaluation',
			middleware.loginCheck,
		 )
	}
}
