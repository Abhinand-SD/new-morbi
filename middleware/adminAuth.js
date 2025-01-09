const checkSession = (req, res, next) => {
  if (!req.session.admin) {
    res.redirect("/admin/login");
  } else {
    next();
  }
};

module.exports = { checkSession };
