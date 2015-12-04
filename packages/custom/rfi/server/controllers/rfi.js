'use strict';

/**
 * Module dependencies.
 */


var mongoose = require('mongoose'),
  Rfi = mongoose.model('Rfi'),
  Business = mongoose.model("Business"),
  User = mongoose.model("User")
 /* _ = require('lodash');*/
/**
 * Create an article
 */
exports.create = function(req, res) {
  var rfi = new Rfi(req.body);
console.log("rfi");
  console.log(rfi);
  rfi.user = req.user;
  
  var user= User.find({'email': rfi.to},function (err, data){
    console.log("user");
    console.log(data);
  });

  var response = {
    msg: 'RFI has been successfully sent',
    status: 'success'
  };
  /*rfi.save(function(err) {
    if (err) {
      console.log('problem '+err);
      response.msg = 'Problem Occured While Saving RFI';
      response.status = 'error';
      return res.json(response);
    }
  });*/
};


exports.getbusinessname = function(req, res) {
  var query = req.query;
  
  //var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio'];
  var results = '{"name" :[]}';
  var obj = JSON.parse(results);
  //obj['name'].push("Accenture", "ZS Infotech", "HCL", "TCS", "WIPRO", "Amdocs");

  Business.find({businessname: new RegExp(query.value, 'i')}, function(err, data) {
    if (err) throw err;
    
    data.map(function(item){
      obj['name'].push(item.businessname);
    });
  res.json(obj);
  });
};
