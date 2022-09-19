//-- =============================================================================
//-- Project3
//--
//-- Date:      8-Sept-2022 
//-- ============================================================================= 

// ===============================================================================
// 1. Initialisation 
// ===============================================================================
const dataRegionPath = '/api/getTotalByRegion';
const dataUniqueRegionPath = '/api/getRegionNames';

const delayChart = 50;

let listRegionName = [];
let listYear = [2022, 2021, 2020, 2019];
let selectedYear;
let selectedRegionName;
let list2022 = [];
let list2021= [];
let list2020 = [];
let list2019= [];

//=====================================================================
// Initializes the page with a default plot
function init() {
  // Note: 2 load data functions perform before d3.then() promise function (has delay effect)
  // so that data are ready for use inside the promise function.
  loadByYear();
  d3.csv(dataRegionPath).then(function(data) {    
    console.log("=== In Init(), data below: ");
    console.log(data);
    plotPiechart();
  }  )
}

init();

// ===============================================================================
// Load region total by year
function loadByYear() {
  d3.csv(dataRegionPath).then((data) => {   
    console.log('loadByYear(), Data as below: ');
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
    
    // create region name list
    for (var i=0; i < list2022.length; i++ ){           
            console.log(list2022[i].region_name);
            listRegionName.push(list2022[i].region_name);
          };
        
    console.log('bf list2022Incidentload---- list2022: '+ list2022);
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
    list2022 = list2022Incident;
    list2021 = list2021Incident;
    list2020 = list2020Incident; 
    list2019 = list2019Incident;
    console.log('list2022: '+ list2022);

    return;
  })
}
// ===============================================================================
// 4. Doughnut chart setup for 4 years
// ===============================================================================
function plotPiechart(){
var data1 = [{
    values: list2022,
    labels: listRegionName,
    text: '2022', name: '2022',    
    textinfo: "label+percent",    
    textposition: "outside",
    hoverinfo: 'label+percent+name',
    hole: .4,
    type: 'pie' }];

var data2 = [{
    values: list2021,
    labels: listRegionName,
    text: '2021', name: '2021',
    textinfo: "label+percent",
    textposition: "outside",
    hoverinfo: 'label+percent+name',
    hole: .4,
    type: 'pie'}];

var data3 = [{
    values: list2020,
    labels: listRegionName,
    text: '2020', name: '2020',
    textinfo: "label+percent",    
    textposition: "outside",
    hoverinfo: 'label+percent+name',
    hole: .4,
    type: 'pie'}];
 
var data4 = [{  
    values: list2019,
    labels: listRegionName,
    text: '2019', name: '2019',
    textinfo: "label+percent",    
    textposition: "outside",
    hoverinfo: 'label+percent+name',
    hole: .4,
    type: 'pie'}];
  
var layout1 = {
    annotations: [
      {
        font: {size: 20 },
        showarrow: false,
        text: '2022'
      }],      
      paper_bgcolor:'rgba(0,0,0,0)', // make background transparent
      plot_bgcolor:'rgba(0,0,0,0)',
      height: 400,
      width: 400,
      margin: {"t": 0, "b": 0, "l": 0, "r": 0},
      showlegend: false
}

var layout2 = {
    annotations: [
      {
        font: {size: 20 },
        showarrow: false,
        text: '2021'
      }],      
      paper_bgcolor:'rgba(0,0,0,0)', // make background transparent
      plot_bgcolor:'rgba(0,0,0,0)',
      height: 400,
      width: 400,
      margin: {"t": 0, "b": 0, "l": 0, "r": 0},
      showlegend: false
}
var layout3 = {
    annotations: [
      {
        font: {size: 20 },
        showarrow: false,
        text: '2020'
      }],      
      paper_bgcolor:'rgba(0,0,0,0)', // make background transparent
      plot_bgcolor:'rgba(0,0,0,0)',
      height: 400,
      width: 400,
      margin: {"t": 0, "b": 0, "l": 0, "r": 0},
      showlegend: false
}
var layout4 = {
    annotations: [
      {
        font: {size: 20 },
        showarrow: false,
        text: '2019'
      }],      
      paper_bgcolor:'rgba(0,0,0,0)', // make background transparent
      plot_bgcolor:'rgba(0,0,0,0)',
      height: 400,
      width: 400,
      margin: {"t": 0, "b": 0, "l": 0, "r": 0},
      showlegend: false
}
  
  Plotly.newPlot('pie-chart1', data1, layout1);
  
  Plotly.newPlot('pie-chart2', data2, layout2);
  
  Plotly.newPlot('pie-chart3', data3, layout3);
  
  Plotly.newPlot('pie-chart4', data4, layout4);
}