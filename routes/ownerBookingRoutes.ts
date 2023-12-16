import express, { Request, Response } from 'express'
import {client} from '../main';
import moment from 'moment';

export const ownerBookingRoutes  = express.Router();

ownerBookingRoutes.get('/owner-name', getOwnerName)
ownerBookingRoutes.get('/studio-icon', getStudioIcon)

ownerBookingRoutes.get('/requests', getRequests)
ownerBookingRoutes.put('/update-status/:id', updateReqStatus)

ownerBookingRoutes.get('/logout', async(req, res)=>{
	if (req.session) {
		delete req.session['owner'];
        delete req.session['owner_id'];
	  }
	res.redirect('/index.html')
})

async function getOwnerName(req: Request, res: Response){
    const email = req.session.owner
    //console.log(email)
    const request = await client.query('SELECT owner.first_name, owner.last_name FROM owner WHERE email = $1', [email])
    const result = request.rows[0]
    res.json(result)
}

async function getStudioIcon(req: Request, res: Response){
    const email = req.session.owner
    const studioID = (await client.query('SELECT studio.id FROM owner INNER JOIN studio ON owner.id = studio.owner_id WHERE email = $1', [email])).rows[0].id
    const request = await client.query('SELECT studio.icon FROM studio where studio.id = $1', [studioID])
    const result = request.rows[0]
    res.json(result)
}

async function getRequests (req: Request, res: Response){
    const email = req.session.owner
    const studioID = (await client.query('SELECT studio.id FROM owner INNER JOIN studio ON owner.id = studio.owner_id WHERE email = $1', [email])).rows[0].id
    const requests = await client.query(`
        SELECT booking.id, booking.name, booking.date, booking.contact_no, booking_status.status, booking_status.updated_at, booking_timeslot.start_time, booking_timeslot.end_time, booking.remarks FROM booking_status 
            INNER JOIN booking ON booking_status.booking_id = booking.id 
            INNER JOIN booking_timeslot ON booking.id = booking_timeslot.booking_id 
            WHERE booking.studio_id = $1`
            , [studioID])
    const result = requests.rows // timeslot unresolved: same request with multiple timeslots can be queried here
    //console.log(result)
    for (let period of result){
        period.date = moment(period.date).format("YYYY-MM-DD")
        period.start_time = period.start_time.split(':')[0]+"00"
        period.end_time = period.end_time.split(':')[0]+"00"
    }
    res.json(result)
}

async function updateReqStatus (req: Request, res: Response){
    const requestID = parseInt(req.params.id)
	console.log(req.body)
	const updateStatus = req.body.status
    await client.query('update booking_status set status = $1 where booking_id = $2', [updateStatus, requestID])

    // if (updateStatus === 'waiting for payment') {     //condition for different status
    //     await client.query('update booking_status set status = $1 where booking_id = $2', [updateStatus, requestID])
    // } 
    // else if (updateStatus === 'approved'){
    //     await client.query('update booking_status set status = $1 where booking_id = $2', [updateStatus, requestID])
    // }
    // else if (updateStatus === 'rejected'){
    //     await client.query('update booking_status set status = $1 where booking_id = $2', [updateStatus, requestID])
    // }
    res.json({msg: 'request status updated!'})
}

