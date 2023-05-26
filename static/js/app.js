// URL for the data
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// check the JSON data

// d3.json(url).then(data => {console.log(data)})

// grab the data that I want and assign
 
const samples = d3.json(url).then(data => data.samples);
 
const ids = d3.json(url).then(data => data.samples[0].otu_ids.slice(0, 10).reverse());
  
const values = d3.json(url).then(data => data.samples[0].sample_values.slice(0, 10).reverse());
  
const labels = d3.json(url).then(data => data.samples[0].otu_labels.slice(0, 10).reverse());

// check to see if I have the data that I want 

console.log("Samples", samples) 
console.log("Ids", ids) 
console.log("Values", values)
console.log("Labels", labels) 
