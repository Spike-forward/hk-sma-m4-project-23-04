import express, { Request, Response } from 'express'
import {client} from '../main';

export const ownerStudioRoutes  = express.Router();

ownerStudioRoutes.get('/owner-name', getOwnerName)
ownerStudioRoutes.get('/studio-icon', getStudioIcon)
ownerStudioRoutes.get('/studio-info', getStudioInfo)

async function getOwnerName(req: Request, res: Response){
    const email = 'brian.chan@gmail.com'
    const request = await client.query('SELECT owner.first_name, owner.last_name FROM owner WHERE email = $1', [email])
    const result = request.rows[0]
    res.json(result)
}

async function getStudioIcon(req: Request, res: Response){
    const email = 'brian.chan@gmail.com'
    const studioID = (await client.query('SELECT studio.id FROM owner INNER JOIN studio ON owner.id = studio.owner_id WHERE email = $1', [email])).rows[0].id
    const request = await client.query('SELECT studio.icon FROM studio where studio.id = $1', [studioID])
    const result = request.rows[0]
    res.json(result)
}

async function getStudioInfo(req: Request, res: Response){
    const email = 'brian.chan@gmail.com'
    const studioID = (await client.query('SELECT studio.id FROM owner INNER JOIN studio ON owner.id = studio.owner_id WHERE email = $1', [email])).rows[0].id
    const request_info = await client.query('SELECT * FROM studio WHERE id = $1', [studioID])
    const request_equip = await client.query('SELECT equipment.items FROM studio INNER JOIN studio_equipment ON studio.id = studio_equipment.studio_id INNER JOIN equipment ON studio_equipment.equipment_id = equipment.id WHERE studio_id = $1', [studioID])
    const request_photo = await client.query('SELECT * from studio_photo where studio_id = $1', [studioID])

    const equipment = []
    for (let item of request_equip.rows){
        equipment.push(item.items)
    }
    const photos = []
    for (let photo of request_photo.rows){
        photos.push({"filename": photo.filename, "cover_photo": photo.cover_photo})
    }
    //console.log(request2_merged)
    request_info.rows[0].equipment = equipment
    request_info.rows[0].photos = photos

    const result = request_info.rows[0]
    res.json(result)
}

