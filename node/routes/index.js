exports.index = function(req, res){
  res.render('index', { 
    title: 'ACME Fruit & Vegetable Stocks',
    subtitle: 'Oracle trigger > AMQP > Node.js > Socket.io' 
  });
};

exports.basic = function(req, res){
  res.render('basic', { 
    title: 'ACME Fruit & Vegetable Stocks'
  });
};

exports.pretty = function(req, res){
  res.render('pretty', { 
    title: 'ACME Fruit & Vegetable Stocks'
  });
};