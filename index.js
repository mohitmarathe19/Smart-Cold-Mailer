import express from "express"
import mongoose from "mongoose"
import connectDB from "./config/db.js"
import authRoutes from "./routes/auth.routes.js"
import fileRoutes from "./routes/file.routes.js"
import mailRoutes from "./routes/mail.routes.js"
const app = express()
const PORT = 5000
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/files',fileRoutes)
app.use('/api/mails',mailRoutes)
connectDB()
app.get('/',(req,res) =>{
    res.send("Cold mailer API is Running ")
})
app.listen(PORT, () =>{
    console.log(`server is running on Port ${PORT}`);
})
