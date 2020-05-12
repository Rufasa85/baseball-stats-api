var express = require('express');
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
var SequelizeStore = require('connect-session-sequelize')(session.Store);
require("dotenv").config();
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

app.use(session(
    { 
      secret: process.env.SESSION_SECRET, 
      store: new SequelizeStore({
        db:db.sequelize
      }),
      resave: false, 
      saveUninitialized: false,
      cookie : {
        maxAge:2*60*60*1000
      }
    }));
  
// app.use(cors({
//     origin: ["http://localhost:3000"],
//     credentials:true
// }));
app.use(cors({
    origin:["https://joes-baseball-frontend.herokuapp.com"],
    credentials:true
}));


app.get("/", (req, res) => {
    res.send("welcome to my api!")
})


app.get("/api/players", (req, res) => {
    db.Player.findAll().then(players => {
        res.json(players)
    })
})

app.post("/api/players", (req, res) => {
    if(req.session.user){

        db.Player.create(req.body).then(player => {
            res.json(player)
        })
    }else {
        res.status(401).send("log in first")
    }
})

app.get("/api/players/:id", (req, res) => {
    db.Player.findOne({
        where: {
            id: req.params.id
        }
    }).then(player => {
        res.json(player)
    })
})

app.put("/api/players/:id", (req, res) => {
    if (req.session.user) {

        db.Player.update(
            req.body,
            {
                where: {
                    id: req.params.id
                }
            }
        ).then(playerData => {
            res.json(playerData);
        })
    } else {
        res.status(401).send("log in first")
    }
})

app.delete("/api/players/:id", (req, res) => {
    if (req.session.user) {

        db.Player.destroy({
            where: {
                id: req.params.id
            }
        }).then(data => {
            res.json(data)
        }).catch(err => {
            console.log(err);
            res.json("error")
        })
    }
    else {
        res.status(401).json("log in first")
    }
})

app.post("/signup", (req, res) => {
    db.User.create(req.body).then(dbUser => {
        res.json(dbUser)
    }).catch(err => {
        res.status(500);
    })
})

app.post("/login", (req, res) => {
    db.User.findOne({
        where: {
            username: req.body.username
        }
    }).then(dbUser => {
        //check if password entered matches db password
        if (!dbUser) {
            req.session.user = false;
            res.send("no user found")
        } else if (bcrypt.compareSync(req.body.password, dbUser.password)) {
            //    res.send("logged in")
            req.session.user = {
                id: dbUser.id,
                username: dbUser.username
            }
            res.json(req.session)
        } else {
            req.session.user = false
            res.send("incorrect password")
        }
    }).catch(err => {
        req.session.user = false;
        res.status(500);
    })
})

app.get("/readsessions", (req, res) => {
    res.json(req.session)
})

app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.json("logged out!")
})

db.sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log('App listening on PORT ' + PORT);
    });
});