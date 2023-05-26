// Get the samples data endpoint

let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it to test

let d3Output1 = d3.json(url).then((data) => console.log(data));

// Sort the data by Greek search results descending
let sortedData= data.sort((a, b) => b.sample_values - a.sample_values);

// Slice the first 10 objects for plotting
slicedData = sortedData.slice(0, 10);

// Reverse the array to accommodate Plotly's defaults
reversedData = slicedData.reverse();

// Trace1 for Data
let trace1 = {
  x: reversedData.map(object => object.sample_values),
  y: reversedData.map(object => object.otu_ids ),
  type: "bar",
  orientation: "h"
};


// Apply a title to the layout
let layout = {
    title: "Top 10 OTUs ",
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
  };
  
  // Render the plot to the div tag with id "plot"
  // Note that we use `traceData` here, not `data`
  Plotly.newPlot("plot", traceData, layout);