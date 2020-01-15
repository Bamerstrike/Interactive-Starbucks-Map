// Json link
var link = "http://localhost:5000/api";

//Creating variables so they can be used globally.
var Tabulator_table = [];
var Selected_Data = [];

var chooseXAxis = "Labor Force"
var chooseYAxis = "Starbucks Count"

var height = 400;
var width = 500;
var table;

var chartWidth;
var chargHeight;

var xAxis;
var yAxis;
var circlesGroup;
var Labor_Force;
var AveragePersonalCapita;

// From the api, get data and use data in this .json call
d3.json(link,function(data){

    for (var i=0; i<states.length; i++){
        // console.log(states[i])
        // Grabs this state's data so I don't have to constantly type data[states[i]]
        this_state = data[states[i]];
        // Creates a list compatible with Tabulator's table maker
        Tabulator_table.push({
            "State":states[i],
            "Labor Force":this_state["Labor Force"],
            "Average Personal Capita":this_state["Personal Income Capital"],
            "Starbucks Count":this_state["Store Count"]
    });

    // //========================================================
    // // Creates Tabulator Data Table
    // //========================================================

    table = new Tabulator("#tab_data",{
        // Allows me to select each row's data
        selectable:true,
        // Sets height of the table
        height:height,
        // Select the list I want to use for this table. Must be a list of dictionaries
        data: Tabulator_table,
        // Select what kind of fit I want for the table
        layout:"fitColumns",
        // Select my columns form the data I input at "data:"
        columns:[
            {title:"State", field:"State", width:150},
            {title:"Labor Force", field:"Labor Force", align:"left"},
            {title:"Average Personal Capita", field:"Average Personal Capita"},
            {title:"Store Count", field:"Starbucks Count"}
        ],

        // Choose what happens when I select Data
        rowClick: function(e,row){
            Selected_Data=[];
            Selected_Data = table.getSelectedData();

            var svg = d3.select("#graphs").html("")
            createGraph(Selected_Data);
            }
        });
    }
    table.selectRow();
    Selected_Data = table.getSelectedData();
    createGraph(Selected_Data);
});

// To select all data in tabular chart
function Select_All(){
    table.selectRow();
    Selected_Data = table.getSelectedData();
    createGraph(Selected_Data);
}

// To select no data in tabular chart
function Select_None(){
    table.deselectRow();
    Selected_Data = table.getSelectedData();
    createGraph(Selected_Data);
}


// ========================================================
// Creates Graphs for Data Table
// ========================================================
function createGraph(Selected_Data)    
    {     

        var svgWidth = 480;
        var svgHeight = 400;

        var margin = {
            top:10,
            right:40,
            bottom:40,
            left:50
        };

        chartWidth = svgWidth - margin.left - margin.right;
        chartHeight = svgHeight - margin.top - margin.bottom;

        
        var svg = d3.select("#graphs")
            .html("")
            .append("svg")
            .attr("width",svgWidth)
            .attr("height",svgHeight);

        var chartGroup = svg.append("g")
            .attr("transform",`translate(${margin.left}, ${margin.top})`)


        // Create x and y scale
        var xLinearScale = xScale(Selected_Data, chooseXAxis);
        var yLinearScale = yScale(Selected_Data, chooseYAxis);

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        xAxis = chartGroup.append("g")
            .classed("x-axis",true)
            .attr("transform", `translate(0, ${chartHeight-12})`)
            .call(bottomAxis)
            .selectAll("text")
            .attr("transform","rotate(45) translate(25,0)");
        
        yAxis = chartGroup.append("g")
            .attr("transform", `translate(0,10)`)
            .call(leftAxis);

        circlesGroup = chartGroup.selectAll("circle")
            .data(Selected_Data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chooseXAxis]))
            .attr("cy", d => yLinearScale(d[chooseYAxis]))
            .attr("r", 3)
            .attr("fill", "blue")
            .attr("opacity", ".5")

        var xlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth/2}, ${chartHeight+20})`)


        // Add Y Axis
        chartGroup.append("text")
            .attr("transform","rotate(-90)")
            .attr("y",0-margin.left)
            .attr("x",0-(chartHeight/1.5))
            .attr("dy","1em")
            .classed("axis-text",true)
            .text("# of Starbucks Stores")
            .attr("style","center");
        }


// Renders State labor force data
function Select_Labor_Force(){
    chooseXAxis="Labor Force";
    xLinearScale = xScale(Selected_Data,chooseXAxis);
    xAxis = renderXAxes(xLinearScale,xAxis);
    circlesGroup = renderCircles(circlesGroup,xLinearScale,chooseXAxis);
            
}
// Renders average personal capital data
function Select_Personal_Capita(){
    chooseXAxis="Average Personal Capita";
    xLinearScale = xScale(Selected_Data,chooseXAxis);
    xAxis = renderXAxes(xLinearScale,xAxis);
    circlesGroup = renderCircles(circlesGroup,xLinearScale,chooseXAxis);
            
    Labor_Force.attr("style",`"visibility:hidden"`);
    AveragePersonalCapita.attr("style","");
}


//Set tick range for x axis
function xScale(Data, chooseXAxis){
    var xTicks = d3.scaleLinear()
        .domain([d3.min(Selected_Data, d => d[chooseXAxis])*0.9, d3.max(Selected_Data, d => d[chooseXAxis])*1.1])
        .range([0,chartWidth]);

    return xTicks;
}

//Set tick range for y axis
function yScale(Data, chooseYAxis){
    var yTicks = d3.scaleLinear()
        .domain([d3.min(Selected_Data, d => d[chooseYAxis])*0.9, d3.max(Selected_Data, d => d[chooseYAxis])*1.1])
        .range([chartHeight,0]);

    return yTicks;
}

// Function to update x axis 
function renderXAxes(newXScale, xAxis){
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(500)
        .call(bottomAxis);
    
    return xAxis;
}

// Function to update y axis 
function renderYAxes(newYscale, yAxis){
    var leftAxis = d3.axisLeft(newYScale);

    YAxis.transition()
        .duration(500)
        .call(leftAxis);
    
    return yAxis;
}

// Creates the data on the graph
function renderCircles(circlesGroup, newXScale,chooseXAxis){
    circlesGroup.transition()
        .duration(500)
        .attr("cx",d=>newXScale(d[chooseXAxis]));
    
    return circlesGroup;
}



