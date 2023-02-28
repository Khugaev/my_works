import express from "express";
import path from "path";
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(path.dirname(__filename))

import util from "util";
const router = express.Router()

router.post('/image',async (req, res) => {
    try{
        const file = req.files.image

        const fileName = file.name
        const size = file.data.length
        const extension = path.extname(fileName)

        const allowedExtensions = /png|jpeg|jpg|gif/;

        if(!allowedExtensions.test(extension)) throw "Unsupported extension!";
        if(size > 5000000) throw "File must be less than 5MB"

        const md5 = file.md5

        const URL = md5 + extension
        await file.mv("./server/images/" + URL, function(err) {
            if (err)
                console.log(err)
        })

        const result = {
            success : 1,
            file: {
                url : "http://localhost:5003/upload/image/" + URL,
            }
        }

        res.status(200).json(result)
    } catch (err) {
        const result = {
            success : 0,
        }
        res.status(500).json(result)
    }

} )

router.get('/image/:name',async (req, res) => {
    const {name} = req.params
    res.sendFile(__dirname + "\\images\\" + name);
} )

export default router