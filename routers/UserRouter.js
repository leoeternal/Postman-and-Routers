var express=require("express");
var User=require("../models/User");
const router=new express.Router();
const bcrypt=require("bcryptjs");

router.get("/",async(req,res)=>{
    try{
        const usersData=await User.find();
        res.status(200).send(usersData);
    }catch(e){
        res.status(400).send(e);
    }
})

router.post("/login",async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        const userData=await User.findOne({email:email});

        const isMatch=await bcrypt.compare(password,userData.password);
        const token=await userData.generateToken();
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+50000),
            httpOnly:true
        })
        if(isMatch){
            res.status(200).send("Welcome to home page");
        }else{
            res.status(400).send("Invalid Details");    
        }
    }catch(e){
        res.status(400).send("Invalid Details");
    }
})

router.get("/:id",async(req,res)=>{
    try{
        const id=req.params.id;
        const data=await User.findById(id);
        res.status(200).send(data);
    }catch(e){
        res.status(400).send(e);
    }
})

router.delete("/:id",async(req,res)=>{
    try{
        const id=req.params.id;
        const deleteStudent=await User.findByIdAndDelete(id);
        if(!id){
            return res.status(400).send();
        }
        res.send(deleteStudent);
    }catch(e){
        res.status(500).send(e);
    }
})

// userOne.save((err,userAdded)=>{
//     if(err) throw err;
//     console.log(`Kitty added in the database with the name ${userAdded}`);
// })

// router.post("/data",(req,res)=>{
//     // console.log(req.body);
//     var myData=new User(req.body);
//     myData.save().then(()=>{
//         res.send("The item has been saved to database");
//     }).catch(()=>{
//         res.status(400).send("Item couldn't save to database");
//     })
// })

router.post("/data",async(req,res)=>{
    try{
        const user=new User(req.body);
        const token=await user.generateToken();
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+50000),
            httpOnly:true
        })
        const userCreated=await user.save();
        res.status(200).send(userCreated);
    }catch(e){
        res.status(400).send(e);
    }
})

router.patch("/:id",async(req,res)=>{
    try{
        const _id=req.params.id;
        const updateStudent=await User.findByIdAndUpdate(_id,req.body,{
            new:true
        });
        res.status(200).send(updateStudent);
    }catch(e){
        res.status(400).send(e);
    }
})

module.exports=router;