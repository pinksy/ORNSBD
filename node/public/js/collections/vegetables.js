var app = app || {};

var VegetableList = Backbone.Collection.extend({

  model: app.Vegetable,

  initialize: function() {
    //this.on( 'change', console.log("VegetableList changed"), this );
  },

  update: function(newVegetable) {
    var vegetable = this.find(function(vegetable) {
      return vegetable.get('variety') === newVegetable.variety;
    });
    vegetable.set("sales", newVegetable.sales);
  },

  getVegetables: function() {
    var dataset = [];
    this.each(function(vegetable){
      dataset.push({variety: vegetable.get('variety'), sales: vegetable.get('sales')});
    });
    return dataset;
  },

  getAverageSales: function() {
    var total = 0;
    var count = 0;
    this.each(function(vegetable){
      total = total + vegetable.get('sales');
      if(vegetable.get('sales') > 0){
        count++;
      }
    });
    return Math.round((total / count * 100),2)/100;
  },

  localStorage: new Backbone.LocalStorage('fruits-backbone')

});

app.Vegetables = new VegetableList();