window.onload = async () => {

  loadDateTimeFilter();


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

}


function addDays(date, days) {
  date.setDate(date.getDate() + days);
    return date;
}

function loadDateTimeFilter(){
      flatpickr("#date", { 
        minDate: addDays(new Date(), 2),
        maxDate: addDays(new Date(), 32)}
    );

    flatpickr("#startTime", { 
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    minuteIncrement:60}
    );

    flatpickr("#endTime", { 
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    minuteIncrement:60}
    );
}

 
  
    
