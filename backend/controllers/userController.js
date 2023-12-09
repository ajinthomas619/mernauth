
import aysncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';


const authUser =aysncHandler( async  (req,res)=>{

    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        generateToken(res,user._id);
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email
        });
    }
        else {
            res.status(401);
            throw new Error('Invalid Email or Password');
        }
    }
    
);

const registerUser = aysncHandler(async(req,res)=>{
const {name,email,password} = req.body;

if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
}


const userExists = await User.findOne({email});
if (userExists) {
    res.status(400).json({ error: 'User already exists' });
    return; 
}
const user = await User.create({
    name,
    email,
    password
});

if(user){
    generateToken(res,user._id)
    res.status(201).json({
        _id:user._id,
        name:user.name,
        email:user.email
    });
} else{
    res.status(400)
    throw new Error("Invalid User Data")
}



})


const logoutUser = aysncHandler(async(req,res)=>{
  res.cookie('jwt','',{
    httpOnly:true,
    expires:new Date(0)
  })  
  res.status(200).json({message:'Logged out successfully'})
})


const getUserProfile = aysncHandler(async(req,res)=>{

    const user = {
     _id: req.user._id,
     name: req.user.name,
     email: req.user.email
    }


    res.status(200).json(user)
    
})
const updateUserProfile = aysncHandler(async(req,res)=>{
     
const user = await User.findById(req.user._id)

if(user){
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if(req.body.password){
        user.password = req.body.password
    }
    const updatedUser = await user.save();
res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
})
}

else{
    res.status(404)
    throw new Error('User not found')
}

})





export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}