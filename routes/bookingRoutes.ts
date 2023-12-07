import express, { Request, Response } from 'express'
import {client} from '../main';


export const bookingRoutes  = express.Router();


bookingRoutes.get('/studio-info',getStudioInfo)
bookingRoutes.get('/studio-equipment',getStudioEquipment)
bookingRoutes.get('/studio-image',getStudioImage)


async function getStudioInfo(req:Request, res:Response){
    const studioID = parseInt(req.query.studio_id as string)
    const result = await client.query(`SELECT icon,name,district,address,description,price FROM studio WHERE id = $1`,[studioID])
    const studioInfo = result.rows[0]
    res.json(studioInfo)
}

async function getStudioEquipment(req:Request, res:Response){
    const studioID = parseInt(req.query.studio_id as string)
    const result = await client.query(`SELECT s.studio_id, s.equipment_id, e.items FROM studio_equipment s
                                       left outer join equipment e on s.equipment_id = e.id
                                       WHERE s.studio_id = $1`,[studioID])
    const studioInfo = result.rows
    res.json(studioInfo)
}

async function getStudioImage(req:Request, res:Response){
    const studioID = parseInt(req.query.studio_id as string)
    const result = await client.query(`SELECT filename,cover_photo,studio_id FROM studio_photo WHERE studio_id = $1`,[studioID])
    const studioInfo = result.rows
    console.log(studioInfo)
    res.json(studioInfo)
}












