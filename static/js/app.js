// URL for the data
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Grab the data that I want for the first using d3.json() to grab the data from the URL I know I can chain all of this together...

// Retrieve the 'samples' data from the JSON URL
let samples = d3.json(url).then(data => data.samples);

// Retrieve the first 10 OTU IDs per the requirements, in reverse order from the 'samples' data to setup for using with Plotly
let ids = d3.json(url).then(data => data.samples[0].otu_ids.slice(0, 10).reverse());

// Retrieve the first 10 sample values per the requirements, in reverse order from the 'samples' data
let values = d3.json(url).then(data => data.samples[0].sample_values.slice(0, 10).reverse());

// Retrieve the first 10 OTU labels per the requirements, in reverse order from the 'samples' data
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

    // Function to update the bar chart
    function updateChart(ids, values, labels) {
      // Create the trace for the bar chart
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
        title: "<b>Top 10 OTUs</b><br><span style='font-size: 12px; color: gray;'>Microbes in the Human Navel</span>",
        xaxis: {title:'Sample Values'},
        yaxis: {title:'OTU IDs', zeroline: true, gridwidth: 1}
      };

      let data = [trace];

      // Create and update the bar chart
      Plotly.newPlot('bar', data, layout);
    }

    // Function to create and update the bubble chart
    function updateBubbleChart(ids, values, labels) {
    // Create the trace for the bubble chart
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
        title: "<b>Top 10 OTUs</b><br><span style='font-size: 12px; color: gray;'>Microbes in the Human Navel</span>",
        xaxis: { title: 'OTU IDs' },
        yaxis: { title: 'Sample Values', zeroline: true}
      };

      let data = [trace];

      // Create and update the bubble chart
      Plotly.newPlot('bubble', data, layout);
    }

    // Function to create and update the gauge chart reconstucted from Plotly examples. 
    function updateGauge(washingFrequency) {
      const data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: washingFrequency,
          title: {text: "<b>Belly Button Washing Frequency</b><br><span style='font-size: 12px; color: gray;'>Weekly Washing Frequency</span>"},
          gauge: {
            axis: { range: [0, 9], tickwidth: 1, tickcolor: "grey" },
            bar: { color: "rgba(100, 200, 100, 0.5)" },
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
        margin: { t: 94, r: 20, l: 20, b: 10 },
      };

      // Create and update the gauge chart
      Plotly.newPlot('gauge', data, layout);
    }

    // Function to update the sample metadata by selecting the HTML element with the ID "sample-metadata" using the d3.select() function 
    // and assigning it to the metadataPanel variable. Finds the metadata object that matches the selected ID by searching through 
    // the metadata array and retrieving the object where the id property matches the selectedId

    function updateSampleMetadata(selectedId) {
      let metadataPanel = d3.select("#sample-metadata");
      let selectedMetadata = metadata.find(item => item.id === parseInt(selectedId));

      // Clear the previous data in the panel
      metadataPanel.html("");

      // Display the selected sample metadata by iterating over the key-value pairs of the selectedMetadata object using the Object.entries() method.
      // For each key-value pair, a new paragraph element is created (<p>) using the append() method of the metadataPanel selection. 
      // The text content of the paragraph is set to ${key}: ${value}, where key represents the key of the current key-value pair 
      // and value represents the corresponding value. This displays the metadata information in a readable format on the webpage.


      Object.entries(selectedMetadata).forEach(([key, value]) => {
        metadataPanel.append("p")
        .text(`${key}: ${value}`);
      });
    }

    // Event listener for dropdown change
    dropdown.on('change', function () {
      const selectedId = d3.select(this)
      .property('value');
      optionChanged(selectedId);
    });
  });
