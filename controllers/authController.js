import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({id:userId}, process.env.JWT_SECRET, {expiresIn: "30d"});
};

export const registerUser = async (req, res)=>{
    const {name, email, password} = req.body;

    try{
        const userExists = await User.findOne({email});
        if (userExists) return res.status(400).json({error: "User already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({name, email, password: hashedPassword});
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error){
        res.status(500).json({error: "Server error"});
    }
    
};

export const loginUser = async (req,res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user) return res.status(401).json({error: "Invalid email or password"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({error: "Invalid email or password"});
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
}