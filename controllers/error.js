exports.getNotFound = (req, res, next) => {
  res.status(404).render('not-found', {
    pageTitle: 'Page Not Found',
    path: '/error/not-found'
  });
}

exports.getGeneralError = (req, res, next) => {
  res.status(500).render('general-error', {
    pageTitle: 'General Error',
    path: '/error/general-error'
  });
}
