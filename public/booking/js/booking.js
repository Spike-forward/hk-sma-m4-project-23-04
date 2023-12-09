window.onload = async () => {
  const searchParams = new URLSearchParams(location.search);
  const studioID = searchParams.get('studio_id');

  //Fetch From API
  const studioInfoRes = await fetch(`/booking/studio-info?studio_id=${studioID}`);
  const studioEquRes = await fetch(`/booking/studio-equipment?studio_id=${studioID}`);
  const studioImageRes = await fetch(`/booking/studio-image?studio_id=${studioID}`);
  const studioOpenDurationRes = await fetch(`/booking/studio-open-duration?studio_id=${studioID}`);
  const bookedDateTimeRes = await fetch(`/booking/booked-date-time?studio_id=${studioID}`);
  
  //Data get from API
  const studioInfo = await studioInfoRes.json()
  const studioEqu = await studioEquRes.json()
  const studioImages = await studioImageRes.json()
  const studioOpenDuration = await studioOpenDurationRes.json()
  const bookedDateTime = await bookedDateTimeRes.json()

  //DOM DIV
  const studioProfileDiv = document.querySelector(".studio-profile")
  const studioDescriptionDiv = document.querySelector(".input-description")
  const studioPriceDiv = document.querySelector(".input-price")
  const studioEquDiv = document.querySelector(".input-equipment ul")
  const carouselIndicators = document.querySelector(".carousel-indicators")
  const carouselInner = document.querySelector(".carousel-inner")

//Display Content
  //Studio Profile
  studioProfileDiv.innerHTML = `
    <div class="icon">
      <img src="../uploads/studio_icon/${studioInfo.icon}" alt="">
    </div>

    <div class="basic-info">
      <div class="name-district">
          <h3 class="name">${studioInfo.name}</h3>
          <p class="district">${studioInfo.district}</p>
      </div>
      <p class="address">${studioInfo.address} </p>
    </div>`
  //Description
  studioDescriptionDiv.innerHTML = `${studioInfo.description}`
  studioPriceDiv.innerHTML = `${studioInfo.price}`

  //Equipment
  for(let equ of studioEqu ){
    studioEquDiv.innerHTML += `<li>${equ.items}</li>`
  }

  //Carousel
  for(let image in studioImages ){
    carouselIndicators.innerHTML += `<button type="button" data-bs-target="#carouselExampleIndicators" class="" data-bs-slide-to="${image}" aria-label="Slide ${image}"></button>`
  }
  const firstIndicator = document.querySelector('.carousel-indicators button:first-child')
 
  firstIndicator.classList.add('active')
  

  for(let image of studioImages){

    if(!image.cover_photo){
      carouselInner.innerHTML += `<div class="carousel-item">
      <img src="../uploads/studio_photo/${image.filename}" class="d-block w-100" alt="${image.filename}">
      </div>`


      
    }else{
      carouselInner.innerHTML += `<div class="carousel-item active">
      <img src="../uploads/studio_photo/${image.filename}" class="d-block w-100" alt="${image.filename}">
      </div>`
    }
    
  }

  //calendar and time 
  const timePicker = document.querySelector(".time-picker");
  const timeDisplay = document.querySelector(".time");
  const dateDisplay = document.querySelector(".date");

 
  //Fullcalendar Configuration
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
  // initialView: 'dayGridMonth',
  initialView: "multiMonthFourMonth",
  views: {
    multiMonthFourMonth: {
      type: "multiMonth",
      duration: { months: 2 },
    },
  },
  validRange: {
    start: addDays(new Date(), 2),
    end: addDays(new Date(), 32),
  },
  headerToolbar: false,
  });

  calendar.render();

  //Display Time when date on calendar is clicked
  const days = document.querySelectorAll("td[data-date]");

  days.forEach((day, index) => {
  day.addEventListener("click", (e) => {
    if (!e.target.closest("td[data-date]").classList.contains("fc-day-other")) {
      let selectedDay = e.target
        .closest("td[data-date]")
        .getAttribute("data-date");
      dateDisplay.innerHTML = `<p>Booking Date: <span class="date-selected">${selectedDay}</span> </p>`;
      timeDisplay.innerText = "Booking Time:";
      setDayActive(selectedDay);
      loadTimePicker(studioOpenDuration.open_time, studioOpenDuration.close_time, 1, selectedDay,bookedDateTime);
    }
  });
  });

  function setDayActive(selectedDay) {
  days.forEach((day) => {
    if (day.getAttribute("data-date") === selectedDay) {
      if (!day.classList.contains("fc-day-other")) {
        day.classList.add("date-selected");
      }
    } else {
      day.classList.remove("date-selected");
    }
  });
  }

}


//Function to load the time picker based on studio start and end time 
function loadTimePicker(start_time, end_time, interval, date,booked_date_time) {
  const timePicker = document.querySelector(".time-picker");
  const timeDisplay = document.querySelector(".time");
  

    timePicker.innerHTML = "";

    //Load Timeslot div block
    for (let i = start_time; i < end_time; i += interval) {
      timePicker.innerHTML += `<div class="timeslot available" data-booking-date=${date} data-booking-time=${i}>${i}:00 - ${i + 1}:00</div>`;
    } 

    const timeslots = document.querySelectorAll(".timeslot");
    const displaySelectedTime = document.querySelectorAll(".display-selected-time");

    //Add unavailable class when the date and timeslot is booked
    for(let booking of booked_date_time){
      timeslots.forEach((timeslot)=>{
        if(booking.date === timeslot.getAttribute("data-booking-date") && booking.start_time === timeslot.getAttribute("data-booking-time")){
          timeslot.classList.remove("available")
          timeslot.classList.add("unavailable")
      }})
    }

    
    const availableTimeslots = document.querySelectorAll(".timeslot.available");
 

    //Add click event listener to timeslot
    availableTimeslots.forEach((timeslot, index) => {

      timeslot.addEventListener("click", (e) => {
        timeDisplay.innerText = "Booking Time: ";
        //Unselect the selected timeslot
        if (e.target.classList.contains("time-selected")) {
            e.target.classList.remove("time-selected");
          //remove the unselect timeslot from booking time line
        } else {
            e.target.classList.add("time-selected");
        }

        const selectedTimeslots = document.querySelectorAll(".timeslot.time-selected");

        selectedTimeslots.forEach((timeslot)=>{
          timeDisplay.innerHTML += `<span class="display-selected-time" data-booking-date=${timeslot.getAttribute("data-booking-date")} data-booking-time=${timeslot.getAttribute("data-booking-time")}>${timeslot.innerText}</span>`
        })
      
      });
    });

  
  
    




}

function addDays(date, days) {
  date.setDate(date.getDate() + days);
    return date;
}

