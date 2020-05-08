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
app.use(cors());
// Static directory
// app.use(express.static('public'));

// var exphbs = require('express-handlebars');
// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');

// app.use('/',allRoutes);

app.get("/",(req,res)=>{
    res.send("welcome to my api!")
})

app.get('/fakeplayers',(req,res)=>{
    res.json(
        [
            {
                id:1,
                name:"Joe Rehfuss",
                team: "New York Mets",
                at_bats: 300,
                singles:12,
                doubles:3,
                triples:0,
                home_runs:1,
                runs_batted_in: 3
            },
            {
                id:2,
                name:"Mike Trout",
                team: "Los Angeles Angels",
                at_bats: 300,
                singles:120,
                doubles:30,
                triples:3,
                home_runs:10,
                runs_batted_in: 50
            },
        ]
        )
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

db.sequelize.sync({ force: true }).then(function() {
    app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});