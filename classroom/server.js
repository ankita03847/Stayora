const express= require("express");
const app= express();
const session= require("express-session");
const flash = require("connect-flash");



app.use(session({
    secret:"this is my secreate :", resave:false, saveUninitialized:true}));
    app.use(flash());

//   app.use(session(sessionOptions));

// app.get("/test", (req, res)=> {
//     res.send("welcome:");
//     console.log(req.cookies)
// })


// app.get("/test", (req, res)=> {

//     if( req.session.count){
//          req.session.count++;
//     } else{
//                 req.session.count=1;
//     }    
//     res.send(`you have send request ${req.session.count}`);
//     console.log(req.cookies)
// })



app.get("/register", (req, res)=> {

//    let {name="anynomus"}= req.qeury;
//    req.session.name= "ankita";
   req.flash("success" ," hello ankita")
   res.redirect('/hello');
    
});

app.get("/hello",(req, res)=>{

    let msg = req.flash("success")
    res.send(msg);
// res.send(`this is my name: ${name}`)

});













app.listen(8080,()=>{
console.log("port listing:");
})