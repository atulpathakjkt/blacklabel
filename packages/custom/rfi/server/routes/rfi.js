'use strict';

var rfi = require('../controllers/rfi');

// Article authorization helpers
/*var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.rfi.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};*/

module.exports = function(Articles, app, auth) {

  app.route('/rfi').post(rfi.create);

  /*app.get('/getbusinessname', function (req, res) {
    res.send('Get request');
  });*/
  
  app.route('/getbusinessname').get(rfi.getbusinessname);

  /*app.route('/articles/:articleId')
    .get(articles.show)
    .put(auth.requiresLogin, hasAuthorization, articles.update)
    .delete(auth.requiresLogin, hasAuthorization, articles.destroy);*/

  // Finish with setting up the articleId param
  /*app.param('articleId', articles.article);*/
};
