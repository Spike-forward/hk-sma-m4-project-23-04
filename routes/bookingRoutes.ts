import express, { Request, Response } from 'express'
import {client} from '../main';
import moment from 'moment';


export const bookingRoutes  = express.Router();


bookingRoutes.get('/studio-id',checkValidStudioID)
bookingRoutes.get('/studio-info',getStudioInfo)
bookingRoutes.get('/studio-equipment',getStudioEquipment)
bookingRoutes.get('/studio-image',getStudioImage)
bookingRoutes.get('/studio-open-duration',getStudioOpenDuration)
bookingRoutes.get('/booked-date-time',getBookedDateTime)
bookingRoutes.post('/',postBooking)
bookingRoutes.post('/booking-info',postBookingInfo)

async function checkValidStudioID(req:Request, res:Response){
    const studioID = parseInt(req.query.studio_id as string)
    const studioIDRes = await client.query(`SELECT id, name FROM studio WHERE name NOT IN ($1) `,[''])
   
    if(studioIDRes.rows.some((studio)=> studio.id === studioID)){
        res.json({success:"Studio ID exists in database"})
    }else{
        res.json({error:"Studio ID is not valid."})
    }
}


async function getStudioInfo(req:Request, res:Response){
    const studioID = parseInt(req.query.studio_id as string)
    const studioIDRes = await client.query(`SELECT id FROM studio`)
   
    if(studioIDRes.rows.some((studio)=> studio.id === studioID)){
        const result = await client.query(`SELECT icon,name,district,address,description,price,contact_no FROM studio WHERE id = $1`,[studioID])
        const studioInfo = result.rows[0]
        console.log(studioInfo)
        res.json(studioInfo)
    }else{
        res.json({error:"Studio ID is not valid."})
    }

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

    res.json(studioInfo)
}

async function postBooking(req:Request, res:Response){
    const { studioID, date, time, name, contact,remarks } = req.body
    console.log(studioID, date, time, name, contact,remarks)
    const bookingResult = await client.query(`INSERT INTO booking (name,date,contact_no,remarks,studio_id,created_at,updated_at) 
                        VALUES ($1,$2,$3,$4,$5,now(),now()) RETURNING id, reference_no`,[name,date,contact,remarks,studioID])

    const bookingID = bookingResult.rows[0].id
    const bookingReferenceNo = bookingResult.rows[0].reference_no
    console.log(bookingReferenceNo)

    for(let t of time ){
        console.log(time)
        await client.query(`INSERT INTO booking_timeslot (start_time,end_time,booking_id) 
                        VALUES ($1,$2,$3)`,[t.start_time,t.end_time,bookingID])
    }

    await client.query(`INSERT INTO booking_status (status,booking_id,created_at,updated_at) 
                        VALUES ($1,$2,now(),now())`,["pending",bookingID])


    res.json({message:"success",referenceNo:bookingReferenceNo})
}




async function postBookingInfo(req:Request, res:Response){
    
    
    const bookingListRes = await client.query(`SELECT contact_no as contact, reference_no as reference FROM booking`)
    const bookingList = bookingListRes.rows


    if(bookingList.some(((booking: { contact: any; reference: any; }) => booking.contact === req.body.whatsappNo && booking.reference === req.body.bookingNo))){
    
        const bookingInfoRes = await client.query(`SELECT booking_status.status, 
                                                   booking.date, booking.remarks, booking.reference_no,
                                                   studio.name, studio.contact_no, studio.address, studio.id as studio_id
                                                   FROM booking
                                                   left outer join booking_status on booking.id = booking_status.booking_id
                                                   left outer join studio on booking.studio_id = studio.id
                                                   WHERE booking.contact_no = $1 AND booking.reference_no = $2`, [req.body.whatsappNo,req.body.bookingNo])

        const bookingDateTimeRes = await client.query(`SELECT booking_timeslot.start_time, booking_timeslot.end_time
                                                       FROM booking_timeslot
                                                       left outer join booking on booking_timeslot.booking_id = booking.id
                                                       WHERE booking.contact_no = $1 AND booking.reference_no = $2`, [req.body.whatsappNo,req.body.bookingNo])
        const bookingInfo = bookingInfoRes.rows[0]
        const bookingDateTime = bookingDateTimeRes.rows

        bookingInfo.date = moment(bookingInfo.date).format("YYYY-MM-DD")

        if(bookingInfo.remarks === "" || "null"){
            bookingInfo.remarks = "No Remarks"
        }


        res.json({success:true,"bookingInfo":bookingInfo,"bookingDateTime": bookingDateTime })

    }else{
        res.json({success:false, message:"Invalid Whatsapp or Booking Reference Number"})
    }

    
    

}

















