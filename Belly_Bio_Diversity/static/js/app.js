function buildMetadata(sample) {
  
  // @TODO: Complete the following function that builds the metadata panel

  // Use`d3.json` to fetch the metadata for a sample
  // since the given data has relationship meaning for each sample in samples table we have associated/related record in sample metadata table
  // grabbing related record/meta data for each sample from sample metadata table
  d3.json(`/metadata/${sample}`).then(function(sampleData) {
  // console.log(sample)
    console.log(sampleData);
    
    // Use d3 to select the panel with id of `#sample-metadata`

    // setting varibale to select sample number(primary key) from sample meta data table and tied back to sample in samples table
    var PANEL = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    // by using .html set the content from sample metadata  and overwrite the content of newly selected sample.
    PANEL.html("");
    
    // Use`Object.entries` to add each key and value pair to the panel
     // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // Using d3 to append new tags for each key-value in the metadata.
    // Iterate through each key and value of each object using  `Object.entries` and `forEach`  and append them in div panel
    Object.entries(sampleData).forEach(([key, value]) => {
      PANEL.append('h6').text(`${key}, ${value}`);
    })
    
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    
    
      
    })
  }
  

  function buildCharts(sample) {
    
//     // @TODO: Use `d3.json` to fetch the sample data for the plots
    
//     // @TODO: Build a Bubble Chart using the sample data
    
//     // @TODO: Build a Pie Chart
//     // HINT: You will need to use slice() to grab the top 10 sample_values,
//     // otu_ids, and labels (10 each).
    
//     // console.log(sample) 
// grabbing eachsample from Samples table 
    d3.json(`/samples/${sample}`).then(function (sampleData) {
      console.log(sampleData);
      // console.log(sampleData.otu_ids);
      // console.log(sampleData.otu_labels);
      // console.log(sampleData.sample_values);

// set varible using const to have better performance when rendering our charts
// for this project  the below three variable won't be changed for the life time of the research because they are holding unique value for each participant data

      const otu_ids = sampleData.otu_ids;
      const otu_labels = sampleData.otu_labels;
      const sample_values = sampleData.sample_values;

      //Build Bubble chart
      // Create a Bubble Chart that uses data from  samples route (/samples/<sample>) to display each sample.

      var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Earth'
        }
      }];      

      var bubbleLayout = {
        margin: { t: 0 },
        hovermode: 'closest',
        xaxis: {title: 'OTU ID'},
      };

      Plotly.plot('bubble', bubbleData, bubbleLayout);

      // Building Pie Chart
      
      var pieData = [{
        values: sample_values.slice(0,10),
        labels: otu_ids.slice(0,10),
        hovertext: otu_labels.slice(0,10,),
        hoverinfo: 'hovertext',
        type: 'pie'
      }];

      var pieLayout = {
        margin: {t: 0, l: 0}
      }

      Plotly.plot('pie', pieData, pieLayout); 

    });
  }
  
  
function init() {
//   // Grab a reference to the dropdown select element
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
