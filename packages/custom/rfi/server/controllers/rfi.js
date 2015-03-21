'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Rfi = mongoose.model('Rfi');
 /* _ = require('lodash');*/



/**
 * Create an article
 */
exports.create = function(req, res) {
  console.log('came in servr cont');
  var rfi = new Rfi(req.body);
  rfi.user = req.user;
  var response = {
        msg: 'RFI has been successfully sent',
        status: 'success'
      };
  rfi.save(function(err) {
    if (err) {
      console.log('problem '+err);
      response.msg = 'Problem Occured While Saving RFI';
      response.status = 'error';
      return res.json(response);
    }
    console.log('run 4');
     res.json(response);

  });
};



