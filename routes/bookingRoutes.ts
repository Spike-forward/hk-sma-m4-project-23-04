import express, { Request, Response } from 'express'
import {client} from '../main';
import moment from 'moment';


export const bookingRoutes  = express.Router();


bookingRoutes.get('/studio-info',getStudioInfo)
bookingRoutes.get('/studio-equipment',getStudioEquipment)
bookingRoutes.get('/studio-image',getStudioImage)
bookingRoutes.get('/studio-open-duration',getStudioOpenDuration)
bookingRoutes.get('/booked-date-time',getBookedDateTime)



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
    res.json(studioInfo)
}


async function getStudioOpenDuration(req:Request, res:Response){
    const studioID = parseInt(req.query.studio_id as string)
    const result = await client.query(`SELECT open_time,close_time FROM studio WHERE id = $1`,[studioID])
    const studioInfo = result.rows[0]
    result.rows[0].open_time = parseInt(result.rows[0].open_time.split(':')[0])
    result.rows[0].close_time = parseInt(result.rows[0].close_time.split(':')[0])
    res.json(studioInfo)
}


async function getBookedDateTime(req:Request, res:Response){
    const studioID = parseInt(req.query.studio_id as string)
    const result = await client.query(`SELECT booking_timeslot.start_time, booking_timeslot.end_time, booking_status.status, booking.date 
                                       FROM booking_timeslot
                                       left outer join booking_status 
                                       on booking_timeslot.booking_id = booking_status.booking_id
                                       left outer join booking on booking_timeslot.booking_id = booking.id
                                       WHERE booking.studio_id = $1 AND booking_status.status!=$2`,[studioID,"rejected"])


    const studioInfo = result.rows
  
    for(let info of studioInfo){
        info.start_time = info.start_time.split(':')[0]
        info.end_time = info.end_time.split(':')[0]
        info.date = moment(info.date).format("YYYY-MM-DD")
    }

    console.log(studioInfo)

    res.json(studioInfo)
}















