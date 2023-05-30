// URL for the data
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Grab the data that I want for the first using d3.json() to grab the data from the URL
let samples = d3.json(url).then(data => data.samples);
let ids = d3.json(url).then(data => data.samples[0].otu_ids.slice(0, 10).reverse());
let values = d3.json(url).then(data => data.samples[0].sample_values.slice(0, 10).reverse());
let labels = d3.json(url).then(data => data.samples[0].otu_labels.slice(0, 10).reverse());

// Print the data to check
console.log("Samples", samples);
console.log("Ids", ids);
console.log("Values", values);
console.log("Labels", labels);

// Grab the JSON data in order to setup the chart
d3.json(url)
  .then(data => {
    // Extract necessary data and metadata from the JSON
    let samples = data.samples;
    let metadata = data.metadata;

    console.log("Metadata", metadata)

    // Create the dropdown menu using the data-binding approach, options are appended based on the samples data array.
    // Each option is assigned a value and displayed as text.

    let dropdown = d3.select('#selDataset');
    dropdown.selectAll('option')
      .data(samples)
      .enter()
      .append('option')
      .attr('value', d => d.id)
      .text(d => d.id);

      // Function to handle dropdown change event
      function optionChanged(selectedId){
      
        // Find the selected sample
      let selectedSample = samples.find(sample => sample.id === selectedId);
      let selectedMetadata = metadata.find(meta => meta.id === parseInt(selectedId));

      // Update the chart data
      let updatedIds = selectedSample.otu_ids.slice(0, 10).reverse();
      let updatedValues = selectedSample.sample_values.slice(0, 10).reverse();
      let updatedLabels = selectedSample.otu_labels.slice(0, 10).reverse();
      let washingFrequency = selectedMetadata.wfreq;

      // Update the charts
      updateChart(updatedIds, updatedValues, updatedLabels);
      updateBubbleChart(updatedIds, updatedValues, updatedLabels);
      
      // Update the gauge chart
      updateGauge(washingFrequency);

      // Update the sample metadata
      updateSampleMetadata(selectedId);
    }
  
    // Call the function to initialize the chart with the first sample
    optionChanged(samples[0].id);

    // Function to update the chart // 'marker, color, colorscale' code comes from ChatGPT
    function updateChart(ids, values, labels) {
      let trace = {
        x: values,
        y: ids.map(id => `OTU ${id}`),
        text: labels,
        type: 'bar',
        orientation: 'h',
        marker: {
          color: ids.slice(0, 10),
          colorscale: 'Greens',
          line: {
            color: 'rgb(8,48,107)',
            width: 0.25
          }
        }
      };

      let layout = {
        title: 'Top 10 OTUs',
        xaxis: {title:'Sample Values'},
        yaxis: {title:'OTU IDs', zeroline: true, gridwidth: 1}
      };

      let data = [trace];

      Plotly.newPlot('bar', data, layout);
    }

// Setting up the creation of a bubble chart on div ID bubble

function updateBubbleChart(ids, values, labels) {
  let trace = {
    x: ids,
    y: values,
    text: labels,
    mode: 'markers',
    marker: {
      size: values,
      color: ids,
      colorscale: 'Greens',
      line: {
        color: 'rgb(8,48,107)',
        width: 0.25
      }
    }
  };

  let layout = {
    title: 'OTUs Observed',
    xaxis: { title: 'OTU IDs' },
    yaxis: { title: 'Sample Values', zeroline: true}
  };

  let data = [trace];

  Plotly.newPlot('bubble', data, layout);
}

function updateGauge(washingFrequency) {
  const data = [
    {
      type: "indicator",
      mode: "gauge+number",
      value: washingFrequency,
      title: {text: "Belly Button Washing Frequency", font:{ size: 17}},
      gauge: {
        axis: { range: [0, 9], tickwidth: 1, tickcolor: "grey" },
        bar: { color: "rgba(100, 200, 100, 0.5"},
        bgcolor: "white",
        borderwidth: 1,
        bordercolor: "gray",
        steps: [
          { range: [0, 1], color: "rgba(1, 100, 1, 0.15)"},
          { range: [1, 2], color: "rgba(2, 100, 2, 0.25)"},
          { range: [2, 3], color: "rgba(3, 100, 3, 0.35)"},
          { range: [3, 4], color: "rgba(4, 100, 4, 0.45)"},
          { range: [4, 5], color: "rgba(5, 100, 5, 0.55)"},
          { range: [5, 6], color: "rgba(6, 100, 6, 0.65)"},
          { range: [6, 7], color: "rgba(7, 100, 7, 0.75)"},
          { range: [7, 8], color: "rgba(8, 100, 8, 0.85)"},
          { range: [8, 9], color: "rgba(9, 100, 9, 0.95)"},
        ],
        threshold: {
          line: { color: "grey", width: 1 },
          thickness: 0.75,
          value: washingFrequency,
        },
  
      },
    },
  ];
  const layout = {
    width: 400,
    height: 300,
    margin: { t: 54, r: 10, l: 10, b: 10 },
  };

  Plotly.newPlot('gauge', data, layout);
}

function updateSampleMetadata(selectedId) {
  let metadataPanel = d3.select("#sample-metadata");
  let selectedMetadata = metadata.find(item => item.id === parseInt(selectedId));

// Display the selected sample metadata
// Referred to ChatGPT for this line below, as my demographics just keep adding more. This clears the previous data in the panel 
// before populating it with the code below.

metadataPanel.html("");

Object.entries(selectedMetadata).forEach(([key, value]) => {
  metadataPanel.append("p")
  .text(`${key}: ${value}`);
})
  ;}

    // Event listener for dropdown change
    dropdown.on('change', function () {
      const selectedId = d3.select(this)
      .property('value')
      ;optionChanged(selectedId);
    });
  });
