//-- =============================================================================
//-- Project3
//--
//-- Module:    15-Interactive Dashboard, Visualisation and D3 
//-- Date:      8-Sept-2022 
//-- Note:      since json file is used, we need to run 'python -m http.server' to use
//--            localhost:8000
//-- ============================================================================= 

// ===============================================================================
// 1. Initialisation 
// ===============================================================================
// import 'Utils.js';
var dataPath = 'data/police_region_df.csv';

// Initializes the page with a default plot
function init() {
  d3.csv(dataPath).then(function(data) {    
    console.log("data below: ");
    console.log(data);
    var loadedNames = data.region_name;  // data.names is a list of region's id

    console.log("loadedNames: ");
    console.log(loadedNames);
    let listRegionName = [];
    for (var i=0; i < data.length; i++ ){
      listRegionName.push(data[i].region_name);
    };
    console.log("listRegionName: ");
    console.log(listRegionName);
    let uniqueRegion = new Set(listRegionName);
    console.log("new uniqueRegion: ");
    console.log(uniqueRegion);

    // create a drop down list variable and load data into it
    var ddlRegionName = d3.select("#selDataset");
    // ddlRegionName.append('All');
    for (var i=0; i < uniqueRegion.length; i++ ){
      ddlRegionName.append("option").text(uniqueRegion[i]).property("value", uniqueRegion[i]);
    };    
    console.log("ddlRegionName: ");
    console.log(ddlRegionName);
    console.log("uniqueRegion: " + uniqueRegion[0]);
    // Populate metadata and bar charts using the first item in the dropdown list
    optionChanged(uniqueRegion[0]);
  }  )
}

init();

// ===============================================================================
// 2. Participant's selection dropdown box
// ===============================================================================
function optionChanged(regionName) {  
  // populateMetadata(regionName);    
  plotCharts(regionName);
}

// ===============================================================================
// 4. Plotting charts for a region
// ===============================================================================
function plotCharts(regionName) {
  d3.csv(dataPath).then((data) => {   
      console.log('Plot chart-Region Data as below: ');
      console.log(data);
      regionName = '1 North West Metro';
      console.log('Plot Region name as below: ');
      console.log(regionName);

      // get related data from the given regionName
      var listFiltered = data.filter(item => item.region_name == regionName);  
      
      console.log('Below listFiltered: '+ regionName);
      console.log(listFiltered);

      var listIncidentCount = [];
      var listLgaName = [];   
      var listRate = [];
      var listRoundRate = [];
      for (var i=0; i < listFiltered.length; i++ ){
        listLgaName.push(listFiltered[i].lga_name);
        listIncidentCount.push(listFiltered[i].incident_count);        
        listRate.push(Math.round(listFiltered[i].rate_per_100000pop) / 1000);
        listRoundRate.push(Math.round(listFiltered[i].rate_per_100000pop));
      };
      console.log(listLgaName);
      console.log(listIncidentCount);
      console.log(listRate);

      plotLinechart(listIncidentCount, listLgaName, listRate, listRoundRate); 
      plotBarchart(listIncidentCount, listLgaName, listRate, listRoundRate);       
      plotRadarchart(regionName);  
      plotBublechart(listIncidentCount, listLgaName, listRate, listRoundRate);      
      // plotGaugechart(); // ** Bonus work **
  })
}
// ===============================================================================
// 4a. Line chart (chart js) setup for Police Region
// ===============================================================================

function plotLinechart(incidentCounts, lgaNames, rates, roundRates){
  var chartCanvas = document.getElementById("line-chart");

  var dataFirst = {
      label: "Car A - Speed (mph)", lineTension: 0.4,
      data: [0, 59, 75, 20, 20, 55, 40],
      fill: false, borderColor: 'red'
    };

  var dataSecond = {
      label: "Car B - Speed (mph)", lineTension: 0.4,
      data: [20, 15, 60, 60, 65, 30, 70],
      fill: false, borderColor: 'blue'
    };

  var speedData = {
    labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
    datasets: [dataFirst, dataSecond]
  };

  var chartOptions = {
    legend: {
      display: true,
      position: 'top',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    }
  };

  var newChart = new Chart(chartCanvas, {
    type: 'line',
    data: speedData,
    options: chartOptions
  });
}
// ===============================================================================
// 4b. Bar chart setup for first 10 samples of a region
// ===============================================================================

function plotBarchart(incidentCounts, lgaNames, rates, roundRates){
  
  var chartCanvas = document.getElementById("bar-chart");

  const data = {
    labels: lgaNames,
    datasets: [{
      label: 'My First Dataset',
      data: incidentCounts,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  };
  // </block:setup>

  var chartOptions = {
    legend: {
      display: true,
      position: 'top',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    },
    options: {
      delay: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  // <block:config:0>
  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };
  var newChart = new Chart(chartCanvas, {
    type: 'bar',
    data: data,
    options: chartOptions
  });
}
// ===============================================================================
// 4b. Bubble chart setup for all samples of a region
// ===============================================================================
function plotBublechart(incidentCounts, lgaNames, rates, roundRates){
  var trace1 = {
    x: roundRates,
    y: incidentCounts,
    text: lgaNames,    
    mode: 'markers',
    marker: {color: 'orange', size: incidentCounts}
  };
  console.log('rates: ' + rates);
  console.log('incidentCount: ' + incidentCounts);
  var layout = {
  //  title: (`<b>`+ `${lgaName.length} Bacteria Samples (OTUs) Found In Belly Button` + `</b>`),
   title: (`<b>`+ `Lga crime` + `</b>`),
  xaxis: { title: "rates"},
    yaxis: { title: "incidentCount" },
    height: 600,
    width: 1200
  };
  var data = [trace1];
  rates = rates;

  Plotly.newPlot('bubble-chart', data, layout);
}
// ===============================================================================
// 4c. Radar Charts
// ===============================================================================
// <block:setup:1>
function plotRadarchart(incidentCounts, lgaNames, rates, roundRates){
  
  var chartCanvas = document.getElementById("radar-chart");
  // data = getRadarData(regionName);

  const data = {
    labels: ['A Crime vs Person',
             'B Property Deption',
             'C Drug Offecne',
             'D Public Order Security',
             'E Justice Offence',
             'F Other Offence'],
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 90, 81, 56, 40],
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    // }, {
    //   label: 'My Second Dataset',
    //   data: [28, 48, 40, 19, 96, 27, 100],
    //   fill: true,
    //   backgroundColor: 'rgba(54, 162, 235, 0.2)',
    //   borderColor: 'rgb(54, 162, 235)',
    //   pointBackgroundColor: 'rgb(54, 162, 235)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgb(54, 162, 235)'
    }]
  };
  // </block:setup>

  var chartOptions = {
    legend: {
      display: true,
      position: 'top',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    },  
    options: {
      elements: {
        line: {
          borderWidth: 3
        }
      },
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Chart.js Radar Chart'
        }
      },
    },
  };

  var newChart = new Chart(chartCanvas, {
    type: 'radar',
    data: data,
    options: chartOptions
  });
}
// ==============================
// <block:actions:2>
