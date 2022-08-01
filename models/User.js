const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const winston = require('winston');

const logger = winston.createLogger();

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,
        unique : 1
    }, 
    password : {
        type : String,
        minlength : 5
    }, 
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image : String,
    token : {
        type : String
    }, 
    tokenExp : {
        type : Number
    }
})

userSchema.pre('save',function(next){
    var user = this;

    if(user.isModified('password')) {
        //비밀번호를 암호화 시킨다
        bcrypt.genSalt(saltRounds, function(err, salt) {

            if(err) {
                return next(err);
            }

            bcrypt.hash(user.password, salt, function(err, hash) {

                if(err) {
                    return next(err);
                }

                user.password = hash;
                logger.info("----->" + hash);
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function(planePassword, cbf) {

    //planePassword -> Bcrypt암호화 비밀번호
    logger.info("---->" + planePassword);
    logger.info("---->" + this.password);

    bcrypt.compare(planePassword, this.password, function(err, isMatch) {
        logger.info("---->" + isMatch);
        if(err) {
            return cbf(err);
        } else {
            cbf(null, isMatch)  
        }
    })
}

userSchema.methods.generateToken = function(cb) {

    var user = this;

    //jsonwebToken을 이용한 token 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    //token = user._id + 'secretToken'
    //->
    //'secretToken' -> user._id

    user.token = token;
    user.save(function(err, user) {
        if(err) {
            return cb(err);
        } else {
            cb(null, user);
        }
    })
}

const User = mongoose.model('User', userSchema)

module.exports = {User};