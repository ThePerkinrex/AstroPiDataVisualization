let graphColumns;
let graphColumnsUnits;
let graphColors;

let lineColor;
let boldLineColor;

var table;
var sep;

let width = 1580;
let height = 815;
let graphHeight = height-200;
let graphXStart = 20;
let graphYStart = 20;
let graphXEnd = width-20;
let graphYEnd = graphHeight-20;

let graphInnerHeight = graphYEnd-graphYStart;
let graphInnerWidth = graphXEnd-graphXStart;





// Customizability START ------------------------------------------------------------------

function preload(){
    // Here put the csv file with the data and a header
    table = loadTable('data_file_columbus.csv'/*HERE*/, 'csv', 'header');
}


// Here put the maximum & minimum of all the columns used
let max_data = 0.05;
let min_data = -0.01;

// Here put the number of columns used
let nOfElements = 3;

function setup(){
    // Here put the name of the columns you want to select
    graphColumns = ['accel_x', 'accel_y', 'accel_z'];
    // Here put the units if you want, of the columns
    // If you only want to leave out one unit, write undefined where that unit would be
    graphColumnsUnits = ['Gs', 'Gs', 'Gs'];
    // Here put the colors of the graph lines in rgb
    graphColors = [color(255, 130, 0), color(26, 165, 16), color(14, 105, 165)];
    // Customizability END ---------------------------------------------------------------


    lineColor = color(180);
    boldLineColor = color(100)

    createCanvas(width, height);
    sep = graphInnerWidth/table.rows.length;
    //console.log(sep);
    textSize(15);
    console.log('Loaded');
    noLoop();

    for(let i = 0; i<graphColumns.length; i++){
        console.log(graphColumns.length);
    }
}

function draw(){
    background(255);
    noFill();
    stroke(lineColor);
    line(graphXStart, graphYEnd, graphXEnd, graphYEnd);
    for(let i = graphXStart; i <= graphXEnd;i+=(graphInnerWidth/((60/5)*3))){
        line(i, graphYStart, i, graphYEnd);
    }
    stroke(boldLineColor);
    strokeWeight(3);
    for(let x = graphXStart; x <= graphXEnd; x += graphInnerWidth/3){
        line(x, graphYStart, x, graphYEnd);
    }
    strokeWeight(1);
    noStroke();
    for(let i = 0; i<graphColumns.length; i++){
        fill(graphColors[i]);
        rect(0, graphHeight+10+i*30, 30, 20);
        if(graphColumnsUnits[i])
            text(graphColumns[i] + '(' + graphColumnsUnits[i] + ')', 35, graphHeight+25+i*30);
        else
            text(graphColumns[i], 35, graphHeight+25+i*30);
    }
    
    noFill();
    let x = graphXStart;
    let last_x = x;
    let last_y = new Array(nOfElements);
    for (let i = 0;i<table.rows.length;i++) {
        let row = table.rows[i];
        for(let j = 0;j<graphColumns.length;j++){
            let y = map(row.get(graphColumns[j]), max_data, min_data, graphYEnd, graphYStart);
            stroke(graphColors[j]);
            if(last_y[j])
                line(last_x, last_y[j], x, y);
            last_y[j] = y;
        }
        last_x = x;
        x+=sep;
    }
    console.log('Graph Loaded!');
}