import express, { Request, Response } from 'express'
import {Client} from 'pg';
import dotenv from 'dotenv';
import { bookingRoutes } from './routes/bookingRoutes';

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

app.use('/booking',bookingRoutes)



//Route Handlers
app.get('/', function (req: Request, res: Response) {
  res.end('Hello World')
})

app.use(express.static('public'))


//Port Listener
const PORT = 8080
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`)
})