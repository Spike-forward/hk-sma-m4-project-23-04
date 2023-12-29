import {loadDateTimeFilter, filterMobileListener} from './all-studios/all-studios.js'

window.onload = async () => {

  loadDateTimeFilter();
  filterMobileListener();

  //Fetch From API

  let studioInfoRes = await fetch("/studio-list/studio-homepage-info")


  //Data get from API
  const studioInfo = await studioInfoRes.json()
 

  const studioRowDiv = document.querySelector('.studio-row')

    for(let studio of studioInfo){
        studioRowDiv.innerHTML += ` <div class="col-lg-4 col-md-12">
        <a href="/booking/booking.html?studio_id=${studio.id}">
          <div class="studio-card">
            <div class="cover-photo">
              <img src="/uploads/studio_photo/${studio.filename}" alt="">
            </div>
    
            <div class="icon">
              <img src="/uploads/studio_icon/${studio.icon}" alt="">
            </div>
    
            <div class="studio-info">
              <p class="name">Name: <span>${studio.name}</span></p>
              <p class="district">District: <span>${studio.district}</span></p>
              <p class="address">Address: <span>${studio.address}</span></p>
            </div>
          </div>
          </a>
    
      </div>`
    }


    let districtFilter = document.querySelector("#district-filter")
    let dateTimeFilter = document.querySelector("#date-time-filter")
    
   
    districtFilter.addEventListener("submit", async function(event){
        
         const form = event.target

         window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`);
         studioInfoRes = await fetch(`/studio-list/studio-info?district=${form.district.value}`)
         
     })
 
    dateTimeFilter.addEventListener("submit", async function(event){
         const form = event.target
         const filterErrorDiv = document.querySelector("#date-time-filter .error")
 
         //Return error when user selects an endTime that is earlier than the startTime
         if(form.endTime.value <= form.startTime.value){
           event.preventDefault();
           filterErrorDiv.classList.add('active')
           return filterErrorDiv.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> Please select an end time that is later than the start time`;
         }else{
          filterErrorDiv.classList.remove('active')
          filterErrorDiv.innerHTML = ""
         }

         searchParams.set('date',form.date.value);
         searchParams.set('startTime', form.startTime.value);
         searchParams.set('endTime',form.endTime.value);
         window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`);
         studioInfoRes = await fetch(`/studio-list/studio-info?date=${form.date.value}&startTime=${form.startTime.value}&endTime=${form.endTime.value}`)
    })

    const bookingFormErrorDiv = document.querySelectorAll("#booking-record-form .error")
    const coverDiv = document.querySelector(".cover")
    const bookingInfoDiv = document.querySelector(".booking-info")
    const bookingNumberDiv = document.querySelector(".booking-number")
    const bookedStudioURLDiv = document.querySelector(".booked-studio-url")
    const bookedStudioNameDiv = document.querySelector(".booked-studio-name")
    const bookedStudioAddressDiv = document.querySelector(".booked-studio-address")
    const bookedStudioContactDiv = document.querySelector(".booked-studio-contact")
    const bookedDateDiv = document.querySelector(".booked-date")
    const bookedTimeDiv = document.querySelector(".booked-time")
    const userRemarksDiv = document.querySelector(".user-remarks")
    const currentStatusDiv = document.querySelector(".current-status")


    document
    .querySelector("#booking-record-form")
    .addEventListener("submit", async function(event){
      event.preventDefault();
      const form = event.target

      const formObject = {
        whatsappNo: form.whatsapp.value,
        bookingNo: form.bookingNo.value
      }
     

      const res = await fetch('/booking/booking-info',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formObject)})
      
      form.reset();
      
      const bookingInfos = await res.json()

      if(bookingInfos.success === true){


        bookedTimeDiv.innerText = ""
        
        coverDiv.style.visibility = 'hidden'
        bookingInfoDiv.style.visibility='visible'


        bookingFormErrorDiv.forEach((field)=>{
          field.classList.remove("active")
          field.innerText = ""
      })
        

        bookingNumberDiv.innerText = bookingInfos.bookingInfo["reference_no"]
        bookedStudioURLDiv.href = `/booking/booking.html?studio_id=${bookingInfos.bookingInfo["studio_id"]}`
        bookedStudioNameDiv.innerText = bookingInfos.bookingInfo["name"]
        bookedStudioAddressDiv.innerText = bookingInfos.bookingInfo["address"]
        bookedStudioContactDiv.innerText = bookingInfos.bookingInfo["contact_no"]
        bookedDateDiv.innerText = bookingInfos.bookingInfo["date"]

        userRemarksDiv.innerText = bookingInfos.bookingInfo["remarks"]
        currentStatusDiv.innerText = bookingInfos.bookingInfo["status"]

        for(let timeslot of bookingInfos.bookingDateTime ){
          timeslot.start_time =  timeslot.start_time.slice(0,-3)
          timeslot.end_time =  timeslot.end_time.slice(0,-3)
          bookedTimeDiv.innerText += `  ${timeslot.start_time} - ${timeslot.end_time}  `
        }

      }else{
        coverDiv.style.visibility = 'visible'
        bookingInfoDiv.style.visibility='hidden'

        bookingFormErrorDiv.forEach((field)=>{
          field.classList.add("active")
          field.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> ${bookingInfos.message}`
      })
      }

      
      
      

      
    })
 

}



    
