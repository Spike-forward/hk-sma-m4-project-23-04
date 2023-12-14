import express, { Request, Response } from 'express'
import {client} from '../main';
import formidable from 'formidable'
import fs from 'fs'
import Swal from 'sweetalert2'
import { eventNames } from 'process';

const uploadDir = './public/uploads'

export const ownerStudioRoutes  = express.Router();

ownerStudioRoutes.get('/owner-name', getOwnerName)
ownerStudioRoutes.get('/studio-icon', getStudioIcon)
ownerStudioRoutes.get('/studio-equip', getStudioEquip)
ownerStudioRoutes.get('/studio-info', getStudioInfo)
ownerStudioRoutes.post('/studio-info', updateStudioInfo)
ownerStudioRoutes.put('/cover-photo/:id', updateCoverPhoto)

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
        photos.push({"filename": photo.filename, "cover_photo": photo.cover_photo})
    }

    request_info.rows[0].equipment = equipment
    request_info.rows[0].photos = photos

    const result = request_info.rows[0]
    //console.log(result.address)
    res.json(result)
}

async function updateStudioInfo (req: Request, res: Response){
    //const requestID = parseInt(req.params.id)
    const email =  req.session.owner
    const studioName_ID = (await client.query('SELECT studio.id, studio.name FROM owner INNER JOIN studio ON owner.id = studio.owner_id WHERE email = $1', [email])).rows[0]
    const [studioName, studioID]: [string, number] = [studioName_ID.name, studioName_ID.id] 
    let studioPhotoNo = (await client.query('SELECT filename FROM studio_photo where studio_id = $1', [studioID])).rows.length
    const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFiles: 5,
        maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB, now set to 200MB
        filter: part => part.mimetype?.startsWith('image/') || false,
        filename: (originalName, originalExt, part, form) =>{
            
            form.on('file', (field, file)=>{
                // console.log(field)
                // console.log(file)
                if (field === "photos"){
                    originalName = 'photo' + originalName
                    console.log(originalName)
                }
                else if (field === "icon"){
                    originalName += 'icon' + originalName
                    console.log(originalName)
                }
            })
            return `${originalName}.${originalExt}`
            // let ext = part.mimetype?.split('/').pop()
            // studioPhotoNo++;
            // return `${studioName.split(' ').join('').toLowerCase()}_image${studioPhotoNo}.${ext}`
        }
    })
    form.parse(req, async (err, fields, files)=>{
        if (err){
            console.log(err);
            res.redirect('/owner/owner-studio.html')
        } else {
            // await client.query('UPDATE studio SET (name, district, address, contact_no, open_time, close_time, price, description, updated_at) = ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) where id = $9', 
            // [fields.name, fields.district, fields.address, fields.contact_no, fields.openTime, fields.closeTime, fields.price, fields.description, 
            // studioID]);
            //await renameAndMoveFile('.\\public\\uploads')
            //await client.query('')
            console.log({err, fields, files})
            res.redirect('/owner/owner-studio.html')
        }
    })
}

async function updateCoverPhoto (req: Request, res: Response){
    const requestID = parseInt(req.params.id)
    const email =  req.session.owner
    const studioID = (await client.query('SELECT studio.id FROM owner INNER JOIN studio ON owner.id = studio.owner_id WHERE email = $1', [email])).rows[0].id
    const request1 = await client.query('UPDATE studio_photo set cover_photo = TRUE where studio_id = $1 and filename = $2', [studioID, `studio${studioID}_image${requestID}`])
    res.json()
}



async function renameAndMoveFile(folderPath: string){
    try{
        const files = await fs.promises.readdir(folderPath)
        const uploadedPhotos = []
        for (let file of files){
            let fullPath = `${folderPath}\\${file}`
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
        uploadedPhotos.sort()
        console.log(uploadedPhotos)
        await fs.promises.rename(`./publc/uploads/${uploadedPhotos[uploadedPhotos.length-1]}`, `./public/uploads/studio_icon/${uploadedPhotos[uploadedPhotos.length-1].replace(`image${uploadedPhotos.length-1}`, "icon")}`);
        for (let i = 0; i<(uploadedPhotos.length-1); i++){
            await fs.promises.rename(`./publc/uploads/${uploadedPhotos[i]}`, `./public/uploads/studio_photo/${uploadedPhotos[i]}`)
        }
    } catch (err){
        console.log(err)
    }
}