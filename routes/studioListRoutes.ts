import express, { Request, Response } from 'express'
import {client} from '../main';
import moment from 'moment';


export const studiosListRoutes  = express.Router();

//Routes: /studio-list/studio-info
studiosListRoutes.get('/studio-info',getStudioInfo)
studiosListRoutes.get('/studio-homepage-info',getHomepageStudioInfo)
studiosListRoutes.get('/date-time-filter',getDateTimeFiltered)


async function getStudioInfo(req:Request, res:Response){
    
    try{
        const filterDate = req.query.date as string
        const filterStartTimeQuery = req.query.startTime as string
        const filterEndTimeQuery = req.query.endTime as string

        console.log(filterDate,filterStartTimeQuery)

        //Ready to use query string parameter
        let district = req.query.district as string;
       console.log(district)
        let sql= `
        SELECT studio.icon,studio.name,studio.district,studio.address,studio.id,studio_photo.filename 
        FROM studio 
        left outer join studio_photo on studio.id = studio_photo.studio_id 
        WHERE studio_photo.cover_photo = true AND
        studio.name NOT IN ($1)`
        console.log(sql)

        let params:any[] = ['']

        if (district !== "null") {
            const pattern = /-/g
            district = district.replace(pattern," ")
            params.push(district)
            sql += ` AND studio.district = $${params.length}`;
        }

        //studio.id = ANY($1)
        if(filterDate !=="null" && filterStartTimeQuery !=="null" && filterEndTimeQuery !=="null"){
            const filterStartTime = parseInt(filterStartTimeQuery.split(':')[0])
            const filterEndTime = parseInt(filterEndTimeQuery.split(':')[0]) 
            const availableStudioID = await findStudioBasedOnDateTime(filterDate,filterStartTime,filterEndTime)
            params.push(availableStudioID)
            sql += ` AND studio.id = ANY($${params.length})`;
        }

        sql += ` ORDER BY RANDOM()`
        console.log(params)
        console.log(sql)

        let result = await client.query(sql,params)


        const studioInfo = result.rows
        res.json(studioInfo)

    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' })
    }
    

    
}



// async function getStudioInfo(req:Request, res:Response){
    
//     const district = req.query.district as string;

//     let result;
    
//     if(!district){
//         result = await client.query(`
//         SELECT studio.icon,studio.name,studio.district,studio.address,studio.id,studio_photo.filename 
//         FROM studio 
//         left outer join studio_photo on studio.id = studio_photo.studio_id 
//         WHERE studio_photo.cover_photo = true AND
//         studio.name NOT IN ($1)
//         ORDER BY RANDOM()`,[''])

//     }else{

//         result = await client.query(`
//         SELECT studio.icon,studio.name,studio.district,studio.address,studio.id,studio_photo.filename 
//         FROM studio 
//         left outer join studio_photo on studio.id = studio_photo.studio_id 
//         WHERE studio_photo.cover_photo = true AND
//         studio.name NOT IN ($1) AND
//         studio.district = $2
//         ORDER BY RANDOM()`,['',district.replace("-"," ")])

//     }


//     const studioInfo = result.rows
    
  
//     res.json(studioInfo)
// }


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

    const availableStudioID = await findStudioBasedOnDateTime(filterDate,filterStartTime,filterEndTime)
    

    // Return the available studio information based on availableStudioID array
    const availableStudioListResult = await client.query(`
        SELECT studio.icon,studio.name,studio.district,studio.address,studio.id,studio_photo.filename 
        FROM studio 
        left outer join studio_photo on studio.id = studio_photo.studio_id 
        WHERE studio_photo.cover_photo = true AND
        studio.id = ANY($1)
        ORDER BY RANDOM()`,[availableStudioID])

    const availableStudioList = availableStudioListResult.rows
    res.json(availableStudioList)

    
}

async function findStudioBasedOnDateTime(filterDate: any,filterStartTime: number,filterEndTime: number){
        //Return all studio info with its booked timeslot and date
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
    
        //Return all studio open and close time
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
    
    
        //Return available studio id, the filtered time is within studio open and close time and not being booked at that date and time
        const availableStudioID = openingStudioList.filter(studio => !unavailableBookingStudioList.includes(studio))
        
        return  availableStudioID
}











