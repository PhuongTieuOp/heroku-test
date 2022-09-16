//-- =============================================================================
//-- Homework
//--
//-- Module:    15-Interactive Dashboard, Visualisation and D3 
//-- Date:      15-8-2022 
//-- Note:      since json file is used, we need to run 'python -m http.server' to use
//--            localhost:8000
//-- ============================================================================= 

// ===============================================================================
// 1. Initialisation 
// ===============================================================================
var dataPath = 'samples.json';
var wfreq = 0;

// Initializes the page with a default plot
function init() {
  d3.json(dataPath).then(function(data) {
    var loadedNames = data.names;  // data.names is a list of participant's id
    console.log(loadedNames);
    // create a drop down list variable and load data into it
    var ddlParticipantId = d3.select("#selDataset");
    for (var i=0; i < loadedNames.length; i++ ){
      ddlParticipantId.append("option").text(loadedNames[i]).property("value", loadedNames[i]);
    };

    // Populate metadata and bar charts using the first item in the dropdown list
    optionChanged(loadedNames[0]);
  }  )
}

init();

// ===============================================================================
// 2. Participant's selection dropdown box
// ===============================================================================
function optionChanged(participantId) {  
    populateMetadata(participantId);    
    plotCharts(participantId);
}
// ===============================================================================
// 3. Metadata - demographic info for a participant
// ===============================================================================

function populateMetadata(participantId) {
     d3.json(dataPath).then((sampleData) => {
        var loadedMetadata = sampleData.metadata;
        var filteredMetadata = loadedMetadata.filter(item => item.id == participantId)[0];   
        wfreq = filteredMetadata.wfreq;

        // Create a variable to associate to demographic info area - the #sample-metadata object
        var sampleMetadata = d3.select("#sample-metadata");  
        sampleMetadata.html("");  // clear the html area before loading new details        

        // Loop thru to filtered object to pair key and value
       Object.entries(filteredMetadata).forEach((key) => {   
          sampleMetadata.append("h5").text(key[0] + ": " + key[1] + "\n");    
     })
  }) // end of .then((sampleData)
}
// ===============================================================================
// 4. Plotting charts for a participant
// ===============================================================================
function plotCharts(participantId) {
  d3.json(dataPath).then((sampleData) => {
      var loadedSamples = sampleData.samples;      
      console.log('loadedSamples as below: ');
      console.log(loadedSamples);

      // get related data from the given participantId
      var filteredSamples = loadedSamples.filter(item => item.id == participantId)[0];    

      console.log('Below are samples for participant: '+ participantId);
      console.log(filteredSamples);

      var otuIds = filteredSamples.otu_ids;
      var otuLabels = filteredSamples.otu_labels;   
      var otuValues = filteredSamples.sample_values;

      plotBarchart(otuValues, otuIds, otuLabels);
      plotBublechart(otuValues, otuIds, otuLabels);      
      plotGaugechart(); // ** Bonus work **
  })
}
// ===============================================================================
// 4a. Bar chart setup for first 10 samples of a participant
// ===============================================================================
function plotBarchart(otuValues, otuIds, otuLabels) {  

  otuValues = otuValues.slice(0,10).reverse();
  otuIds = otuIds.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();  
  otuLabels = otuLabels.slice(0,10).reverse();
  console.log('Top 10 values :' + otuValues);
  console.log('Top 10 ids :' + otuIds);
  console.log('Top 10 labels :' + otuLabels);

  var trace1 = {
    x: otuValues,
    y: otuIds,
    text: otuLabels,
    orientation :'h',
    type: "bar"
    };
  var layout = {
    title: (`<b>`+ `Top 10 OTUs Found`+`</b>`),
    xaxis: { title: "Value" },
    yaxis: { title: "Sample ID"}
    };

  var data = [trace1];
  
  Plotly.newPlot("bar-chart", data, layout);
}
// ===============================================================================
// 4b. Bubble chart setup for all samples of a participant
// ===============================================================================
function plotBublechart(otuValues, otuIds, otuLabels){
  var trace1 = {
    x: otuIds,
    y: otuValues,
    text: otuLabels,    
    mode: 'markers',
    marker: {color: otuIds, size: otuValues}
  };
  var layout = {
    title: (`<b>`+ `${otuLabels.length} Bacteria Samples (OTUs) Found In Belly Button` + `</b>`),
    xaxis: { title: "Sample ID"},
    yaxis: { title: "Value" },
    height: 600,
    width: 1200
  };
  var data = [trace1];

  Plotly.newPlot('bubble-chart', data, layout);
}
// ===============================================================================
// 4c. Gauge chart setup for a participant's belly button scrub per week (** Bonus **)
//
// Notes: 
// Following gauge chart code is simple, straigh forward, show indicator and figures
// correctly, particular the delta figure gives instant visualisation.
// ===============================================================================
function plotGaugechart() {     
  // if wfreq is null, set it to 0, so that the indicator shows correctly 
  if (wfreq == null) {
    wfreq = 0;
    }
  var data = [
    {
      type: "indicator",
      mode: "gauge+number+delta",
      value: wfreq,
      title: { text: "Scrubs per week", font: { size: 18 } },
      delta: { reference: 9, increasing: { color: "brown" } },  
      gauge: {
        axis: { range: [null, 9], tickwidth: 1, 
            tickcolor: "brown", tickmode: "array",
            tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
         },
        bar: { color: "brown" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [          
          { range: [0, 1], color: "#EFF5EF" },
          { range: [1, 2], color: "#F2EFDD" },    
          { range: [2, 3], color: "#FAF2C3" },          
          { range: [3, 4], color: "#FAEC99" },
          { range: [4, 5], color: "#F7DE4F" },          
          { range: [5, 6], color: "#EFFB58" },
          { range: [6, 7], color: "#C7D60B" },
          { range: [7, 8], color: "#89D60B" },          
          { range: [8, 9], color: "#0BD61A" },
        ],
        threshold: {
          line: { color: "red", width: 1 },
          thickness: 0.20,
          value: wfreq
        }
      }
    }
  ];

  var layout = {    
    title: (`<br><b>`+ `Belly Button Wash Frequency (wfreq)`+`</b>`),
    width: 500,
    height: 400,
    margin: { t: 25, r: 25, l: 25, b: 25 },
    paper_bgcolor: "white",
    font: { color: "black", family: "Arial" }
  };

  Plotly.newPlot('gauge-chart', data, layout);
}
