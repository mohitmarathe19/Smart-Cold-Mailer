import express from "express"
import { Upload } from "../middleware/multer.middleware.js"
import { uploadFile } from "../controller/file.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { extractContent } from "../controller/extraction.controller.js"

const router=express.Router()

router.post("/upload",authMiddleware,Upload.single("file"),uploadFile)
router.post("/extract",authMiddleware,Upload.single("Screenshot"),extractContent)
export default router