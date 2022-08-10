const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {auth} = require("./middleware/auth");
const {User} = require("./models/User");
const winston = require('winston');

const logger = winston.createLogger();

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true}));
//application/json
app.use(bodyParser.json());

app.use(cookieParser());

const config = require('./config/key');

const mongoose = require('mongoose');
const { loggers } = require('winston');

mongoose.connect(config.mongoURI, {
  useNewUrlParser : true,
  useUnifiedTopology : true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!!')
})

app.post('/api/users/register', (req,res) => {
  //회원가입 할때 필요한 정보들을 Client에서 가져오면 
  //정보들을 DB에 넣어준다.

  const user = new User(req.body);

  user.save((err, doc) => {
    if(err) {
      return res.json({success : false, err})
    } 

    return res.status(200).json ({
      success : true
    })
  })
})

app.post('/api/users/login', (req, res) => {

  //요청된 아이디를 DB에서 찾는다
  User.findOne({email : req.body.email}, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess : false,
        message : "입력한 아이디에 해당하는 유저가 없습니다."
      })
    }

    logger.info("---->" + req.body.email);
    logger.info("---->" + user.email);

    //요청된 아이디가 DB에 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err,isMatch) => {
      if(!isMatch) {
        return res.json({
          loginSuccess : false,
          message : "비밀번호가 틀렸습니다."
        })
      }

      //유저 Token생성
      user.generateToken((err,user) => {
        if(err) {
          return res.status(400).send(err);
        }

        //Token을 저장한다. cookie, localStorage, session
        //cookie
        res.cookie("x_auth",user.token)
        .status(200)
        .json({loginSuccess : true, userId : user._id});

      })
    })
  })
})

app.get('/api/users/auth', auth , (req, res) => {

  // Authentication True
  res.status(200).json({
    _id : req.user._id 
    , isAdmin : req.user.role === 0 ? false : true
    , isAuth : true
    , email : req.user.email
    , name : req.user.name
    , lastname : req.user.lastname
    , role : req.user.role
    , image : req.user.image
  })
})

app.get('/api/users/logout', auth , (req, res) => {

  User.findOneAndUpdate({"_id"  : req.user._id}, {token : ""}, (err, user) => {
    if(err) {
      res.json({success : false, err});
      return;
    }

    res.status(200).send({
      success : true
    })
    return;
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})