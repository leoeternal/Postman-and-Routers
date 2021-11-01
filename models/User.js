var mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

var userSchema=new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    password:String,
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userSchema.methods.generateToken=async function(){
    try{
        const token=jwt.sign({_id:this._id.toString()},"mynameisnikhiljindalandiamfromindiaandwanttobecomebestinlife");
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(error){
        res.send("The error part is "+error);
    }
}

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
})

var User=mongoose.model("User",userSchema);

module.exports=User;
