import express, { Request, Response } from 'express'
import { client } from "../main";
import { Owner } from "../models";
import { checkPassword } from '../hash';

export const loginRoutes = express.Router();


loginRoutes.post('/',ownerLogin)

async function ownerLogin(req:Request, res:Response){

    console.log(req.body)

	const result = await client.query(`SELECT email, password FROM owner where email = $1`, [req.body.email])
    
	const [owner]: Owner[] = result.rows

	const matched = await checkPassword(req.body.password, owner.password)
   
	if (matched) {
		console.log('login success')
		req.session.owner = req.body.email
        
        //Get owner's id from owner table and put in session cookie
        const ownerIDResult = await client.query(`SELECT id FROM owner WHERE email = $1`,[req.body.email])
        const ownerID = ownerIDResult.rows[0].id
        req.session.owner_id = ownerID

        //res.redirect('/admin.html')
        
        res.status(200).json({message:"success"})
	}else{
        // res.redirect('/login/login.html?error=login-failed')
        res.status(401).json({message:"error"})
    }

}


