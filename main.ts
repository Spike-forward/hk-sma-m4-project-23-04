import express from 'express'
import expressSession from 'express-session'
import {Client} from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { isLoggedIn } from './guard';
import { bookingRoutes } from './routes/bookingRoutes';
import { ownerBookingRoutes } from './routes/ownerBookingRoutes';
import { ownerStudioRoutes } from './routes/ownerStudioRoutes';
import { loginRoutes } from './routes/loginRoutes';
import { registerRoutes } from './routes/registerRoutes';

const app = express()
app.use(express.urlencoded({ extended: true })) 
app.use(express.json()) 

//Make Connection to Database
dotenv.config();

export const client = new Client({
  database: process.env.DB_NAME, 
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
});

client.connect();

//set up session
app.use(
	expressSession({
		secret: 'wsp',
		resave: true,
		saveUninitialized: true
	})
)

//session interface
declare module 'express-session' {
	export interface SessionData {
		owner?: string
		owner_id?: number
	}
}

//Route Handlers
app.use(express.static('public'))
app.use('/booking',bookingRoutes)
app.use('/login',loginRoutes)
app.use('/register',registerRoutes)
app.use('/owner-booking', isLoggedIn, ownerBookingRoutes)
app.use('/owner-studio', isLoggedIn, ownerStudioRoutes)



app.use(isLoggedIn, express.static('protected'))


app.use((req, res) => {
	res.status(404).redirect('/404/404.html')
})
//sendFile -> redirect


//Port Listener
const PORT = 8080
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`)
})