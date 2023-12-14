window.onload = async () => {
    const studioIconRes = await fetch('/owner-studio/studio-icon')
    const ownerNameRes = await fetch('/owner-studio/owner-name')
    const studioInfoRes = await fetch('/owner-studio/studio-info')

    const studioIcon = await studioIconRes.json()
    const ownerName = await ownerNameRes.json()
    const studioInfo = await studioInfoRes.json()


    const studioIconDiv = document.querySelector('#owner-icon')
    const ownerNameDiv = document.querySelector('.hello')
    const studioNameDiv = document.querySelector('.studio-name')
    const studioAddressDiv = document.querySelector('.studio-address')
    const studioContactDiv = document.querySelector('.studio-contactNo')
    const studioPriceDiv = document.querySelector('.studio-price')
    const studioDescriptionDiv = document.querySelector('.studio-description')

    studioIconDiv.innerHTML = `<img src="../uploads/studio_icon/${studioIcon.icon}" alt="owner's icon">`
    ownerNameDiv.innerHTML = `<h2>Hi, ${ownerName.first_name} ${ownerName.last_name}!</h2>`
    studioNameDiv.innerHTML = `
        <input required type="text" class="form-control" id="name" value=${studioInfo.name}>
        <label for="name">Studio Name</label>`

    studioAddressDiv.innerHTML = `
        <input required type="text" class="form-control" id="address" value=${studioInfo.address}>
        <label for="address">Address</label>`
    studioContactDiv.innerHTML = `
        <input required type="tel" class="form-control" id="contactNo" value=${studioInfo.contact_no}>
        <label for="contactNo">Contact Number</label>`
    studioPriceDiv.innerHTML = `
        <textarea required class="form-control" id="price" style="height: 150px; width: 40%">
        ${studioInfo.price}
        </textarea>
        <label for="price">Price</label>`
    studioDescriptionDiv.innerHTML = `
        <textarea class="form-control" id="description" style="height: 150px; width: 40%">
        ${studioInfo.description}
        </textarea>
        <label for="description">Description</label>`

    // switch (studioInfo.district){
    //     case "Yuen Long":
    //         document.querySelector('#district option[selected]').removeAttribute('selected')
    //         document.querySelector("#district option[value='Yuen Long']").
    // }
    // <div class="form-floating">
    //     <select required class="form-select" id="district" aria-label="District label select">
    //     <option selected disabled>Choose the district of your studio</option>
    //     <option value="Yuen Long">Yuen Long</option>
    //     <option value="Kwun Tong">Kwun Tong</option>
    //     <option value="Central">Central</option>
    //     </select>
    //     <label for="floatingSelect">District</label>
    // </div>
    
    
    // <div class="form-floating">
    //     <select required class="form-select" id="openTime" aria-label="Opening time label select">
    //         <option selected disabled>Choose the opening time of your studio</option>
    //         <option value="08:00">0800</option>
    //         <option value="09:00">0900</option>
    //         <option value="10:00">1000</option>
    //         <option value="11:00">1100</option>
    //         <option value="12:00">1200</option>
    //         <option value="13:00">1300</option>
    //         <option value="14:00">1400</option>
    //         <option value="15:00">1500</option>
    //         <option value="16:00">1600</option>
    //         <option value="17:00">1700</option>
    //         <option value="18:00">1800</option>
    //         <option value="19:00">1900</option>
    //         <option value="20:00">2000</option>
    //         <option value="21:00">2100</option>
    //     </select>
    //     <label for="openTime">Opening Time</label>
    // </div>
    // <div class="form-floating">
    //     <select required class="form-select" id="closeTime" aria-label="Closing time label select">
    //         <option selected disabled>Choose the closing time of your studio</option>
    //         <option value="08:00">0800</option>
    //         <option value="09:00">0900</option>
    //         <option value="10:00">1000</option>
    //         <option value="11:00">1100</option>
    //         <option value="12:00">1200</option>
    //         <option value="13:00">1300</option>
    //         <option value="14:00">1400</option>
    //         <option value="15:00">1500</option>
    //         <option value="16:00">1600</option>
    //         <option value="17:00">1700</option>
    //         <option value="18:00">1800</option>
    //         <option value="19:00">1900</option>
    //         <option value="20:00">2000</option>
    //         <option value="21:00">2100</option>
    //     </select>
    //     <label for="closeTime">Closing Time</label>
    // </div>
    
    
    // <div class="form-floating">
    //     <input type="file" class="form-control" id="photos">
    //     <label for="photos">Photos</label>
    // </div>
    // <div class="coverPhoto">
    //     <h6>Choose 1 of the photos uploaded as cover photo</h6>
    //     <div></div>
    // </div>
    // <div class="form-floating">
    //     <input type="file" class="form-control" id="icon">
    //     <label for="icon">Studio Icon</label>
    // </div>
    // <h6>Equipments Included</h6>
    // <div class="equipments">
    //     <div>
    //         <label for="yogaMat"><input type="checkbox" value="Hook" id="hook">Yoga Mat</label>
    //         <label for="hook"><input type="checkbox" value="Hook" id="hook">Hook</label>
    //         <label for="wheel"><input type="checkbox" value="Wheel" id="wheel">Wheel</label>
    //         <label for="hammock"><input type="checkbox" value="Hammock" id="hammock">Hammock</label>
    //     </div>
    // </div>
}