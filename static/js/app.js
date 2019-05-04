function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json('/metadata/'+sample).then(function(data){
  
    // Use d3 to select the panel with id of `#sample-metadata`
  var panel = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  panel = panel.html("");
  var row = panel.append("div");

  // Use `Object.entries` to add each key and value pair to the panel
  Object.entries(data).forEach(function([key,value]){
    //console.log(key,value);
    var cell = row.append("p");
    cell.text(key + ":" + value);
    
  });

  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ)
  });
}
function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/"+sample).then(function(data){
    //console.log(data);
  var id = data.otu_ids;
  var labels = data.otu_labels;
  var sample_values = data.sample_values;
  // @TODO: Build a Bubble Chart using the sample data
  var trace1 = {
    x: id,
    y: sample_values,
    mode: 'markers',
    marker: {
      size: sample_values,
      color:id
    },
    text: labels
  };
  var data = [trace1];

  Plotly.newPlot("bubble",data);

  var samp_val_sort = sample_values.sort(function compareFunction(one,two){
    return two - one;
  }).slice(0,10);

  console.log(sample_values)
  console.log(samp_val_sort)

  // @TODO: Build a Pie Chart
  var trace2 = {
    values: samp_val_sort,
    labels: id,
    type: 'pie'
  };
  var data2 = [trace2];

  var layout = {
    height: 400,
    width: 400
  };

  Plotly.newPlot("pie",data2,layout);
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
