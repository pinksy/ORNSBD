var app = app || {};

app.AppView = Backbone.View.extend({

  //events: {
  //	'ondata': 'handleData' // does socket.io fire an event that we can handle here?
  //},

  initialize: function() {

    this.w = 300;
    this.h = 200;
    this.barPadding = 2;
    this.yTopPadding = 30;
    this.yBottomPadding = 20;		

    app.Fruits.add([
      {variety: "MANGO", sales: 0},
      {variety: "GRAPE", sales: 0},
      {variety: "CHERRY", sales: 0},
      {variety: "KIWI", sales: 0}
    ], {silent: true});

    this.createFruitSalesChart();
    this.createAverageFruitSalesChart();

    app.Vegetables.add([
      {variety: "POTATO", sales: 0},
      {variety: "LETTUCE", sales: 0},
      {variety: "PEPPER", sales: 0},
      {variety: "PUMPKIN", sales: 0}
    ], {silent: true});

    this.createVegetableSalesChart();
    this.createAverageVegetableSalesChart();

    var socket = io.connect('http://localhost');
    // would be better if backbone handled socket.io events natively
    window.app.socket = socket;
    var self = this;
    window.app.socket.on("data", function(data) {
      self.handleData(data);
    });
  },

  createFruitSalesChart: function() {

    var self = this;		
    var dataset = app.Fruits.getFruits();
    var variety = function(d) {
      return d.variety;
    };

    this.svgFruits = d3.select("#fruits")
                      .append("svg")
                      .attr("width", this.w)
                      .attr("height", this.h);

    this.xScale = d3.scale.ordinal()	
                    .domain(d3.range(dataset.length))
                    .rangeRoundBands([0, this.w], 0.05);

    this.yScale = d3.scale.linear()
                    .domain([0, 999])
                    .range([0, this.h - this.yTopPadding - this.yBottomPadding]);

    this.svgFruits.selectAll("rect")
                  .data(dataset, variety)
                  .enter()
                  .append("rect")
                  .attr("x", function(d, i) {
                    return self.xScale(i); 
                  })
                  .attr("y", function(d) {
                    return self.h - self.yScale(d.sales) - self.yBottomPadding;
                  })
                  .attr("width", 
                    self.xScale.rangeBand()
                  )
                  .attr("height", function(d) {
                    return self.yScale(d.sales);
                  })
                  .attr("fill", function(d) {
                    return "rgb(0, 0, " + (d.sales * 10) + ")";
                  });

    this.svgFruits.selectAll(".barLabel")
                  .data(dataset, variety)
                  .enter()
                  .append("text")
                  .text(function(d) {
                    return d.sales;
                  })
                  .attr("x", function(d, i) {
                    return self.xScale(i) + self.xScale.rangeBand() / 2 - 1; 
                  })
                  .attr("y", function(d) {
                    return self.h - self.yScale(d.sales) - 4 - self.yBottomPadding;
                  })
                  .attr("font-family", "Helvetica, Arial, sans-serif")
                  .attr("font-size", "11px")
                  .attr("text-anchor", "middle");

    this.svgFruits.selectAll(".xLabel")
                  .data(dataset, variety)
                  .enter()
                  .append("text")
                  .text(function(d) {
                    return d.variety;
                  })
                  .attr("x", function(d, i) {
                    return self.xScale(i) + self.xScale.rangeBand() / 2 - 1; 
                  })
                  .attr("y", function(d) {
                    return self.h;
                  })
                  .attr("font-family", "sans-serif")
                  .attr("font-size", "11px")
                  .attr("text-anchor", "middle");
  },

  updateFruitSalesChart: function() {

    var self = this;
    var yScale = d3.scale.linear()
                  .domain([0, 999])
                  .range([0, this.h - this.yTopPadding - this.yBottomPadding]); // not sure why I need to redefine this :(
    var dataset = app.Fruits.getFruits();
    var variety = function(d) {
      return d.variety;
    };

    this.svgFruits.selectAll("rect")
                  .data(dataset, variety)
                  .transition()	
                  .duration(200)
                  .ease("linear")
                  .attr("y", function(d) {
                    return self.h - yScale(d.sales) - self.yBottomPadding;
                  })
                  .attr("height", function(d) {
                    return self.yScale(d.sales);
                  })
                  .attr("fill", function(d) {  
                    return "rgb(" + Math.floor((1000 - d.sales) / 4) + ", " + Math.floor(d.sales / 4) + ", 0)";
                  });

    this.svgFruits.selectAll("text")
                  .data(dataset, variety)
                  .transition() 
                  .duration(200)
                  .ease("linear")
                  .text(function(d) {
                    return d.sales;
                  })
                  .attr("y", function(d) {
                    return self.h - yScale(d.sales) - 4 - self.yBottomPadding;
                  });
  },

  createAverageFruitSalesChart: function() {

    var self = this;		
    this.avgFruitSales = [
      {time: '', avgSales: ''},
      {time: '', avgSales: ''},
      {time: '', avgSales: ''},
      {time: '', avgSales: ''}
    ];
    var time = function(d) {
      return d.time;
    };

    this.svgAvgFruits = d3.select("#avgFruits")
                          .append("svg")
                          .attr("width", this.w)
                          .attr("height", this.h);

    /* use the same xScale and yScale functions for now, for consistency */

    this.svgAvgFruits.selectAll("rect")
                    .data(this.avgFruitSales, time)
                    .enter()
                    .append("rect")
                    .attr("x", function(d, i) {
                      return self.xScale(i); 
                    })
                    .attr("y", function(d) {
                      return self.h - self.yScale(d.avgSales) - self.yBottomPadding;
                    })
                    .attr("width", 
                      self.xScale.rangeBand()
                    )
                    .attr("height", function(d) {
                      return self.yScale(d.avgSales);
                    })
                    .attr("fill", function(d) {
                      return "rgb(135,206,250)";
                    });

    this.svgAvgFruits.selectAll(".avgBarLabel")
                    .data(this.avgFruitSales, time)
                    .enter()
                    .append("text")
                    .text(function(d) {
                      return d.avgSales;
                    })
                    .attr("x", function(d, i) {
                      return self.xScale(i) + self.xScale.rangeBand() / 2 - 1; 
                    })
                    .attr("y", function(d) {
                      return self.h - self.yScale(d.avgSales) - 4 - self.yBottomPadding;
                    })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "11px")
                    .attr("text-anchor", "middle");

    this.svgAvgFruits.selectAll(".xLabel")
                    .data(this.avgFruitSales, time)
                    .enter()
                    .append("text")
                    .text(function(d) {
                      return d.time;
                    })
                    .attr("x", function(d, i) {
                      return self.xScale(i) + self.xScale.rangeBand() / 2 - 1; 
                    })
                    .attr("y", function(d) {
                      return self.h;
                    })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "11px")
                    .attr("text-anchor", "middle");
  },

  updateAverageFruitSalesChart: function(obj) {

    var self = this;
    var yScale = d3.scale.linear()
                  .domain([0, 999])
                  .range([0, this.h - this.yTopPadding - this.yBottomPadding]); // not sure why I need to redefine this :(		
    this.avgFruitSales.push(obj);
    this.avgFruitSales.shift();
    var time = function(d) {
      return d.time;
    };

    //Select…
    var bars = this.svgAvgFruits.selectAll("rect").data(this.avgFruitSales, time);
    var labels = this.svgAvgFruits.selectAll("text").data(this.avgFruitSales, time);
    var xLabels = this.svgAvgFruits.selectAll(".xLabel").data(this.avgFruitSales, time);

    //Enter…
    bars.enter()
        .append("rect")
        .attr("x", this.w)
        .attr("y", function(d) {
          return self.h - yScale(d.avgSales) - self.yBottomPadding;
        })
        .attr("width", self.xScale.rangeBand())
        .attr("height", function(d) {
          return self.yScale(d.avgSales);
        })
        .attr("fill", function(d) {
          return "rgb(135,206,250)";
        });
    labels.enter()
          .append("text")
          .text(function(d) {
            return d.avgSales;
          })
          .attr("x", function(d, i) {
            return self.w + self.xScale.rangeBand() / 2 - 1; 
          })
          .attr("y", function(d) {
            return self.h - yScale(d.avgSales) - 4 - self.yBottomPadding;
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("text-anchor", "middle");
    xLabels.enter()
          .append("text")
          .text(function(d) {
            return d.time.substr(0, d.time.lastIndexOf(":"));
          })
          .attr("x", function(d, i) {
            return self.w + self.xScale.rangeBand() / 2 - 1; 
          })
          .attr("y", function(d) {
            return self.h;
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("text-anchor", "middle");

    //Update…
    bars.transition()
        .duration(200)
        .attr("x", function(d, i) {
          return self.xScale(i);
        })
        .attr("y", function(d) {
          return self.h - yScale(d.avgSales) - self.yBottomPadding;
        })
        .attr("width", self.xScale.rangeBand())
        .attr("height", function(d) {
          return yScale(d.avgSales);
        });
    labels.transition()
          .duration(200)
          .text(function(d) {
            return d.avgSales;
          })
          .attr("x", function(d, i) {
            return self.xScale(i) + self.xScale.rangeBand() / 2 - 1;
          })
          .attr("y", function(d) {
            return self.h - yScale(d.avgSales) - 4 - self.yBottomPadding;
          });
    xLabels.transition()
          .duration(200)
          .text(function(d) {
            return d.time.substr(0, d.time.lastIndexOf(":"));
          })
          .attr("x", function(d, i) {
            return self.xScale(i) + self.xScale.rangeBand() / 2 - 1;
          })
          .attr("y", function(d) {
            return self.h;
          });

    //Exit…
    bars.exit()
        .transition()
        .duration(200)
        .attr("x", -self.xScale.rangeBand())  
        .remove();
    labels.exit()
          .transition()
          .duration(200)
          .attr("x", -self.xScale.rangeBand() + self.xScale.rangeBand() / 2 - 1)  
          .remove();
    xLabels.exit()
          .transition()
          .duration(200)
          .attr("x", -self.xScale.rangeBand() + self.xScale.rangeBand() / 2 - 1)  
          .remove();
  },

  //============

  createVegetableSalesChart: function() {

    var self = this;		
    var dataset = app.Vegetables.getVegetables();
    var variety = function(d) {
      return d.variety;
    };

    this.svgVegetables = d3.select("#vegetables")
                          .append("svg")
                          .attr("width", this.w)
                          .attr("height", this.h);

    /* use the same xScale and yScale functions for now, for consistency */

    this.svgVegetables.selectAll("rect")
                      .data(dataset, variety)
                      .enter()
                      .append("rect")
                      .attr("x", function(d, i) {
                        return self.xScale(i); 
                      })
                      .attr("y", function(d) {
                        return self.h - self.yScale(d.sales) - self.yBottomPadding;
                      })
                      .attr("width", 
                        self.xScale.rangeBand()
                      )
                      .attr("height", function(d) {
                        return self.yScale(d.sales);
                      })
                      .attr("fill", function(d) {
                        return "rgb(0, 0, " + (d.sales * 10) + ")";
                      });

    this.svgVegetables.selectAll(".barLabel")
                      .data(dataset, variety)
                      .enter()
                      .append("text")
                      .text(function(d) {
                        return d.sales;
                      })
                      .attr("x", function(d, i) {
                        return self.xScale(i) + self.xScale.rangeBand() / 2 - 1; 
                      })
                      .attr("y", function(d) {
                        return self.h - self.yScale(d.sales) - 4 - self.yBottomPadding;
                      })
                      .attr("font-family", "sans-serif")
                      .attr("font-size", "11px")
                      .attr("text-anchor", "middle");

    this.svgVegetables.selectAll(".xLabel")
                      .data(dataset, variety)
                      .enter()
                      .append("text")
                      .text(function(d) {
                        return d.variety;
                      })
                      .attr("x", function(d, i) {
                        return self.xScale(i) + self.xScale.rangeBand() / 2 - 1; 
                      })
                      .attr("y", function(d) {
                        return self.h;
                      })
                      .attr("font-family", "sans-serif")
                      .attr("font-size", "11px")
                      .attr("text-anchor", "middle");
  },

  updateVegetableSalesChart: function() {

    var self = this;
    var yScale = d3.scale.linear()
                  .domain([0, 999])
                  .range([0, this.h - this.yTopPadding - this.yBottomPadding]); // not sure why I need to redefine this :(
    var dataset = app.Vegetables.getVegetables();
    var variety = function(d) {
      return d.variety;
    };

    this.svgVegetables.selectAll("rect")
                      .data(dataset, variety)
                      .transition()	
                      .duration(200) 
                      .ease("linear")
                      .attr("y", function(d) {
                        return self.h - yScale(d.sales) - self.yBottomPadding;
                      })
                      .attr("height", function(d) {
                        return self.yScale(d.sales);
                      })
                      .attr("fill", function(d) {  
                        return "rgb(" + Math.floor((1000 - d.sales) / 4) + ", " + Math.floor(d.sales / 4) + ", 0)";
                      });

    this.svgVegetables.selectAll("text")
                      .data(dataset, variety)
                      .transition() 
                      .duration(200)
                      .ease("linear")
                      .text(function(d) {
                        return d.sales;
                      })
                      .attr("y", function(d) {
                        return self.h - yScale(d.sales) - 4 - self.yBottomPadding;
                      });
  },

  createAverageVegetableSalesChart: function() {

    var self = this;		
      this.avgVegetableSales = [
      {time: '', avgSales: ''},
      {time: '', avgSales: ''},
      {time: '', avgSales: ''},
      {time: '', avgSales: ''}
    ];
    var time = function(d) {
      return d.time;
    };

    this.svgAvgVegetables = d3.select("#avgVegetables")
                              .append("svg")
                              .attr("width", this.w)
                              .attr("height", this.h);

    /* use the same xScale and yScale functions for now, for consistency */

    this.svgAvgVegetables.selectAll("rect")
                        .data(this.avgVegetableSales, time)
                        .enter()
                        .append("rect")
                        .attr("x", function(d, i) {
                          return self.xScale(i); 
                        })
                        .attr("y", function(d) {
                          return self.h - self.yScale(d.avgSales) - self.yBottomPadding;
                        })
                        .attr("width", 
                          self.xScale.rangeBand()
                        )
                        .attr("height", function(d) {
                          return self.yScale(d.avgSales);
                        })
                        .attr("fill", function(d) {
                          return "rgb(135,206,250)";
                        });

    this.svgAvgVegetables.selectAll(".avgBarLabel")
                        .data(this.avgVegetableSales, time)
                        .enter()
                        .append("text")
                        .text(function(d) {
                          return d.avgSales;
                        })
                        .attr("x", function(d, i) {
                          return self.xScale(i) + self.xScale.rangeBand() / 2 - 1; 
                        })
                        .attr("y", function(d) {
                          return self.h - self.yScale(d.avgSales) - 4 - self.yBottomPadding;
                        })
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "11px")
                        .attr("text-anchor", "middle");

    this.svgAvgVegetables.selectAll(".xLabel")
                        .data(this.avgVegetableSales, time)
                        .enter()
                        .append("text")
                        .text(function(d) {
                          return d.time;
                        })
                        .attr("x", function(d, i) {
                          return self.xScale(i) + self.xScale.rangeBand() / 2 - 1; 
                        })
                        .attr("y", function(d) {
                          return self.h;
                        })
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "11px")
                        .attr("text-anchor", "middle");
  },

  updateAverageVegetableSalesChart: function(obj) {

    var self = this;
    var yScale = d3.scale.linear()
                  .domain([0, 999])
                  .range([0, this.h - this.yTopPadding - this.yBottomPadding]); // not sure why I need to redefine this :(		
    this.avgVegetableSales.push(obj);
    this.avgVegetableSales.shift();
    var time = function(d) {
      return d.time;
    };

    //Select…
    var bars = this.svgAvgVegetables.selectAll("rect").data(this.avgVegetableSales, time);
    var labels = this.svgAvgVegetables.selectAll("text").data(this.avgVegetableSales, time);
    var xLabels = this.svgAvgVegetables.selectAll(".xLabel").data(this.avgVegetableSales, time);

    //Enter…
    bars.enter()
        .append("rect")
        .attr("x", this.w)
        .attr("y", function(d) {
          return self.h - yScale(d.avgSales) - self.yBottomPadding;
        })
        .attr("width", self.xScale.rangeBand())
        .attr("height", function(d) {
          return self.yScale(d.avgSales);
        })
        .attr("fill", function(d) {
          return "rgb(135,206,250)";
        });
    labels.enter()
          .append("text")
          .text(function(d) {
            return d.avgSales;
          })
          .attr("x", function(d, i) {
            return self.w + self.xScale.rangeBand() / 2 - 1; 
          })
          .attr("y", function(d) {
            return self.h - yScale(d.avgSales) - 4 - self.yBottomPadding;
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("text-anchor", "middle");
    xLabels.enter()
          .append("text")
          .text(function(d) {
            return d.time.substr(0, d.time.lastIndexOf(":"));
          })
          .attr("x", function(d, i) {
            return self.w + self.xScale.rangeBand() / 2 - 1; 
          })
          .attr("y", function(d) {
            return self.h;
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("text-anchor", "middle");

    //Update…
    bars.transition()
        .duration(200)
        .attr("x", function(d, i) {
          return self.xScale(i);
        })
        .attr("y", function(d) {
          return self.h - yScale(d.avgSales) - self.yBottomPadding;
        })
        .attr("width", self.xScale.rangeBand())
        .attr("height", function(d) {
          return yScale(d.avgSales);
        });
    labels.transition()
          .duration(200)
          .text(function(d) {
            return d.avgSales;
          })
          .attr("x", function(d, i) {
            return self.xScale(i) + self.xScale.rangeBand() / 2 - 1;
          })
          .attr("y", function(d) {
            return self.h - yScale(d.avgSales) - 4 - self.yBottomPadding;
          });
    xLabels.transition()
          .duration(200)
          .text(function(d) {
            return d.time.substr(0, d.time.lastIndexOf(":"));
          })
          .attr("x", function(d, i) {
            return self.xScale(i) + self.xScale.rangeBand() / 2 - 1;
          })
          .attr("y", function(d) {
            return self.h;
          });

    //Exit…
    bars.exit()
        .transition()
        .duration(200)
        .attr("x", -self.xScale.rangeBand())  
        .remove();
    labels.exit()
          .transition()
          .duration(200)
          .attr("x", -self.xScale.rangeBand() + self.xScale.rangeBand() / 2 - 1)  
          .remove();
    xLabels.exit()
          .transition()
          .duration(200)
          .attr("x", -self.xScale.rangeBand() + self.xScale.rangeBand() / 2 - 1)  
          .remove();
  },

  //============

  render: function() {
  },

  handleData: function(data) {

    console.log(data);

    var date = new Date();
    var hours = date.getHours().toString().length < 2 ? "0" + date.getHours() : date.getHours();
    var mins = date.getMinutes().toString().length < 2 ? "0" + date.getMinutes() : date.getMinutes();
    var secs = date.getSeconds().toString().length < 2 ? "0" + date.getSeconds() : date.getSeconds();
    var time = hours + ":" + mins + ":" + secs + ":" + date.getMilliseconds();

    var obj = jQuery.parseJSON(data);
    var type = obj.type;
    if(type === "fruit") {
      app.Fruits.update({variety: obj.name, sales: obj.sales});

      var newAvg = app.Fruits.getAverageSales();
      this.updateFruitSalesChart();
      this.updateAverageFruitSalesChart({time: time, avgSales: newAvg});
    }
    else {
      app.Vegetables.update({variety: obj.name, sales: obj.sales});

      var newAvg = app.Vegetables.getAverageSales();
      this.updateVegetableSalesChart();
      this.updateAverageVegetableSalesChart({time: time, avgSales: newAvg});
    }
  }
});