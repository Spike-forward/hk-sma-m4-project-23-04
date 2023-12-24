window.onload = async () => {
  
  loadDateTimeFilter();
  filterMobileListener();
   
   const searchParams = new URLSearchParams(location.search);
   let district = searchParams.get('district');
   let filterDate = searchParams.get('date');
   let filterStartTime= searchParams.get('startTime');
   let filterEndTime= searchParams.get('endTime');

   console.log(filterDate)

   let studioInfoRes;
   let districtFilter = document.querySelector("#district-filter")
   let dateTimeFilter = document.querySelector("#date-time-filter")
   const filterContainer = document.querySelector(".filter-container")
  
   districtFilter.addEventListener("submit", async function(event){
        event.preventDefault();
        filterContainer.classList.remove("mobile")
        const form = event.target
        searchParams.set('district', form.district.value);
        filterDate = searchParams.get('date');
        filterStartTime= searchParams.get('startTime');
        filterEndTime= searchParams.get('endTime');
        window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`);
        studioInfoRes = await fetch(`/studio-list/studio-info?district=${form.district.value}&date=${filterDate}&startTime=${filterStartTime}&endTime=${filterEndTime}`)
        loadStudio(studioInfoRes);
    })

   dateTimeFilter.addEventListener("submit", async function(event){
        event.preventDefault();
        const form = event.target
        const errorDiv = document.querySelector(".error")

        //Return error when user selects an endTime that is earlier than the startTime
        if(form.endTime.value <= form.startTime.value){
          errorDiv.classList.add('active')
          return errorDiv.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> Please select an end time that is later than the start time`;
        }else{
          errorDiv.classList.remove('active')
          errorDiv.innerHTML = ""
          filterContainer.classList.remove("mobile")
        }

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


export function loadDateTimeFilter(){
    flatpickr("#date", { 
      minDate: addDays(new Date(), 2),
      maxDate: addDays(new Date(), 32),
      defaultDate: addDays(new Date(), 2)
    }
    );
  
    flatpickr("#startTime", { 
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    minuteIncrement:60,
    defaultDate: "10:00"}
    );
    
    flatpickr("#endTime", { 
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    minuteIncrement:60,
    defaultDate: "11:00"}
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

export function filterMobileListener(){
   const mobileFilterButton = document.querySelector(".filter-button>button")
   const filterContainer = document.querySelector(".filter-container")
   const filterClose = document.querySelector(".close")

   mobileFilterButton.addEventListener("click", function(event){
      filterContainer.classList.add("mobile")
   })

   filterClose.addEventListener("click", function(event){
    filterContainer.classList.remove("mobile")
  })


}