// Define the URL for the data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and create the chart
d3.json(url)
  .then(data => {
    // Extract necessary data from the JSON
    const samples = data.samples;
    const ids = samples[0].otu_ids.slice(0, 10).reverse();
    const values = samples[0].sample_values.slice(0, 10).reverse();
    const labels = samples[0].otu_labels.slice(0, 10).reverse();

    // Create the dropdown menu
    const dropdown = d3.select('#selDataset');
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
