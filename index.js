var express = require('express');
const cors = require("cors");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;
// var allRoutes = require('./controllers');

// Requiring our models for syncing
var db = require('./models');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cors({
//     origin:["http://localhost:3000"]
// }));
app.use(cors({
    origin:["https://joes-baseball-frontend.herokuapp.com"]
}));
// Static directory
// app.use(express.static('public'));

// var exphbs = require('express-handlebars');
// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');

// app.use('/',allRoutes);

app.get("/",(req,res)=>{
    res.send("welcome to my api!")
})


app.get("/api/players",(req,res)=>{
    db.Player.findAll().then(players=>{
        res.json(players)
    })
})

app.post("/api/players",(req,res)=>{
    db.Player.create(req.body).then(player=>{
        res.json(player)
    })
})

app.get("/api/players/:id",(req,res)=>{
    db.Player.findOne({
        where:{
            id:req.params.id
        }
    }).then(player=>{
        res.json(player)
    })
})

app.put("/api/players/:id",(req,res)=>{
    db.Player.update(
        req.body,
        {
            where:{
                id:req.params.id
            }
        }
    ).then(playerData=>{
        res.json(playerData);
    })
})

app.delete("/api/players/:id",(req,res)=>{
    db.Player.destroy({
        where:{
            id:req.params.id
        }
    }).then(data=>{
        res.json(data)
    })
})

db.sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});