// URL for the data
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Grab the data that I want for the first using d3.json() to grab the data from the URL
const samples = d3.json(url).then(data => data.samples);
const ids = d3.json(url).then(data => data.samples[0].otu_ids.slice(0, 10).reverse());
const values = d3.json(url).then(data => data.samples[0].sample_values.slice(0, 10).reverse());
const labels = d3.json(url).then(data => data.samples[0].otu_labels.slice(0, 10).reverse());



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

      // Update the chart data
      let updatedIds = selectedSample.otu_ids.slice(0, 10).reverse();
      let updatedValues = selectedSample.sample_values.slice(0, 10).reverse();
      let updatedLabels = selectedSample.otu_labels.slice(0, 10).reverse();

      // Update the chart
      updateChart(updatedIds, updatedValues, updatedLabels);
      updateBubbleChart(updatedIds, updatedValues, updatedLabels);
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
          color: ids.slice(0, 10).reverse(),
          colorscale: 'Earth'
        }
      };

      let layout = {
        title: 'Top 10 OTUs',
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU IDs' }
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
      colorscale: 'Earth',
    }
  };

  let layout = {
    title: 'OTUs Observed',
    xaxis: { title: 'OTU IDs' },
    yaxis: { title: 'Sample Values' }
  };

  let data = [trace];

  Plotly.newPlot('bubble', data, layout);
}

function updateSampleMetadata(selectedId) {
  let metadataPanel = d3.select("#sample-metadata");
  let selectedMetadata = metadata.find(item => item.id === selectedId);

Object.entries(selectedMetadata).forEach(([key, value]) => {metadataPanel.append("p").text(`${key}: ${value}`);});}

    // Event listener for dropdown change
    dropdown.on('change', function () {
      const selectedId = d3.select(this).property('value');
      optionChanged(selectedId);
    });
  });
