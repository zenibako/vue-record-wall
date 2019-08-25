

exports.get = function (req, res) {
  res.render(path.join(__dirname + '/dist/index.html'));
}
