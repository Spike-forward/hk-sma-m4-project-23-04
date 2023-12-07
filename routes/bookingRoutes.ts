import express, { Request, Response } from 'express'
import {client} from '../main';


export const bookingRoutes  = express.Router();


bookingRoutes.get('/',getStudioInfo)

//CREATE ｜ READ ｜ UPDATE ｜ DELETE

//GET /booking/:id -> get yoga studio information 
async function getStudioInfo(req:Request, res:Response){
    const studioID = parseInt(req.query.studio_id as string)
    const result = await client.query(`SELECT icon,name,district,address FROM studio WHERE id = $1`,[studioID])
    const studioInfo = result.rows[0]
    console.log(studioInfo)
    res.json(studioInfo)
}
    //TODO: get the id from req.params.id
    //TODO: Find if the id exist in the database (xxx.find)
    //TODO: if exist, get the studio information from studio table
    //TODO: if exist, get studio photo by joining studio & studio_photo tables
    //TODO: 


//POST -

//PUT

//DELETE