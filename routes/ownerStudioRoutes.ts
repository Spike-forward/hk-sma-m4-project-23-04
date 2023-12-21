import express, { Request, Response } from 'express'
import {client} from '../main';
import formidable, { Fields, Files } from 'formidable'
import fs from 'fs'
import path from 'path'
import Swal from 'sweetalert2'
import { parseForm } from '../form';


const uploadDir = './public/uploads'

export const ownerStudioRoutes  = express.Router();

ownerStudioRoutes.get('/owner-name', getOwnerName)
ownerStudioRoutes.get('/studio-icon', getStudioIcon)


ownerStudioRoutes.get('/studio-equip', getStudioEquip)
ownerStudioRoutes.get('/studio-info', getStudioInfo)

ownerStudioRoutes.get('/check-new-studio', checkNewStudio)
ownerStudioRoutes.post('/studio-info', createEmptyStudio)
ownerStudioRoutes.put('/studio-info', updateStudioInfo)
ownerStudioRoutes.put('/cover-photo/:id', updateCoverPhoto)
ownerStudioRoutes.delete('/photos/:id', deletePhoto)

ownerStudioRoutes.get('/logout', async(req, res)=>{
	if (req.session) {
		delete req.session['owner'];
        delete req.session['owner_id'];
	  }
	res.redirect('/index.html')
})

async function getOwnerName(req: Request, res: Response){
    const email =  req.session.owner
    const request = await client.query('SELECT owner.first_name, owner.last_name FROM owner WHERE email = $1', [email])
    const result = request.rows[0]
    res.json(result)
}

async function getStudioIcon(req: Request, res: Response){
    const email =  req.session.owner
    const studioID = (await client.query('SELECT studio.id FROM owner INNER JOIN studio ON owner.id = studio.owner_id WHERE email = $1', [email])).rows[0].id
    const request = await client.query('SELECT studio.icon FROM studio where studio.id = $1', [studioID])
    const result = request.rows[0]
    res.json(result)
}

async function getStudioEquip (req: Request, res: Response){
    const request = await client.query('SELECT equipment.items FROM equipment')
    const result = request.rows
    res.json(result)
}

async function getStudioInfo(req: Request, res: Response){
    const email =  req.session.owner
    const studioID = (await client.query('SELECT studio.id FROM owner INNER JOIN studio ON owner.id = studio.owner_id WHERE email = $1', [email])).rows[0].id
    const request_info = await client.query('SELECT * FROM studio WHERE id = $1', [studioID])
    const request_equip = await client.query('SELECT equipment.items FROM studio INNER JOIN studio_equipment ON studio.id = studio_equipment.studio_id INNER JOIN equipment ON studio_equipment.equipment_id = equipment.id WHERE studio_id = $1', [studioID])
    const request_photo = await client.query('SELECT * from studio_photo where studio_id = $1', [studioID])

    for (let studio of request_info.rows){
        studio.open_time = studio.open_time.split(':')[0]+"00"
        studio.close_time = studio.close_time.split(':')[0]+"00"
    }

    const equipment = []
    for (let item of request_equip.rows){
        equipment.push(item.items)
    }
    const photos = []
    for (let photo of request_photo.rows){
        photos.push({"id": photo.id, "filename": photo.filename, "cover_photo": photo.cover_photo})
    }

    request_info.rows[0].equipment = equipment
    request_info.rows[0].photos = photos

    const result = request_info.rows[0]
    //console.log(result.address)
    res.json(result)
}

async function checkNewStudio (req: Request, res: Response){
    const email =  req.session.owner
    const ownerID = (await client.query('SELECT owner.id FROM owner WHERE email = $1', [email])).rows[0].id
    const allStudioOwnerID = (await client.query('SELECT owner_id FROM studio')).rows
    if (allStudioOwnerID.some((studio)=> studio.owner_id === ownerID)){
        res.json({success:"Studio ID exists in database"})
    } else {
        res.json({error:"Studio ID is not valid, new studio needs to be created."})
    }
}

async function createEmptyStudio (req: Request, res: Response){
    const email =  req.session.owner
    const ownerID = (await client.query('SELECT id FROM owner where email = $1', [email])).rows[0].id
    await client.query('INSERT INTO studio (name, district, address, contact_no, icon, open_time, close_time, price, description, owner_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())', ["", "Choose the district of your studio", "", "", "user-3296.svg", "08:00:00", "24:00:00", "", "", ownerID])
    res.json({msg: "Empty studio created!"})
}

async function updateStudioInfo (req: Request, res: Response){
    const email =  req.session.owner
    const studioID = (await client.query('SELECT studio.id, studio.name FROM owner INNER JOIN studio ON owner.id = studio.owner_id WHERE email = $1', [email])).rows[0].id
    let studioPhotoNo = (await client.query('SELECT filename FROM studio_photo where studio_id = $1', [studioID])).rows.length
    const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFiles: 5,
        maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB, now set to 200MB
        filter: part => part.mimetype?.startsWith('image/') || false,
        filename: (originalName, originalExt, part, form) =>{
            let fieldName = part.name
            let ext = part.mimetype?.split('/').pop()
            studioPhotoNo++;
            let newFileName= "";
            if (fieldName === "photos"){
                newFileName = `studio${studioID}_image${studioPhotoNo}.${ext}`
            } else if (fieldName === "icon"){
                newFileName = `studio${studioID}_${fieldName}.${ext}`
            }
            return newFileName
        }
    })
    const { fields, files } = await parseForm(form, req)
    await client.query('UPDATE studio SET (name, district, address, contact_no, open_time, close_time, price, description, icon, updated_at) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) where id = $10', 
            [fields.name, fields.district, fields.address, fields.contact_no, fields.openTime, fields.closeTime, fields.price, fields.description, (files.icon as formidable.File)?.newFilename || (await client.query('SELECT icon FROM studio where id = $1', [studioID])).rows[0].icon, 
            studioID]);

    await client.query('DELETE FROM studio_equipment WHERE studio_id = $1', [studioID])
    //console.log(Object.keys(fields))
    for (let key of Object.keys(fields)){
        //console.log(key)
        //console.log(fields[key])
        if (key.includes("item")){
            const equipID = (await client.query("SELECT id FROM equipment WHERE items = $1", [fields[key]])).rows[0].id
            await client.query('INSERT INTO studio_equipment (studio_id, equipment_id) VALUES ($1, $2)', [studioID, equipID])
        } 
    }

    await moveFile('./public/uploads')
    // res.redirect('/owner/owner-studio.html')
    //console.log(files.photos)
    if (files.photos){
        //for (let photo of (files.photos as formidable.File[])){
            await client.query('INSERT INTO studio_photo (filename, cover_photo, studio_id, created_at, updated_at) VALUES ($1, False, $2, NOW(), NOW())', [(files.photos as formidable.File).newFilename, studioID])
        //}
    }
    res.json({msg: "update completed"})
    //res.redirect('/owner/owner-studio.html')
}

async function updateCoverPhoto (req: Request, res: Response){
    const photoID = parseInt(req.params.id)
    const email =  req.session.owner
    const studioID = (await client.query('SELECT studio.id FROM owner INNER JOIN studio ON owner.id = studio.owner_id WHERE email = $1', [email])).rows[0].id
    const [request1, request2] = await Promise.all([client.query('UPDATE studio_photo set (cover_photo, updated_at) = (TRUE, NOW()) where studio_id = $1 and id = $2', [studioID, photoID]), client.query('UPDATE studio_photo set (cover_photo, updated_at) = (FALSE, NOW()) where studio_id = $1 and id != $2', [studioID, photoID])])

    res.json({msg: 'cover photo updated!'})
}

async function deletePhoto (req: Request, res: Response){
    const photoID = parseInt(req.params.id)
    const email =  req.session.owner
    const studioID = (await client.query('SELECT studio.id FROM owner INNER JOIN studio ON owner.id = studio.owner_id WHERE email = $1', [email])).rows[0].id
    const request = await client.query('DELETE FROM studio_photo where studio_id = $1 and id = $2 RETURNING filename', [studioID, photoID])
    //await fs.promises.unlink(`./public/uploads/studio_photo/${request}`)
    res.json({msg: 'photo deleted!'})
}

async function moveFile(folderPath: string){
    try{
        const files = await fs.promises.readdir(folderPath)
        const uploadedPhotos = []
        for (let file of files){
            let fullPath = path.resolve(`${folderPath}`, `${file}`)
            const Stat = await fs.promises.stat(fullPath)
            if (Stat.isFile()){
                uploadedPhotos.push(file)
            }
        }
        // files.filter(async (file)=>{
        //     let fullPath = `${folderPath}\\${file}`
        //     const Stat = await fs.promises.stat(fullPath)
        //     //console.log(fullPath)
        //     //console.log(Stat)
        //     return Stat.isFile()
        // })
        //console.log(uploadedPhotos)
        for (let file of uploadedPhotos){
            if (file.includes("_image")){
                await fs.promises.rename(`./public/uploads/${file}`, `./public/uploads/studio_photo/${file}`);
            } else if (file.includes("_icon")){
                await fs.promises.rename(`./public/uploads/${file}`, `./public/uploads/studio_icon/${file}`);
            }
        }
    } catch (err){
        console.log(err)
    }
}