module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'You are not logged in');
      res.redirect('/Dlogin');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      if(req.user.userType=="1")
      res.redirect('/D_dashboard');
      else      
      res.redirect('/P_dashboard');
    }
  };