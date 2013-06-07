var app = app || {};

var FruitList = Backbone.Collection.extend({

  model: app.Fruit,

  initialize: function() {
    //this.on( 'change', console.log("FruitList changed"), this );
  },

  update: function(newFruit) {

    var fruit = this.find(function(fruit) {
      return fruit.get('variety') === newFruit.variety;
    });

    fruit.set("sales", newFruit.sales);
  },

  getFruits: function() {
    var dataset = [];
    this.each(function(fruit){
      dataset.push({variety: fruit.get('variety'), sales: fruit.get('sales')});
    });
    return dataset;
  },

  getAverageSales: function() {
    var total = 0;
    var count = 0;
    this.each(function(fruit){
      total = total + fruit.get('sales');
      if(fruit.get('sales') > 0 && fruit.get('sales') != ''){
        count++;
      }
    });
    return Math.round((total / count * 100),2)/100;
  },

  localStorage: new Backbone.LocalStorage('fruits-backbone')

});

app.Fruits = new FruitList();