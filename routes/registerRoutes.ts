import express, { Request, Response } from 'express'
import { client } from "../main";
import { hashPassword } from '../hash';


export const registerRoutes = express.Router();


registerRoutes.post('/',ownerRegister)



async function ownerRegister(req:Request, res:Response){
    console.log(req.body)
    const {firstName, lastName, email,password}  = req.body

    const result = await client.query(`SELECT email FROM owner`)
    const ownerEmailList = result.rows

    if (
		ownerEmailList.some(
			(owner) =>
				owner.email === req.body.email
		)
	) {
        res.status(401).json({success:false, message:"This email is being registered"})

    }else{

        const idResult = await client.query(`INSERT INTO owner (first_name,last_name,email,password,created_at,updated_at) 
                        VALUES ($1,$2,$3,$4, now(),now()) RETURNING id`,
                        [firstName,lastName,email,await hashPassword(password)]) 

        const ownerID = idResult.rows[0].id

        req.session.owner = req.body.email
        req.session.owner_id = ownerID

        res.status(200).json({success:true})

    }

    

}