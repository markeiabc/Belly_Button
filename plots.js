function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    let sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const defaultSample = sampleNames[0];
    optionChanged(defaultSample);
  })
}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var metaresult = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    Object.entries(metaresult).forEach(([key, value]) => {
      PANEL.append("h6").text(key + ': ' + value);
    });
  })
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var charts = data.samples;
    var resultArray = charts.filter(sampleObj => sampleObj.id == sample);
    var chartresult = resultArray[0];

    buildBubbleChart(chartresult)
    buildBarChart(chartresult)
  })
}

function buildBarChart(sample) {
  var barchartdata = []
  
  sample.otu_ids.forEach((id, i)=> {
    barchartdata.push({
      id: id,
      value: sample.sample_values[i],
      text: sample.otu_labels[i]
    });
  });
  // Sort top data
  var sortedbardata = barchartdata.sort((a,b)=> b.values - a.values);
  // Select top 10 bacteria
  var topTenBacteria = sortedbardata.slice(0,10);

  // Create a Bar Chart with the Arrays

  var trace = {
    x: topTenBacteria.map(row=> row.value).reverse(),
    y: topTenBacteria.map(row=> "OTU".concat(row.id)).reverse(),
    hoverinfo: topTenBacteria.map(row=>row.text).reverse(),
    type: "bar",
    orientation: "h"
  }

  var data = [trace]
  
  Plotly.newPlot("bar", data)
}

function buildBubbleChart(sample) {
  var trace1 = {
    x: sample.otu_ids,
    y: sample.sample_values,
    mode: 'markers',
    marker: {
      size: sample.sample_values,
      color: sample.otu_ids
    },
    text: sample.otu_labels,
  };
  
  var data = [trace1];
  
  var layout = {
    xaxis: {
      type: "linear",
      title: "OTU_ID",
      autorange: true
    },
    yaxis: {
      autorange: true,
      type: "linear"
    }
  };
  
  Plotly.newPlot("bubble", data, layout);
}


init();