import User from "../model/auth.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
export const registerUser = async(req,res)=>{
    try{
        const{name, email,password, domain, skills}= req.body
        if(!name || !email || !password){
            return res.status(400).json({
                sucess: false,
                message: "All Fields are Required"
            })
        }
        if(password.length<8){
            return res.status(400).json({
                sucess: false,
                message: "Password Should be atleast 8 char"
            })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            domain,
            skills
        })
        return res.status(201).json({
            sucess: true,
            message: "User Created Sucessfuly",
            user
        })
    }
    catch(e){
        console.log(e.message)
        return res.status(500).json({
            sucess: false,
            message: "Internal Server error"
        })
    }

} 
export const loginUser = async(req,res)=>{
    try{
        const{name, email,password, domain, skills}= req.body
        const user = await User.findOne({email}).select("+password")
        if(!user){
            return res.status(400).json({
            sucess: false,
            message: "IInvalid Email or Password"
        })
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({
            sucess: false,
            message: "Invalid Password"
        })
        }
        const token =jwt.sign({userID: user._id},process.env.JWT_SECRET)
        return res.status(200).json({
            sucess: true,
            message: "User logged in Sucessfuly",
            user,
            token
        })
    }
    catch{
        console.log(e.message)
        return res.status(500).json({
            sucess: false,
            message: "Internal Server error"
        })
    }
}