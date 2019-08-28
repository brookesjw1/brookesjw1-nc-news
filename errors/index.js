exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handle400s = (err, req, res, next) => {
//   console.log(err)
  const codes = ["22P02", "XtraProp"];
  if (codes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handle422s = (err, req, res, next) => {
    // console.log(err)
}

exports.handle405s = (req, res, next) => {
  res.status(405).send({msg: 'Method not allowed'})
}