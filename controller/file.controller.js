import cloudinary from "../config/cloud.config.js";
import User from "../model/auth.model.js";
import File from "../model/file.model.js";
export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File Is Required!",
            });
        } 
        const {fileName} = req.body;
        if (!fileName) {
            return res.status(400).json({
                success: false,
                message: "File Name Is Required!",
            });
        }  
        const result = await new Promise((resolve,reject)=>{
            const stream = cloudinary.uploader.upload_stream({
                folder:"files",
                resource_type:"auto"
            },
            (error,result)=>{
                if(error){
                    return reject(error)
                }
                else{
                    return resolve(result)
                }
            }
        )
        stream.end(req.file.buffer)
        })
        const file = await File.create({
            fileName,
            fileURL: result.secure_url,
            createdBy:req.user._id
        })
        await User.findByIdAndUpdate(req.user._id,{
            $push:{
                files:file._id
            }
        })
        return res.status(201).json({
            sucess:true,
            message:"File Uploaded Sucessfully..",
            file
        })
    } catch (e) {
        console.log("file upload error:",e.message)
        return res.status(500).json({
            sucess:false,
            message:"Internal server error"
        })
    }}