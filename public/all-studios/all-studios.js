window.onload = async () => {
  
  loadDateTimeFilter();
   
   const searchParams = new URLSearchParams(location.search);
   let district = searchParams.get('district');
   let filterDate = searchParams.get('date');
   let filterStartTime= searchParams.get('startTime');
   let filterEndTime= searchParams.get('endTime');

   console.log(filterDate)

   let studioInfoRes;
   let districtFilter = document.querySelectorAll(".dropdown-content a")
   let dateTimeFilter = document.querySelector("#date-time-filter")
   
   districtFilter.forEach((button)=>{
      button.addEventListener('click', async function(){
        const district = this.getAttribute("district");
        searchParams.set('district', district);
        filterDate = searchParams.get('date');
        filterStartTime= searchParams.get('startTime');
        filterEndTime= searchParams.get('endTime');
        window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`);
        studioInfoRes = await fetch(`/studio-list/studio-info?district=${district}&date=${filterDate}&startTime=${filterStartTime}&endTime=${filterEndTime}`)
        loadStudio(studioInfoRes);
      })
   })

   dateTimeFilter.addEventListener("submit", async function(event){
        event.preventDefault();
        const form = event.target
        searchParams.set('date',form.date.value);
        searchParams.set('startTime', form.startTime.value);
        searchParams.set('endTime',form.endTime.value);
        district = searchParams.get('district');
        window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`);
        studioInfoRes = await fetch(`/studio-list/studio-info?district=${district}&date=${form.date.value}&startTime=${form.startTime.value}&endTime=${form.endTime.value}`)
        loadStudio(studioInfoRes);
   })

    //Fetch From API
  
      studioInfoRes = await fetch(`/studio-list/studio-info?district=${district}&date=${filterDate}&startTime=${filterStartTime}&endTime=${filterEndTime}`)


     loadStudio(studioInfoRes);

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


async function loadStudio(studioInfoRes){

    const studioRowDiv = document.querySelector('.studio-row')
    const messageDiv = document.querySelector('.message')

    messageDiv.innerHTML = ""
    studioRowDiv.innerHTML = ""

    const studioInfo = await studioInfoRes.json()
  
  
    if(studioInfo.length === 0){
      messageDiv.innerHTML = "<p> Sorry. There is no available studio match your selection right now. <br> Please search again with other. </p>"
  }else{
      for(let studio of studioInfo){
          studioRowDiv.innerHTML += ` <div class="col-lg-4 col-md-6 col-xs-12">
          <a href="/booking/booking.html?studio_id=${studio.id}">
            <div class="studio-card">
              <div class="cover-photo">
                <img src="../uploads/studio_photo/${studio.filename}" alt="">
              </div>
      
              <div class="icon">
                <img src="../uploads/studio_icon/${studio.icon}" alt="">
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

}