import multer from "multer";
const Storage = multer.memoryStorage()
export const Upload = multer({
    Storage,
    limits:{
        fileSize:10*1024*1024
    }
})