// Json link
var link = "http://localhost:5000/api";

var Tabulator_table = [];
var Selected_Data = [];

var chooseXAxis = "Labor Force"
var chooseYAxis = "Starbucks Count"

var height = 400;
var width = 500;
var table;

var Labor_visible_Data;
var Personal_visible_Data = `style="visibility:hidden"`;

var xAxis;
var yAxis;
var circlesGroup;
var Labor_Force;
var AveragePersonalCapita;

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
            // console.log(row);
            // console.log(row.getData().State);
            Selected_Data = table.getSelectedData();
            // console.log(Selected_Data);

            var svg = d3.select("#graphs").html("")
            createGraph(Selected_Data);
            }
        });
    }
    table.selectRow();
    Selected_Data = table.getSelectedData();
    createGraph(Selected_Data);
});

function Select_All(){
    table.selectRow();
    Selected_Data = table.getSelectedData();
    createGraph(Selected_Data);
}

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

        var svgWidth = 460;
        var svgHeight = 600;

        var margin = {
            top:10,
            right:30,
            bottom:30,
            left:60
        };

        var width = svgWidth - margin.left - margin.right;
        var height = svgHeight - margin.top - margin.bottom;

        

        var svg = d3.select("#graphs")
            .html("")
            .append("svg")
            .attr("width",svgWidth)
            .attr("height",svgHeight);

        var chartGroup = svg.append("g")
            .attr("transform",`translate(${margin.left}, ${margin.top})`)


        // //Set tick range for x axis
        // function xScale(Data, chooseXAxis){
        //     var xTicks = d3.scaleLinear()
        //         .domain([d3.min(Selected_Data, d => d[chooseXAxis])*0.9, d3.max(Selected_Data, d => d[chooseXAxis])*1.1])
        //         .range([0,width]);

        //     return xTicks;
        // }

        // //Set tick range for y axis
        // function yScale(Data, chooseYAxis){
        //     var yTicks = d3.scaleLinear()
        //         .domain([d3.min(Selected_Data, d => d[chooseYAxis])*0.9, d3.max(Selected_Data, d => d[chooseYAxis])*1.1])
        //         .range([height,0]);

        //     return yTicks;
        // }

        // // function to update x axis 
        // function renderXAxes(newXScale, xAxis){
        //     var bottomAxis = d3.axisBottom(newXScale);

        //     xAxis.transition()
        //         .duration(500)
        //         .call(bottomAxis);
            
        //     return xAxis;
        // }

        // // function to update y axis 
        // function renderYAxes(newYscale, yAxis){
        //     var leftAxis = d3.axisLeft(newYScale);

        //     YAxis.transition()
        //         .duration(500)
        //         .call(leftAxis);
            
        //     return yAxis;
        // }

        // function renderCircles(circlesGroup, newXScale,chooseXAxis){
        //     circlesGroup.transition()
        //         .duration(500)
        //         .attr("cx",d=>newXScale(d[chooseXAxis]));
            
        //     return circlesGroup;
        // }

        // Create x and y scale
        var xLinearScale = xScale(Selected_Data, chooseXAxis);
        var yLinearScale = yScale(Selected_Data, chooseYAxis);

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        xAxis = chartGroup.append("g")
            .classed("x-axis",true)
            .attr("transform", `translate(0, ${svgHeight})`)
            .call(bottomAxis);
        
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
            .attr("transform", `translate(0,-15)`)

        var xlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width/2}, ${height})`)


        var ylabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width}, ${height})`);

        // Add X Axes
        Labor_Force = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "Labor Force") 
            .classed("active", true)
            .text("Labor Force")

        AveragePersonalCapita = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "Average Personal Capita") 
            .classed("inactive", true)
            .text("Average Personal Capita")

        // Add Y Axis
        chartGroup.append("text")
            .attr("transform","rotate(-90)")
            .attr("y",-60)
            .attr("x",-250)
            .attr("dy","1em")
            .classed("axis-text",true)
            .text("# of Starbucks Stores")
            .attr("style","center");

        // xlabelsGroup.selectAll("text")
        //     .on("click",function(){
        //         var value = d3.select(this).attr("value")

        //         if(value !== chooseXAxis){
        //             chooseXAxis=value;
        //             xLinearScale = xScale(Selected_Data,chooseXAxis);
        //             xAxis = renderXAxes(xLinearScale,xAxis);
        //             circlesGroup = renderCircles(circlesGroup,xLinearScale,chooseXAxis);
                    
        //             if(chooseXAxis==="Labor Force"){
        //                 Labor_Force.classed("active",true).classed("inactive",false);
        //                 AveragePersonalCapita.classed("active",false).classed("inactive",true);
        //             }

        //             if(chooseXAxis==="Average Personal Capita"){
        //                 AveragePersonalCapita.classed("active",true).classed("inactive",false);
        //                 Labor_Force.classed("active",false).classed("inactive",true);

        }



function Select_Labor_Force(){
    chooseXAxis="Labor Force";
    xLinearScale = xScale(Selected_Data,chooseXAxis);
    xAxis = renderXAxes(xLinearScale,xAxis);
    circlesGroup = renderCircles(circlesGroup,xLinearScale,chooseXAxis);
            
    Labor_Force.attr("style","")
    AveragePersonalCapita.attr("style",`"visibility:hidden"`)

}

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
        .range([0,width]);

    return xTicks;
}

//Set tick range for y axis
function yScale(Data, chooseYAxis){
    var yTicks = d3.scaleLinear()
        .domain([d3.min(Selected_Data, d => d[chooseYAxis])*0.9, d3.max(Selected_Data, d => d[chooseYAxis])*1.1])
        .range([height+40,0]);

    return yTicks;
}

// function to update x axis 
function renderXAxes(newXScale, xAxis){
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(500)
        .call(bottomAxis);
    
    return xAxis;
}

// function to update y axis 
function renderYAxes(newYscale, yAxis){
    var leftAxis = d3.axisLeft(newYScale);

    YAxis.transition()
        .duration(500)
        .call(leftAxis);
    
    return yAxis;
}

function renderCircles(circlesGroup, newXScale,chooseXAxis){
    circlesGroup.transition()
        .duration(500)
        .attr("cx",d=>newXScale(d[chooseXAxis]));
    
    return circlesGroup;
}



