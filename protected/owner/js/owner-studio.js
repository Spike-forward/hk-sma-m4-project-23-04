window.onload = loadPage()

async function loadPage () {
    const ownerNameRes = await fetch('/owner-studio/owner-name')
    const ownerName = await ownerNameRes.json()
    const ownerNameDiv = document.querySelector('.hello')
    ownerNameDiv.innerHTML = `<h2>Welcome, ${ownerName.first_name} ${ownerName.last_name}!</h2>`
    
    //If the studio id doesn't exist in database, then go back to 404 page
    const checkStudioIDRes = await fetch(`/owner-studio/check-new-studio/`)
    const checkStudioID = await checkStudioIDRes.json()
    
    const serverMsg = document.querySelector(".server-msg")

    if (checkStudioID.error){
        const res = await fetch('/owner-studio/studio-info', {
            method: 'POST',
        })
        serverMsg.innerHTML=`Missing studio information!`
        serverMsg.classList.add("warning")
        await loadPage();
    } 
    else if(checkStudioID.success){
        const studioIconRes = await fetch('/owner-studio/studio-icon')
        const studioInfoRes = await fetch('/owner-studio/studio-info')
        const studioEquipRes = await fetch('/owner-studio/studio-equip')
        const studioIcon = await studioIconRes.json()
        const studioInfo = await studioInfoRes.json()
        const studioEquip = await studioEquipRes.json()
        
        const studioIconDiv = document.querySelector('#owner-icon')
        const studioNameDiv = document.querySelector('.studio-name')
        const studioAddressDiv = document.querySelector('.studio-address')
        const studioContactDiv = document.querySelector('.studio-contactNo')
        const studioPriceDiv = document.querySelector('.studio-price')
        const studioDescriptionDiv = document.querySelector('.studio-description')
        const studioCoverPhotoHeader = document.querySelector('.coverPhoto h6')
        const studioPhotosDiv = document.querySelector('#photos')
        const studioEquipDiv = document.querySelector('.equipments')
        
        studioIconDiv.innerHTML = `<img src="../uploads/studio_icon/${studioIcon.icon}" alt="owner's icon">`
        studioNameDiv.innerHTML = `
            <input required type="text" class="form-control" id="name" value="${studioInfo.name}" name="name">
            <label for="name">Studio Name*</label>`
    
        studioAddressDiv.innerHTML = `
            <input required type="text" class="form-control" id="address" value="${studioInfo.address}" name="address">
            <label for="address">Address*</label>`
        studioContactDiv.innerHTML = `
            <input required type="tel" class="form-control" id="contactNo" value="${studioInfo.contact_no}" name="contact_no">
            <label for="contactNo">Contact Number*</label>`

        // Caution: If textarea is added by editing innerHTML, whitespace may be added if there is a line spacing
        studioPriceDiv.innerHTML = `
            <textarea required class="form-control" name="price" id="price" style="height: 150px; width: 40%">${studioInfo.price}</textarea>
            <label for="price">Price*</label>`
        studioDescriptionDiv.innerHTML = `
            <textarea class="form-control" name="description" id="description" style="height: 150px; width: 40%">${studioInfo.description}</textarea>
            <label for="description">Description</label>`
    
        document.querySelector('#district option[selected]').setAttribute('selected', false);
        if (document.querySelector(`#district option[value='${studioInfo.district}']`)){
            document.querySelector(`#district option[value='${studioInfo.district}']`).setAttribute('selected', true);
        }
        document.querySelector('#openTime option[selected]').setAttribute('selected', false);
        if (document.querySelector(`#openTime option[value='${studioInfo.open_time}']`)){
            document.querySelector(`#openTime option[value='${studioInfo.open_time}']`).setAttribute('selected', true)
        }
        document.querySelector('#closeTime option[selected]').setAttribute('selected', false);
        if (document.querySelector(`#closeTime option[value='${studioInfo.close_time}']`)){
            document.querySelector(`#closeTime option[value='${studioInfo.close_time}']`).setAttribute('selected', true);
        }
        
        studioPhotosDiv.innerHTML = ``
        for (let photo of studioInfo.photos) {
            studioPhotosDiv.innerHTML+=`
            <div class="photo id-${photo.id}">
                <img src="../uploads/studio_photo/${photo.filename}" alt="studio-photo">
                <i class="bi bi-x-circle-fill"></i>
            </div>
            `
            if (photo.cover_photo){
                studioPhotosDiv.querySelector(`img[src="../uploads/studio_photo/${photo.filename}"]`).classList.toggle('chosen')
            }
        }

        if (studioPhotosDiv.querySelector('img')){
            studioCoverPhotoHeader.innerText = "Choose 1 of the photos uploaded as cover photo*"
        }
        if (!studioPhotosDiv.querySelector('.chosen')){
            serverMsg.innerHTML = `Missing cover photo!`
            serverMsg.classList.add('warning')
        }
        
        const photos = studioPhotosDiv.querySelectorAll('img')
        const deletePhotoButtons = studioPhotosDiv.querySelectorAll('.bi-x-circle-fill')
        photos.forEach((photo, index)=>{
            const id = document.querySelectorAll(".photo:has(img[alt='studio-photo'])")[index].classList[1].slice(3);
            photo.addEventListener('click', async (event)=>{
                if (studioPhotosDiv.querySelector('.chosen')){
                    studioPhotosDiv.querySelector('.chosen').classList.toggle('chosen')
                }
                event.target.classList.toggle('chosen')
                
                const res = await fetch(`/owner-studio/cover-photo/${id}`, {
                    method: 'PUT',
                })
            })
        })
        deletePhotoButtons.forEach((button, index)=>{
            const id = document.querySelectorAll(".photo:has(.bi-x-circle-fill)")[index].classList[1].slice(3);
            button.addEventListener('click', async (event)=>{
                const res = await fetch(`/owner-studio/photos/${id}`, {
                    method: 'DELETE',
                })
                await loadPage();
            })
        })
        studioEquipDiv.innerHTML = ``
        for (let item of studioEquip){
            //console.log(item)
            studioEquipDiv.innerHTML += `
            <label for="${camelCasing(item.items)}"><input type="checkbox" name="item${studioEquip.indexOf(item)+1}" value="${item.items}" id="${camelCasing(item.items)}">${item.items}</label>
            `
        }
        for (let item of studioInfo.equipment){
            document.querySelector(`input[value="${item}"]`).checked = true
        }
        if (studioInfo.name === '' || studioInfo.address === '' || studioInfo.contact_no === '' || studioInfo.price === '' || studioInfo.photos.length === 0){
            serverMsg.innerHTML = `Missing studio information!`
            serverMsg.classList.add('warning')
        }
    }
}

document
	.querySelector('.studio-form')
	.addEventListener('submit', async (event) => {
		event.preventDefault() // To prevent the form from submitting synchronously
        
        const form = event.target
        console.log(form)
        //... create your form object with the form inputs
        const formData = new FormData(form)
        
        const res = await fetch('/owner-studio/studio-info', {
            method: 'PUT',
            body: formData,
        })
        const serverMsg = document.querySelector(".server-msg")
        if (document.querySelector(".chosen")){
            Swal.fire({
                icon: "success",
                title: "Studio Information updated!",
                text: "Updated information will be displayed on the website!"
            }).then((result)=>{
                if (result.isConfirmed){
                    serverMsg.innerHTML = `Studio information updated!`
                    if (serverMsg.classList.contains('warning')){
                        serverMsg.classList.remove('warning')
                    }
                }
            })
        } else {
            Swal.fire({
                icon: "warning",
                title: "Missing Cover Photo!",
                text: "You have to upload at least 1 photo and choose one as your cover photo (with red border surrounded)!",
                imageUrl: "images/cover-photo-example.jpeg",
                imageHeight: 500,
                imageAlt: "Cover photo example"
            })
            .then((result)=>{
                if (result.isConfirmed){
                    serverMsg.innerHTML = `Studio information updated! Missing cover photo!`
                    serverMsg.classList.add('warning')
                }
            })
        }
        await loadPage()
	})

// Useful function
function camelCasing(string) {
    const string_list = string.split(' ')
    for (let i=1; i<string_list.length; i++){
        string_list[i] = string_list[i][0].toUpperCase()+string_list[i].slice(1)
    }
    return string_list.join('')
}