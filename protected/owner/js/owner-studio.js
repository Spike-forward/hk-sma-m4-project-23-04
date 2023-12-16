window.onload = loadPage()
async function loadPage () {
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
    ownerNameDiv.innerHTML = `<h2>Welcome, ${ownerName.first_name} ${ownerName.last_name}!</h2>`



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

    document.querySelector('#district option[selected]').setAttribute('selected', false);
    document.querySelector(`#district option[value='${studioInfo.district}']`).setAttribute('selected', true);

    document.querySelector('#openTime option[selected]').setAttribute('selected', false);
    document.querySelector(`#openTime option[value='${studioInfo.open_time}']`).setAttribute('selected', true);

    document.querySelector('#closeTime option[selected]').setAttribute('selected', false);
    document.querySelector(`#closeTime option[value='${studioInfo.close_time}']`).setAttribute('selected', true);

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
        console.log(item)
        studioEquipDiv.innerHTML += `
        <label for="${camelCasing(item.items)}"><input type="checkbox" name="item${studioEquip.indexOf(item)+1}" value="${item.items}" id="${camelCasing(item.items)}">${item.items}</label>
        `
    }

    for (let item of studioInfo.equipment){
        document.querySelector(`input[value="${item}"]`).checked = true
    }
}

document
	.querySelector('.studio-form')
	.addEventListener('submit', async (event) => {
		event.preventDefault() // To prevent the form from submitting synchronously
        const serverMsg = document.querySelector(".server-msg")
		const form = event.target
        console.log(form)
		//... create your form object with the form inputs
		const formData = new FormData()

		formData.append('name', form.name.value)
        formData.append('district', form.district.value)
        formData.append('address', form.address.value)
        formData.append('contact_no', form.contact_no.value)
        formData.append('openTime', form.openTime.value)
        formData.append('closeTime', form.closeTime.value)
        formData.append('price', form.price.value)
        formData.append('description', form.description.value)
        if (form.item1.checked){
            formData.append('item1', form.item1.value)
        }
        if (form.item1.checked){
            formData.append('item2', form.item2.value)
        }
        if (form.item1.checked){
            formData.append('item3', form.item3.value)
        }
        if (form.item1.checked){
            formData.append('item4', form.item4.value)
        }

		formData.append('icon', form.icon.files[0])
        //for (let photo of form.photos){
            formData.append('photos', form.photos.files[0])
        //}

		const res = await fetch('/owner-studio/studio-info', {
			method: 'POST',
			body: formData
		})
		serverMsg.innerHTML = `Studio information updated!`
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