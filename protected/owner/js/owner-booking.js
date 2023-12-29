window.onload = loadPage()

async function loadPage() {
    //Fetch From API
    const studioIconRes = await fetch('/owner-booking/studio-icon')
    const ownerNameRes = await fetch('/owner-booking/owner-name')
    const studioInfoRes = await fetch('/owner-studio/studio-info')
    const studioRequestsRes = await fetch('/owner-booking/requests')

    //Data get from API
    const studioIcon = await studioIconRes.json()
    const ownerName = await ownerNameRes.json()
    const studioInfo = await studioInfoRes.json()
    const studioRequests = await studioRequestsRes.json()

    //DOM DIV
    const studioIconDiv = document.querySelector('#owner-icon')
    const ownerNameDiv = document.querySelector('.hello')
    const newBookingDiv = document.querySelector(".new-booking")
    const serverMsg = document.querySelector(".server-msg")
    const studioPendingReq = document.querySelector('#pending-tab-pane')
    const studioPaymentReq = document.querySelector('#payment-tab-pane')
    const studioApprovedReq = document.querySelector('#approved-tab-pane')
    const studioRejectedReq = document.querySelector('#rejected-tab-pane')
    

    //Display Content
        //Owner Profile
    studioIconDiv.innerHTML = `<img src="../uploads/studio_icon/${studioIcon.icon}" alt="owner's icon">`
    ownerNameDiv.innerHTML = `<h2>Welcome, ${ownerName.first_name} ${ownerName.last_name}!</h2>`
    let pendingReqNo = 0;
    for (let request of studioRequests){
        if (request.status === "pending"){
            pendingReqNo++;
        }
    }
    if (pendingReqNo == 0){
        newBookingDiv.innerHTML = `
        No new bookings recently
        `
        newBookingDiv.classList.add("no-booking")
    } else if (pendingReqNo == 1){
        newBookingDiv.innerHTML = `
        There is 1 new booking pending recently`
        
    } else {
        newBookingDiv.innerHTML = `
        There are ${pendingReqNo} new bookings pending recently`
    }
    if (studioInfo.name === '' || studioInfo.address === '' || studioInfo.contact_no === '' || studioInfo.price === '' || studioInfo.photos.length === 0){
        serverMsg.innerHTML = `Missing studio information!`
        serverMsg.classList.add('warning')
    } else if (!studioInfo.photos.some((photo) => photo.cover_photo === true)){
        serverMsg.innerHTML = `Missing studio cover photo!`
        serverMsg.classList.add('warning')
    }

        //Booking Requests
    studioPendingReq.innerHTML = ``
    studioPaymentReq.innerHTML = ``
    studioApprovedReq.innerHTML = ``
    studioRejectedReq.innerHTML = ``
    for (let request of studioRequests){
        if (request.status === 'pending'){
            studioPendingReq.innerHTML += 
            `<div class="request id-${request.id}">
                <div class="info">
                    <div class="brief row">
                        <h6 class="col-md-3">Name: ${request.name}</h6>
                        <h6 class="col-md-3">Date: ${request.date}</h6>
                        <h6 class="periods col-md-3">Periods: </br></h6>
                        <h6 class="col-md-3">Contact No.: ${request.contact_no}</h6>
                    </div>
                    <div class="detail">
                        <p>Remarks: ${request.remarks}</p>
                    </div>
                </div>
                <div class="action">
                    <button type="button" class="btn btn-success pendingAccept">Accept</button>
                    <button type="button" class="btn btn-danger pendingReject">Reject</button>
                </div>
            </div>`
            for (let i=0; i<request.start_time.length; i++){
                studioPendingReq.querySelector(`.id-${request.id} .periods`).innerHTML += 
                `${request.start_time[i]}-${request.end_time[i]} </br>`
            }
        }
        else if (request.status === 'waiting for payment'){
            studioPaymentReq.innerHTML += 
            `<div class="request id-${request.id}">
                <div class="info">
                    <div class="brief row">
                        <h6 class="col-md-2">Name: ${request.name}</h6>
                        <h6 class="col-md-2">Date: ${request.date}</h6>
                        <h6 class="periods col-md-2">Periods: </br></h6>
                        <h6 class="col-md-2">Contact No.: ${request.contact_no}</h6>
                        <h6 class="col-md-3">Accepted at: 06-12-2023</h6>
                    </div>
                    <div class="detail">
                        <p>Remarks: ${request.remarks}</p>
                    </div>
                </div>
                <div class="action">
                    <button type="button" class="btn btn-primary paymentConfirm">Payment Confirmed</button>
                    <button type="button" class="btn btn-danger paymentReject">Rejected</button>
                </div>
            </div>`
            for (let i=0; i<request.start_time.length; i++){
                studioPaymentReq.querySelector(`.id-${request.id} .periods`).innerHTML += 
                `${request.start_time[i]}-${request.end_time[i]} </br>`
            }
        }
        else if (request.status === 'approved'){
            studioApprovedReq.innerHTML += 
            `<div class="request id-${request.id}">
                <div class="info">
                    <div class="brief row">
                        <h6 class="col-md-2">Name: ${request.name}</h6>
                        <h6 class="col-md-2">Date: ${request.date}</h6>
                        <h6 class="periods col-md-2">Periods: </br></h6>
                        <h6 class="col-md-2">Contact No.: ${request.contact_no}</h6>
                        <h6 class="col-md-3">Approved at: 06-12-2023</h6>
                    </div>
                    <div class="detail">
                        <p>Remarks: ${request.remarks}</p>
                    </div>
                </div>
            </div>`
            for (let i=0; i<request.start_time.length; i++){
                studioApprovedReq.querySelector(`.id-${request.id} .periods`).innerHTML += 
                `${request.start_time[i]}-${request.end_time[i]} </br>`
            }
        }
        else if (request.status === 'rejected'){
            studioRejectedReq.innerHTML += 
            `<div class="request id-${request.id}">
                <div class="info">
                    <div class="brief row">
                        <h6 class="col-md-2">Name: ${request.name}</h6>
                        <h6 class="col-md-2">Date: ${request.date}</h6>
                        <h6 class="periods col-md-2">Periods: </br></h6>
                        <h6 class="col-md-2">Contact No.: ${request.contact_no}</h6>
                        <h6 class="col-md-3">Rejected at: 06-12-2023</h6>
                    </div>
                    <div class="detail">
                        <p>Remarks: ${request.remarks}</p>
                    </div>
                </div>
            </div>`
            for (let i=0; i<request.start_time.length; i++){
                studioRejectedReq.querySelector(`.id-${request.id} .periods`).innerHTML += 
                `${request.start_time[i]}-${request.end_time[i]} </br>`
            }
        }
    }

        //Buttons for update booking status
    const pendingReqAccept = document.querySelectorAll('.pendingAccept')
    const pendingReqReject = document.querySelectorAll('.pendingReject')
    const paymentReqConfirm = document.querySelectorAll('.paymentConfirm')
    const paymentReqReject = document.querySelectorAll('.paymentReject')
    //const serverMsg = document.querySelector(".server-msg")
    
    pendingReqAccept.forEach((req, index)=>{
        const ReqID = document.querySelectorAll('.request:has(.pendingAccept)')[index].classList[1].slice(3)
        req.addEventListener('click', async (event)=>{
            
            const res = await fetch(`/owner-booking/update-status/${ReqID}`, {
                method: 'PUT',
                headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status: 'waiting for payment' })
            })
            serverMsg.innerHTML = `Request updated!`
            loadPage();
        })
    })
    pendingReqReject.forEach((req, index)=>{
        const ReqID = document.querySelectorAll('.request:has(.pendingReject)')[index].classList[1].slice(3)
        req.addEventListener('click', async (event)=>{
            
            const res = await fetch(`/owner-booking/update-status/${ReqID}`, {
                method: 'PUT',
                headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status: 'rejected' })
            })
            serverMsg.innerHTML = `Request updated!`
            loadPage();
        })
    })
    paymentReqConfirm.forEach((req, index)=>{
        const ReqID = document.querySelectorAll('.request:has(.paymentConfirm)')[index].classList[1].slice(3)
        req.addEventListener('click', async (event)=>{
            const res = await fetch(`/owner-booking/update-status/${ReqID}`, {

                method: 'PUT',
                headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status: 'approved' })
            })
            serverMsg.innerHTML = `Request updated!`
            loadPage();
        })
    })
    paymentReqReject.forEach((req, index)=>{
        const ReqID = document.querySelectorAll('.request:has(.paymentConfirm)')[index].classList[1].slice(3)
        req.addEventListener('click', async (event)=>{
            const res = await fetch(`/owner-booking/update-status/${ReqID}`, {

                method: 'PUT',
                headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status: 'rejected' })
            })
            serverMsg.innerHTML = `Request updated!`
            loadPage();
        })
    })
}