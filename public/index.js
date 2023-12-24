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
         const errorDiv = document.querySelector(".error")
 
         //Return error when user selects an endTime that is earlier than the startTime
         if(form.endTime.value <= form.startTime.value){
           event.preventDefault();
           errorDiv.classList.add('active')
           return errorDiv.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> Please select an end time that is later than the start time`;
         }else{
           errorDiv.classList.remove('active')
           errorDiv.innerHTML = ""
         }

         searchParams.set('date',form.date.value);
         searchParams.set('startTime', form.startTime.value);
         searchParams.set('endTime',form.endTime.value);
         window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`);
         studioInfoRes = await fetch(`/studio-list/studio-info?date=${form.date.value}&startTime=${form.startTime.value}&endTime=${form.endTime.value}`)
    })
 

}



    
