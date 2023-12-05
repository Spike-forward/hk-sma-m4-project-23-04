import express, { Request, Response } from 'express'


const app = express()
app.use(express.urlencoded({ extended: true })) //optional
app.use(express.json()) //optional

//Route Handlers
app.get('/', function (req: Request, res: Response) {
  res.end('Hello World')
})


//Port Listener
const PORT = 8080
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`)
})