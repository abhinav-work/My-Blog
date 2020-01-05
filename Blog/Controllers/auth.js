const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check')
// const nodemailer = require('nodemailer');
// const sendGridTransport = require('nodemailer-sendgrid-transport');

// const transporter = nodemailer.createTransport(sendGridTransport({
//     auth: {
//         api_key: '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'
//     }
// }));


exports.getLogin = (req, res, next) => {
    if(req.session.isLoggedIn)
    {
        return res.redirect('/')
    }
    let message = req.flash('error');
    if(message.length > 0)
    {
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('auth/login', {
    pageTitle: "Login",
    errorMessage: message
    });
}


exports.postLogin = (req, res, next) => {
    //5da1ed93a01b4f39846ce9d7
    User.findOne({email: req.body.email})
        .then(user => {
                        if(!user)
                        {
                            req.flash('error', 'Invalid email or password');
                            return res.redirect('/login')
                        }
                        bcrypt.compare(req.body.password, user.password)
                                .then(matchFound => {
                                        if(!matchFound)
                                        {
                                            req.flash('error', 'Invalid email or password');
                                            return res.redirect('/login');
                                        }
                                        req.session.isLoggedIn = true;
                                        console.log("Master " + user.master)
                                        if(user.master)
                                        {
                                            req.session.isMaster = true;
                                        }
                                        else{
                                            req.session.isMaster = false;
                                        }
                                        console.log("is master " + req.session.isMaster)
                                        req.session.user = user;
                                        return req.session.save(err => {
                                            console.log(err)
                                            res.redirect('/');   
                                            })
                                        })
                                .catch(err => {
                                    console.log(err)
                                    const error = new Error(err);
                                    error.httpStatusCode = 500;
                                    return next(error)
                                });
                        })
        .catch(err => console.log(err));
  
}
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/')
    })
}

exports.getSignUp = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/')
    }
     let message = req.flash('error');
     if (message.length > 0) 
        {
             message = message[0];
        } else {
         message = null;
        }
    res.render('auth/signup', {
        pageTitle: "Sign Up",
        nameF: req.body.nameF,
        nameL: req.body.nameL,
        age: req.body.age,
        biography: req.body.biography,
        gender: req.body.gender,
        emailS: req.body.email,
        password1: req.body.password,
        password2: req.body.confirmpassword,
        errorMessage: message,
        validationErr: []
    });
}

exports.postSignUp = (req, res, next) => {
    const nameF = req.body.nameF;
    const nameL = req.body.nameL;
    const email = req.body.email;
    const age = req.body.age ;
    const biography = req.body.biography ;
    const gender = req.body.gender;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    console.log(nameF + nameL + email + age + biography + gender + password)
    const error = validationResult(req)
    if(!error.isEmpty())
    {
        console.log(error);
        return res.status(422).render('auth/signup', {
            pageTitle: "Sign Up",
            nameF: req.body.nameF,
            nameL: req.body.nameL,
            age: req.body.age,
            biography: req.body.biography,
            gender: req.body.gender,
            emailS: req.body.email,
            password1: req.body.password,
            password2: req.body.confirmpassword,
            errorMessage: error.array()[0].msg,
            validationErr: error.array()
        });
    }
         bcrypt.hash(password, 12)
                        .then(hashedPassword => {
                                                    console.log(hashedPassword)
                                                    const newUser = new User({
                                                         first_name: nameF,
                                                         last_name: nameL,
                                                         bio: biography,
                                                         gender: gender,
                                                         age: age,
                                                         email: email,
                                                         password: hashedPassword,
                                                         created_at: Date.now(),
                                                         updated_at: Date.now()
                                                    })
                                                return newUser.save();
                        })
                        .then(result => {
                                            res.redirect('/login');
                                            })
                                            .then(result => {
                                                console.log("Mail Sent")
                                            })
                        })
                        .catch(err => {
                            console.log(err)
                            const error = new Error(err);
                            error.httpStatusCode = 500;
                            return next(error)
                        });
}
