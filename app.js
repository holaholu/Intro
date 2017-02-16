// Main initialize ========================================
var express         = require ("express");
var app             = express();
var bodyParser      = require("body-parser");

var methodOverride  = require("method-override");
var expressSanitizer= require("express-sanitizer");
var flash           = require("connect-flash");

var request         = require('request');
var townshipEmail  = require('township-email')

//======================================================================
 



app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer ());
app.use (express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(flash());

//===================================================



   

app.use(require("express-session")({
    secret: "This APP is the best",
    resave: false,
    saveUninitialized: false
}));




//VARIABLES MADE AVAILABLE TO ALL TEMPLATES=====================

app.use(function(req,res,next){
    res.locals.currentuser=req.user;
    res.locals.error    =req.flash("error");
    res.locals.success    =req.flash("success");
    next();
});


//====================================================


// =====EMAIL SENDING SECTION================
var mail = townshipEmail({
  transport: `smtps://email:emailpassword@smtp.email.com`,
 
  emails: {confirm:sender}
})


function sender (options) {
  return `<div>
  
   <p>*This message is from the contact page of Yomify.com. Kindly attend to it ASAP *</p>

    <p>Customer name:  ${options.name}</p>
    <p>Customer email:  ${options.email}</p>
    
    <p><b>Subject:  ${options.subject}</b></p>
    <p>Message:  ${options.message}</p>
    <p>*Bye*</p>
     </div>`
}


//=========END OF EMAIL CONFIG

//App unique data/routes

app.get("/", function(req,res){
    
    res.render("home");
});


app.get("/index", function(req,res){
    
    res.render("index");
});


app.get("/about", function(req,res){
    
    res.render("about");
});

app.get("/works", function(req,res){
    
    res.render("works");
});


app.get("/services", function(req,res){
    
    res.render("services");
});

app.get("/contact", function(req,res){
    
    res.render("contact");
});


app.get("/contactres", function(req,res){
    
    res.render("contactres");
});

app.post("/contact", function(req,res){
    
    var contact=req.body.contact;
    console.log(contact);
    
     
                    mail.confirm({
                                  name:contact.name,
                                 email:contact.email,
                                  message:contact.message,
                                  subject:contact.subject,
                                  to:"youremail"
                                }, function (err) {
                                  if (err){res.send(err);console.log(err);
                                }else { res.render("contactres")}})

});





app.get("*", function(req,res){
    
    res.render("notfound");
});



 
 
 //server listening ======================================
app.listen (process.env.PORT, process.env.IP, function(){
   console.log("The APP1  Server has Started!");
         });
         
//======================================================