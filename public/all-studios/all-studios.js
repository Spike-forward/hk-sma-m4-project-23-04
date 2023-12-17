window.onload = async () => {

    const searchParams = new URLSearchParams(location.search);
    const district = searchParams.get('district');
    
    let studioInfoRes;
  
    
    //Fetch From API
    if(!district){
      studioInfoRes = await fetch("/studio-list/studio-info")
    }else{
      studioInfoRes = await fetch(`/studio-list/studio-info?district=${district}`)
    }
  
  
    //Data get from API
    const studioInfo = await studioInfoRes.json()
   console.log(studioInfo)
  
    const studioRowDiv = document.querySelector('.studio-row')
    const messageDiv = document.querySelector('.message')
  
    if(studioInfo.length === 0){
      messageDiv.innerHTML = "<p> Sorry. There is no studio in this district. <br> Please check other districts. </p>"
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