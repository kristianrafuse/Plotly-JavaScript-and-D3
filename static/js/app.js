// URL for the data

let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// check the JSON data

// d3.json(url).then(data => {console.log(data)})

// grab the data that I want and test with console log
// TESTING //
 
const samples = d3.json(url).then(data => data.samples);
 
const ids = d3.json(url).then(data => data.samples[0].otu_ids.slice(0, 10).reverse());
  
const values = d3.json(url).then(data => data.samples[0].sample_values.slice(0, 10).reverse());
  
const labels = d3.json(url).then(data => data.samples[0].otu_labels.slice(0, 10).reverse());

// check to see if I have the data that I want 
// TESTING //

console.log("Samples", samples) 
console.log("Ids", ids) 
console.log("Values", values)
console.log("Labels", labels) 

// TESTING COMPLETE ///


// Grab the JSON data in order initialize the chart.

d3.json(url)
  .then(data => {
    
    // Extract necessary data from the JSON
    const samples = data.samples;

    // Create the dropdown menu
    
    const dropdown = d3.select('#selDataset'); //heavily relied on ChatGPT to handle this dropdown.selectAll('option') section here. 
    dropdown.selectAll('option')
      .data(samples)
      .enter()
      .append('option')
      .attr('value', d => d.id)
      .text(d => d.id);

    // Function to handle dropdown change event
    
        function optionChanged(selectedId) {
    
    // Find the selected sample
        const selectedSample = samples.find(sample => sample.id === selectedId);

        // Update the chart data
        const updatedIds = selectedSample.otu_ids.slice(0, 10).reverse();
        const updatedValues = selectedSample.sample_values.slice(0, 10).reverse();
        const updatedLabels = selectedSample.otu_labels.slice(0, 10).reverse();

    // Update the chart
        updateChart(updatedIds, updatedValues, updatedLabels);
    }

    // Call the function to initialize the chart with the first sample
    optionChanged(samples[0].id);

    // Function to update the chart
    function updateChart(ids, values, labels) {
      const trace = {
        x: values,
        y: ids.map(id => `OTU ${id}`),
        text: labels,
        type: 'bar',
        orientation: 'h'
      };

      const layout = {
        title: 'Top 10 OTUs',
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU IDs' }
      };

      const data = [trace];

      Plotly.newPlot('bar', data, layout);
    }

    // Event listener for dropdown change
    dropdown.on('change', function () {
      const selectedId = d3.select(this).property('value');
      optionChanged(selectedId);
    });
  })