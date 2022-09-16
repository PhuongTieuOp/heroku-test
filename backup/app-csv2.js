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
const dataRegionPath = 'data/police_region_df.csv';
const dataSummaryPath = 'data/offence_summary_df.csv';
const dataUniqueRegionPath = 'data/region_name.csv';
const dataRegionOffencePath = 'data/year_region_offence.csv';
const delayChart = 50;

let listRegionName = [];
let listYear = [2022, 2021, 2020, 2019];
let selectedYear;
let selectedRegionName;
let list2022 = [];
let list2021= [];
let list2020 = [];
let list2019= [];

//===================================================================
function loadUniqueRegion() {
  d3.csv(dataUniqueRegionPath).then(function(dataURegion) {
    console.log("In loadUniqueRegion... ");
    for (var i=0; i < dataURegion.length; i++ ){       
    
      console.log(dataURegion[i].region_name);
      listRegionName.push(dataURegion[i].region_name);
    };
    return listRegionName;
  });
}

//=====================================================================
// Initializes the page with a default plot
function init() {
  loadUniqueRegion();  
  loadPiechartData();
  d3.csv(dataRegionPath).then(function(data) {    
    console.log("In Init(), data below: ");
    console.log(data);
    console.log("new listRegionName: ");
    console.log(listRegionName);

    // create a drop down list for Year and load data into it
    var ddlYear = d3.select("#selYear");
    for (var i=0; i < listYear.length; i++ ){   
      ddlYear.append("option").text(listYear[i]).property("value", listYear[i]);
    };    

    // create a drop down list for Region Name and load data into it
    var ddlRegionName = d3.select("#selDataset");
    for (var i=0; i < listRegionName.length; i++ ){   
        ddlRegionName.append("option").text(listRegionName[i]).property("value", listRegionName[i]);
    };    

    console.log("ddlRegionName: ");
    console.log(ddlRegionName);
    console.log("listRegionName: " + listRegionName[0]);

    // Use the first item in the dropdown lists
    selectedYear = (listYear[0]);
    selectedRegionName = (listRegionName[0]);
    
    console.log(selectedYear);
    console.log(selectedRegionName);
    plotPiechart();
    plotCharts();
  }  )
}

init();

// ===============================================================================
// 2. Year and region selection dropdown boxs
// ===============================================================================
function optionChanged(year) {  
  selectedYear = year;
  plotCharts();
}
function optionRegionChanged(regionName) {  
  selectedRegionName = regionName;
  plotCharts();
}

// ===============================================================================
// 4. Plotting charts for a region
// ===============================================================================
function plotCharts() {
  d3.csv(dataRegionPath).then((data) => {   
      console.log('plotCharts(), Data as below: ');
      console.log(data);
      console.log('Plot Region year/name as below: ');
      console.log(selectedYear, selectedRegionName);

      // get related data from the given regionName
      var listFiltered = data.filter(item => 
          item.region_name == selectedRegionName && 
          item.year == selectedYear
          );  
      
      console.log('Below listFiltered: ');
      console.log(listFiltered);

      var listIncidentCount = [];
      var listLgaName = [];   
      var listRate = [];
      var listRoundRate = [];
      for (var i=0; i < listFiltered.length; i++ ){
        listLgaName.push(listFiltered[i].lga_name);
        listIncidentCount.push(listFiltered[i].incident_count/100);        
        listRate.push(Math.round(listFiltered[i].rate_per_100000pop) / 1000);
        listRoundRate.push(Math.round(listFiltered[i].rate_per_100000pop));
      };
      console.log(listLgaName);
      console.log(listIncidentCount);
      console.log(listRate);

      plotLinechart(listIncidentCount, listLgaName, listRate, listRoundRate); 
      plotBarchart(listIncidentCount, listLgaName, listRate, listRoundRate);       
      plotRadarchart(selectedRegionName);  
      plotBublechart(listIncidentCount, listLgaName, listRate, listRoundRate);      
      // plotGaugechart(); // ** Bonus work **
  })
}
// ===============================================================================
// 4a1. Doughnut chart (chart js) for all 4 year
// ===============================================================================
function loadPiechartData() {
  d3.csv(dataRegionOffencePath).then((data) => {   
    console.log('getPiechartData(), Data as below: ');
    console.log(data);

    // get related data from the given regionName
    list2022 = data.filter(item => 
        item.year == 2022
        );  
    list2021 = data.filter(item => 
        item.year == 2021
        );  
    list2020 = data.filter(item => 
        item.year == 2020
        );  
    list2019 = data.filter(item => 
        item.year == 2019
        );  
    
    var list2022Incident = [];
    var list2021Incident = [];   
    var list2020Incident = [];
    var list2019Incident = [];
    for (var i=0; i < list2022.length; i++ ){
        list2022Incident.push(list2022[i].sum);
        list2021Incident.push(list2021[i].sum);        
        list2020Incident.push(list2020[i].sum);
        list2019Incident.push(list2019[i].sum);
        };
    console.log('list2022Incident: '+ list2022Incident);
    console.log('list2021Incident: '+ list2021Incident);
    console.log('list2020Incident: '+ list2020Incident);
    console.log('list2019Incident: '+ list2019Incident);
    list2022 = list2022Incident;
    list2021 = list2021Incident;
    list2020 = list2020Incident; 
    list2019 = list2019Incident;
    console.log('list2022: '+ list2022);
    console.log('list2021: '+ list2021);
    console.log('list2020: '+ list2020);
    console.log('list2019: '+ list2019);
    return;
  })
}
// ===============================================================================
// 4a1. Doughnut chart (chart js) setup for Police Region
// ===============================================================================
function plotPiechart(){
  console.log('plotPiechart(): ******************');
//  getPiechartData();
  
  var chartCanvas = document.getElementById("pie-chart");

  console.log('list2022: '+ list2022);
  console.log('list2021: '+ list2021);
  console.log('list2020: '+ list2020);
  console.log('list2019: '+ list2019);

  const data = {
    labels: [
      'pink',
      'Blue',
      'Yellow',
      'green'
    ],
    datasets: [{
      label: '2022',
      data: [list2022, list2021, list2020, list2019],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  // <block:config:0>
  const config = {
    type: 'doughnut',
    data: data,
  };
  
  var chartOptions = {
    legend: {
      delay: delayChart,
      display: true,
      position: 'top',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    }
  };

  var newChart = new Chart(chartCanvas, {
    type: 'doughnut',
    data: data,
    options: chartOptions
  });
}

// ===============================================================================
// 4a2. Line chart (chart js) setup for Police Region
// ===============================================================================

function plotLinechart(incidentCounts, lgaNames, rates, roundRates){
  
  console.log('plotLinechart()************');
  var chartCanvas = document.getElementById("line-chart");

  var dataFirst = {
      label: "2022", lineTension: 0.4,
      easing: 'linear',
      data: list2022,
      fill: false, borderColor: 'red'
    };

  var dataSecond = {
      label: "2021", lineTension: 0.4, 
      easing: 'linear',
      data: list2021,
      fill: false, borderColor: 'blue'
    };

  var regionData = {
    labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
    datasets: [dataFirst, dataSecond]
  };

  var chartOptions = {
    legend: {
      delay: delayChart,
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
    data: regionData,
    options: chartOptions
  });
}
// ===============================================================================
// 4b. Bar chart setup for first 10 samples of a region
// ===============================================================================

function plotBarchart(incidentCounts, lgaNames, rates, roundRates){
  
  console.log('Bar chart function:************');
  
  var chartCanvas = document.getElementById("bar-chart");

  const data = {
    labels: lgaNames,
    datasets: [{
      label: 'Local Government Offence',
      data: incidentCounts,
      backgroundColor: 'darkblue',
      borderColor: 'black',
      borderWidth: 1
    }]
  };
  // </block:setup>

  var chartOptions = {    
    title: 'Victoria Police Region', 
    legend: {
      display: true,
      position: 'right top',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    },
    options: {
      delay: delayChart,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
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
    x: rates,
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
  

  };
  
// ===============================================================================
// 4c. Radar Charts
// ===============================================================================
function getRadarData(regionName){
  d3.csv(dataSummaryPath).then((data) => {   

    console.log('Summary Data as below: ');
    console.log(data);
    regionName = '1 North West Metro';
    console.log('Region name as below: ');
    console.log(regionName);

    // get related data from the given regionName
    var listFiltered = data.filter(item => item.region_name == regionName); 
    listFiltered.pop() 
    
    console.log('Below listFiltered: '+ regionName);
    console.log(listFiltered);
    return listFiltered;
  })
}
//=============================================
// <block:setup:1>
function plotRadarchart(regionName){  
  
  console.log('Radar chart function:************');
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
      data: getRadarData(regionName),
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
       }]
    }  // end of <const data>

  var chartOptions = {
    legend: {
      display: true,
      position: 'top',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    },  // end of legend
    options: {
      elements: {
        line: {
          borderWidth: 3
        }
      },
      delay: delayChart,
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Chart.js Radar Chart'
        }
      }
    } // end of option
  };

  var newChart = new Chart(chartCanvas, {
    type: 'radar',
    data: data,
    options: chartOptions
  });
}
