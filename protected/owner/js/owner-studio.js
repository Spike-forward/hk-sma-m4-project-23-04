window.onload = async () => {
    const studioIconRes = await fetch('/owner-studio/studio-icon')
    const ownerNameRes = await fetch('/owner-studio/owner-name')
    const studioInfoRes = await fetch('/owner-studio/studio-info')
    const studioEquipRes = await fetch('/owner-studio/studio-equip')

    const studioIcon = await studioIconRes.json()
    const ownerName = await ownerNameRes.json()
    const studioInfo = await studioInfoRes.json()
    const studioEquip = await studioEquipRes.json()

    const studioIconDiv = document.querySelector('#owner-icon')
    const ownerNameDiv = document.querySelector('.hello')
    const studioNameDiv = document.querySelector('.studio-name')
    const studioAddressDiv = document.querySelector('.studio-address')
    const studioContactDiv = document.querySelector('.studio-contactNo')
    const studioPriceDiv = document.querySelector('.studio-price')
    const studioDescriptionDiv = document.querySelector('.studio-description')
    const studioPhotosDiv = document.querySelector('#photos')
    const studioEquipDiv = document.querySelector('.equipments')

    studioIconDiv.innerHTML = `<img src="../uploads/studio_icon/${studioIcon.icon}" alt="owner's icon">`
    ownerNameDiv.innerHTML = `<h2>Hi, ${ownerName.first_name} ${ownerName.last_name}!</h2>`
    studioNameDiv.innerHTML = `
        <input required type="text" class="form-control" id="name" value="${studioInfo.name}" name="name">
        <label for="name">Studio Name</label>`

    studioAddressDiv.innerHTML = `
        <input required type="text" class="form-control" id="address" value="${studioInfo.address}" name="address">
        <label for="address">Address</label>`
    studioContactDiv.innerHTML = `
        <input required type="tel" class="form-control" id="contactNo" value="${studioInfo.contact_no}" name="contact_no">
        <label for="contactNo">Contact Number</label>`
    studioPriceDiv.innerHTML = `
        <textarea required class="form-control" name="price" id="price" style="height: 150px; width: 40%">
        ${studioInfo.price}
        </textarea>
        <label for="price">Price</label>`
    studioDescriptionDiv.innerHTML = `
        <textarea class="form-control" name="description" id="description" style="height: 150px; width: 40%">
        ${studioInfo.description}
        </textarea>
        <label for="description">Description</label>`

    document.querySelector('#district option[selected]').removeAttribute('selected');
    document.querySelector(`#district option[value='${studioInfo.district}']`).selected = true;

    document.querySelector('#openTime option[selected]').removeAttribute('selected');
    document.querySelector(`#openTime option[value='${studioInfo.open_time}']`).selected = true;

    document.querySelector('#closeTime option[selected]').removeAttribute('selected');
    document.querySelector(`#closeTime option[value='${studioInfo.close_time}']`).selected = true;

    for (let photo of studioInfo.photos) {
        studioPhotosDiv.innerHTML+=`
        <div class="">
            <img src="../uploads/studio_photo/${photo.filename}" alt="studio-photo">
        </div>
        `
        if (photo.cover_photo){
            studioPhotosDiv.querySelector(`img[src="../uploads/studio_photo/${photo.filename}"]`).classList.toggle('chosen')
        }
    }
    
    const photos = studioPhotosDiv.querySelectorAll('img')
    for (let photo of photos){
        photo.addEventListener('click', (event)=>{
            studioPhotosDiv.querySelector('.chosen').classList.toggle('chosen')
            event.target.classList.toggle('chosen')
        })
    }

    for (let item of studioEquip){
        console.log(item)
        studioEquipDiv.innerHTML += `
        <label for="${camelCasing(item.items)}"><input type="checkbox" name="items" value="${item.items}" id="${camelCasing(item.items)}">${item.items}</label>
        `
    }

    for (let item of studioInfo.equipment){
        document.querySelector(`input[value="${item}"]`).checked = true
    }
}

function camelCasing(string) {
    const string_list = string.split(' ')
    for (let i=1; i<string_list.length; i++){
        string_list[i] = string_list[i][0].toUpperCase()+string_list[i].slice(1)
    }
    return string_list.join('')
}