import express, { Request, Response } from 'express'
import {client} from '../main';


export const studiosListRoutes  = express.Router();

//Routes: /studio-list/studio-info
studiosListRoutes.get('/studio-info',getStudioInfo)
studiosListRoutes.get('/studio-homepage-info',getHomepageStudioInfo)

async function getStudioInfo(req:Request, res:Response){
    
    const district = req.query.district as string;

    let result;
    
    if(!district){
        result = await client.query(`
        SELECT studio.icon,studio.name,studio.district,studio.address,studio.id,studio_photo.filename 
        FROM studio 
        left outer join studio_photo on studio.id = studio_photo.studio_id 
        WHERE studio_photo.cover_photo = true AND
        studio.name NOT IN ($1)
        ORDER BY RANDOM()`,[''])

    }else{

        result = await client.query(`
        SELECT studio.icon,studio.name,studio.district,studio.address,studio.id,studio_photo.filename 
        FROM studio 
        left outer join studio_photo on studio.id = studio_photo.studio_id 
        WHERE studio_photo.cover_photo = true AND
        studio.name NOT IN ($1)
        studio.district = $2
        ORDER BY RANDOM()`,['',district.replace("-"," ")])

    }

    const studioInfo = result.rows
    console.log(studioInfo)
  
    res.json(studioInfo)
}


async function getHomepageStudioInfo(req:Request, res:Response){
    
    const district = req.query.district as string;

 
    const result = await client.query(`
    SELECT studio.icon,studio.name,studio.district,studio.address,studio.id,studio_photo.filename 
    FROM studio 
    left outer join studio_photo on studio.id = studio_photo.studio_id 
    WHERE studio_photo.cover_photo = true AND
    studio.name NOT IN ($1)
    ORDER BY RANDOM() limit 3`,[''])

    const studioInfo = result.rows
    console.log(studioInfo)
  
    res.json(studioInfo)
}








