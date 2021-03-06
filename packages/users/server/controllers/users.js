'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  async = require('async'),
  config = require('meanio').loadConfig(),
  crypto = require('crypto'),
  nodemailer = require('nodemailer'),
  templates = require('../template');


// Naveen code for email, 16/12/2014
  var nodemailer = require('nodemailer');
  var smtpTransport = nodemailer.createTransport(config.mailer);


/**
 * Sending email
 */
function sendMail(req, res, mailOptions) {
  smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                console.log('mail not sent : '+error);
                res.end('error');
                }else{
                console.log('Message sent: ' + response.message);
                res.end('sent');
                }
                });
}


/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
  res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.redirect('#!/login');
};

/**
 * Logout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
  res.redirect('/');
};



/**
 * Create user
 */
exports.create = function(req, res, next) {
  var user = new User(req.body);
  console.log('Business id is: '+req.body.business_id);
  if(req.body.business_id!==null)
  user.business_id=mongoose.Types.ObjectId(req.body.business_id);
  user.provider = 'local';

  // because we set our user.provider to local our models/user.js validation will always be true
  
  req.assert('firstname', 'You must enter a firstname').notEmpty();
  req.assert('email', 'You must enter a valid email address').isEmail();
  req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);  
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);  
  
  // Commeting below code as business is no more required while user registration
  /*req.assert('business_id', 'You must select a business to get associated with').notEmpty();*/

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }
  var randomNumber= crypto.randomBytes(8).toString('hex');
 
  user.activationtoken = randomNumber;
   console.log('User is: '+user);
  // Hard coded for now. Will address this with the user permissions system in v0.3.5
  user.roles = ['authenticated'];
  user.save(function(err) {
  
    if (err) {
      switch (err.code) {
        case 11000:
        case 11001:
          res.status(400).send([{
            msg: 'Business name already taken',
            param: 'business_id'       
          }]);
          break;
        default:
          var modelErrors = [];

          if (err.errors) {

            for (var x in err.errors) {
              modelErrors.push({
                param: x,
                msg: err.errors[x].message,
                value: err.errors[x].value
              });
            }

            res.status(400).send(modelErrors);
          }
      }
      console.log('checkpoint 1');
      return res.status(400);
    }
    console.log('checkpoint 2');
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');        
    });
    
    

                // Naveen code for email, 16/12/2014
          //var createActivationLink = function (user) {
                console.log('checkpoint 3');
                var mailOptions={
                to : user.email
                };
                mailOptions = templates.signup_email(user,mailOptions);
                sendMail(req, res, mailOptions);
           //   }

                


    res.status(200);
  });
};

exports.activate = function(req,res) {
  var token=req.params.activationtoken;
  console.log('----------ActivationToken is: '+token);
  User.findOne ( {activationtoken: token}, 
    function(err,user){ 
    console.log('User is:'+user);
    if(!user||err)     
    res.send('There was an error, User has not been activated');
    else if (user.isactive === true)
      res.send ('User was already active, cannot re-activate this user');
  else 
    { user.isactive=true;
      user.save();
      res.send ('User has been activated');
    }

    });
  
    /*if(user.activated) return (new Error ('This user is already activated'));
    user.activated = true;
*/
  };

/**
 * Send User
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
  User
    .findOne({
      _id: id
    })
    .exec(function(err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
};

/**
 * Resets the password
 */

exports.resetpassword = function(req, res, next) {
  User.findOne({
    email: req.params.token,
    resetPasswordRequested : true
  }, function(err, user) {
              var response = {
                  message: 'Invalid Request',
                  status: 'danger'
                };

              if (err) {
                console.log('error resetpassword 1');
                return res.json(response);
              }
              if (!user) {
                console.log('error resetpassword 2');
                return res.json(response);
              }
              req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
              req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
              var errors = req.validationErrors();
              if (errors) {
                console.log(errors);
                response.status = 'danger';
                response.message = 'Password must be between 8-20 characters long';

                return res.json(response);
              }
              user.password = req.body.password;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              user.resetPasswordRequested = false;
              user.save(function(err) {
                  if (err)
                  { 
                    response.message = 'Password reset failed';
                    return res.json(response);
                  }
                  response.status = 'success';
                  response.message = 'Password successfully changed';
                  return res.json(response);
              });
            });
};


/**
 * Callback for forgot password link
 */
exports.forgotpassword = function(req, res, next) {
  async.waterfall([

      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          console.log('check 1');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne( {
          $or: [{
            email: req.body.text
          }, {
            username: req.body.text
          }]
        }, function(err, User) {
          if (err || !User) return done(true);
          User.resetPasswordRequested = true;
          User.save();
          done(err, User, token);
        });
      },

      function(user, token, done) {
        var mailOptions = {
          to: req.body.text
        };

        //user.email = req.body.text;
        console.log('user mail is '+user);
        console.log('done  is '+token);
        mailOptions = templates.forgot_password_email(user, mailOptions);
        sendMail(req, res, mailOptions);
        done(null, true);         // Why it is here ?

      }

    ],
    function(err, status) {
      var response = {
        message: 'Mail successfully sent',
        status: 'success'
      };
      if (err) {
        response.message = 'Email does not exist';
        response.status = 'danger';
      }
      res.json(response);
    }
  );
};