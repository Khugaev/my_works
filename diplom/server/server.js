import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import fileUpload from "express-fileupload"
import routes from "./routes/routes.js";
import uploadRoutes from "./uploadRouter/index.js";
import {errorHandler} from "./middleware/errorMiddleware.js";
import sequelize from "./config/db.js";
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'

export const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "education_system",
  password: "123456",
  dateStrings: true
});

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()

const app = express()
app.use(cors())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use(express.json())
app.use('/upload', uploadRoutes)
app.use('/api', routes)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
console.log(PORT)
const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
    })
  } catch (e) {
    console.log(e)
  }
}

start()

