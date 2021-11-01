const express=require("express");
var bodyParser=require("body-parser");
var app=express();
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/shopping",{useNewUrlParser:true,useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended:false}));
const port=8000;
var db=mongoose.connection;

app.use(express.json());

db.on("error",console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log("We are connected");
})

// app.get("/",(req,res)=>{
//     // res.send("HomePage");
//     User.find({},(err,findUsers)=>{
//         if(err)throw err;
//         res.status(200).send(findUsers);
//     })
// })

const StudentRouter=require("./routers/UserRouter");
app.use(StudentRouter);



app.listen(port,()=>{
    console.log(`App is running on port ${port}`);
})