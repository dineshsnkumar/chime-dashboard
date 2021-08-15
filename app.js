const express = require("express");
const ejs = require("ejs");
const { urlencoded } = require("express");
const mongoose = require('mongoose');
const port = 3000;

const app = express();
mongoose.connect('mongodb://localhost:27017/ticketsDB', {useNewUrlParser: true});

// Schema for Ticket
const ticketSchema = new mongoose.Schema({
    title: String,
    status: String,
    assignee: String,
    label: String,
    totalHours: String,
    hoursWorked:String,
    issue: String
  });

const Ticket = mongoose.model("Ticket", ticketSchema);

app.set('view engine', 'ejs');
app.use(urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", (req,res)=>{
    const assignesWorkLoadMap = new Map();
    let assigneesObj = []
    Ticket.find({}, function(err, tickets){
        tickets.forEach((ticket)=>{
            assignesWorkLoadMap.set(ticket.assignee, ticket.totalHours);
            assigneesObj.push(ticket.assignee);
        });
        const assignees = [...assignesWorkLoadMap.keys()];
        const totalHoursAssigned = [...assignesWorkLoadMap.values()];

        let assignessArray = Object.values(assigneesObj);

        console.log(totalHoursAssigned);

        if(err){
          console.log('Error in retreiving posts')
        }else{
        res.render('dashboard', {tickets:tickets, assignees: assignessArray,totalHoursAssigned:totalHoursAssigned });
        }
      });

});

app.get("/addTicket", (req,res)=>{
    res.render('addTicket');
});


app.post("/addTicket", (req,res)=>{
    const newTicket = new Ticket({
        title: req.body.title,
        status: req.body.status,
        assignee: req.body.assignee,
        label: req.body.label,
        totalHours:req.body.totalHours,
        hoursWorked:req.body.hoursWorked,
        issue: req.body.issue
    });
   newTicket.save();
   res.redirect('/');
})


app.listen(port, ()=>{
    console.log(`Dashboard app listening at port:${port}`);
});