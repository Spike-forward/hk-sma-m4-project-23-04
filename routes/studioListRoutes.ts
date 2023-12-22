import express, { Request, Response } from 'express'
import {client} from '../main';
import moment from 'moment';


export const studiosListRoutes  = express.Router();

//Routes: /studio-list/studio-info
studiosListRoutes.get('/studio-info',getStudioInfo)
studiosListRoutes.get('/studio-homepage-info',getHomepageStudioInfo)
studiosListRoutes.get('/date-time-filter',getDateTimeFiltered)


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
        studio.name NOT IN ($1) AND
        studio.district = $2
        ORDER BY RANDOM()`,['',district.replace("-"," ")])

    }


    const studioInfo = result.rows
    
  
    res.json(studioInfo)
}


async function getHomepageStudioInfo(req:Request, res:Response){
 
    const result = await client.query(`
    SELECT studio.icon,studio.name,studio.district,studio.address,studio.id,studio_photo.filename 
    FROM studio 
    left outer join studio_photo on studio.id = studio_photo.studio_id 
    WHERE studio_photo.cover_photo = true AND
    studio.name NOT IN ($1)
    ORDER BY RANDOM() limit 3`,[''])

    const studioInfo = result.rows
   
  
    res.json(studioInfo)
}

async function getDateTimeFiltered(req:Request, res:Response){

    const filterStartTimeQuery = req.query.startTime as string
    const filterEndTimeQuery = req.query.endTime as string

    const filterDate = req.query.date as string
    const filterStartTime = parseInt(filterStartTimeQuery.split(':')[0])
    const filterEndTime = parseInt(filterEndTimeQuery.split(':')[0])

    console.log(filterDate,filterStartTime,filterEndTime)

    const bookingResult = await client.query(`SELECT booking_timeslot.start_time, booking_timeslot.end_time, booking.date, booking.studio_id
    FROM booking_timeslot
    left outer join booking_status 
    on booking_timeslot.booking_id = booking_status.booking_id
    left outer join booking on booking_timeslot.booking_id = booking.id
    WHERE booking_status.status!=$1`,["rejected"])

    const bookingDetails = bookingResult.rows

    for(let info of  bookingDetails){
        info.start_time = parseInt(info.start_time.split(':')[0])
        info.end_time = parseInt(info.end_time.split(':')[0])
        info.date = moment(info.date).format("YYYY-MM-DD")
    }


    const studioOpenCloseTimeResult =  await client.query(`SELECT id as studio_id ,open_time,close_time FROM studio`)
    const studioOpenCloseTime = studioOpenCloseTimeResult.rows

    for(let info of studioOpenCloseTime ){
        info.open_time = parseInt(info.open_time.split(':')[0])
        info.close_time = parseInt(info.close_time.split(':')[0])
    }


    //Return an array that contains studio_id that the user filtered time is within the studio's open and close time
    const openingStudioList = studioOpenCloseTime.filter(studio=>
        studio["open_time"] <= filterStartTime && studio["close_time"] >= filterEndTime
    ).map(studio => studio.studio_id)


    let selectStartTime:number[] = []

    for(let i=filterStartTime;i<filterEndTime;i++){
        selectStartTime.push(i)
    }

    //Return an array that contains studio_id which the same date and times are being booked
    const unavailableBookingStudioList = bookingDetails.filter((booking)=>
           booking.date === filterDate && selectStartTime.includes(booking.start_time)
    ).map(booking => booking.studio_id) 


    console.log(openingStudioList)
    console.log(unavailableBookingStudioList)

    const availableStudioID = openingStudioList.filter(studio => !unavailableBookingStudioList.includes(studio))

    let availableStudioList = []

    for(let i of availableStudioID ){
        const availableStudioListResult = await client.query(`
        SELECT studio.icon,studio.name,studio.district,studio.address,studio.id,studio_photo.filename 
        FROM studio 
        left outer join studio_photo on studio.id = studio_photo.studio_id 
        WHERE studio_photo.cover_photo = true AND
        studio.id in ($1)
        ORDER BY RANDOM()`,[i])

        availableStudioList.push(availableStudioListResult.rows[0])
    }

    console.log(availableStudioList)
    
    res.json(availableStudioList)

    
}








