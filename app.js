const express = require('express')
const app = express()

const cookieParser = require("cookie-parser")
const { v4: uuidv4 } = require('uuid')
const matchCredentials = require('./utils.js')

const {User, sessions} = require('./db.js')

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

// show home with forms

app.get('/', function(req, res){
    res.render('pages/home')
})

// create

app.post('/create', async function(req, res){
    let body = req.body

    const user = await User.create({
        username: body.username,
        password: body.password
    })
    console.log(user.toJSON())
    res.render('pages/home')
})

// login
app.post('/login', async function(req, res){
    if (await matchCredentials(req.body)) {
        let user = User
        // this creates a random id that is,
        // for all practical purposes,
        // guaranteed to be unique. We’re
        // going to use it to represent the
        // logged in user, and their session
        let id = uuidv4()
        // create session record
        // Use the UUID as a key
        // for an object that holds
        // a pointer to the user
        // and their time of login.
        // If we have any data that we
        // want to hold that doesn’t belong in
        // database, can put it here as well.
        sessions[id] = {
            user: user,
            timeOfLogin: Date.now()
        }
        // create cookie that holds the UUID (the Session ID)
        res.cookie('SID', id, {
            expires: new Date(Date.now() + 900000),
            httpOnly: true
        })
        res.render('pages/home')
    } else {
        res.redirect('/error')
    }
})

// this is the logout route
app.post('/logout', function(req, res){
    let id = req.cookies.SID
    let session = sessions[id]
    if(session){
        res.cookie('SID', id, {
            expires: new Date(Date.now()),
            httpOnly: true
            })
        res.clearCookie()
        res.render('pages/home')
        console.log('logout')
    }else{
        console.log('error')
    }
})

// this is the protected route
app.get('/supercoolmembersonlypage', function(req, res){
    console.log(req.cookies)
    let id = req.cookies.SID
    // attempt to retrieve the session.
    // if session exists, get session
    // otherwise, session === undefined.
    let session = sessions[id]// if session is undefined, then
    // this will be false, and we get sent
    // to error.ejs
    if (session) {
        res.render('pages/members')
    } else {
        res.render('pages/error')
    }
})

// if something went wrong, you get sent here
app.get('/error', function(req, res){
        res.render('pages/error')
    })

// 404 handling
app.all('*', function(req, res){
    res.render('pages/error')
})

app.listen(1612)