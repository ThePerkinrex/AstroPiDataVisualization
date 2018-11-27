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
let graphXStart = 40;
let graphYStart = 20;
let graphXEnd = width-10;
let graphYEnd = graphHeight-20;

let graphInnerHeight = graphYEnd-graphYStart;
let graphInnerWidth = graphXEnd-graphXStart;



// Custom START ------------------------------------------------------------------

function preload(){
    // Here put the csv file with the data and a header
    table = loadTable('data_file_columbus.csv'/*HERE*/, 'csv', 'header');
}


// Here put the maximum & minimum of all the columns used
let max_data = 0.042; // example:  0.042
let min_data = -0.026; // example: -0.026

// Here put the number of columns used
let nOfElements = 3; // example: 3

// Here put the hours the experiment run for (for AstroPi, it is 3h)
let hoursRun = 3;
// Here put how often do you want a line appearing (default is 5min)
let minSep = 5;

// DO NOT CHANGE ----------------------------------+
graphColumnsUnits = new Array(nOfElements); //     |
// END DO NOT CHANGE ------------------------------+



function setup(){
    // Here put the name of the columns you want to select
    graphColumns = ['accel_x', 'accel_y', 'accel_z']; // example: ['accel_x', 'accel_y', 'accel_z']
    // Here put the units if you want, of the columns
    // If you only want to leave out one unit, write undefined where that unit would be
    graphColumnsUnits = ['Gs', 'Gs', 'Gs']; // example: ['Gs', 'Gs', 'Gs']
    // Here put the colors of the graph lines in rgb
    graphColors = [color(255, 130, 0), color(26, 165, 16), color(14, 105, 165)]; // example: [color(255, 130, 0), color(26, 165, 16), color(14, 105, 165)]
    // Custom END ---------------------------------------------------------------


    lineColor = color(180);
    boldLineColor = color(100);
    
    

    if(graphColumns.length < nOfElements || graphColumnsUnits.length < nOfElements || graphColors.length < nOfElements){
        createP('ERROR: Column data is not the length it should be');
        throw Error('Column data is not the length it should be')
    }else{
        createCanvas(width, height);
        sep = graphInnerWidth/table.rows.length;
        //console.log(sep);
        textSize(15);
        console.log('Loaded');
        text('Loaded data! Creating graph ...', 0,15);
    }
}

let first_time = true;

function draw(){
    if(first_time){
        first_time=false;
    }else{
        let zeroMarkHeight = map(0, min_data, max_data, graphYEnd, graphYStart);
        //console.log(graphXStart, graphXEnd, graphYStart, graphYEnd);
        //console.log(zeroMarkHeight, (zeroMarkHeight >= graphYStart && zeroMarkHeight <= graphYEnd), (zeroMarkHeight >= graphYStart && zeroMarkHeight <= graphYEnd)?zeroMarkHeight:undefined);
        zeroMarkHeight = (zeroMarkHeight >= graphYStart && zeroMarkHeight <= graphYEnd)?zeroMarkHeight:undefined;
        
        background(255);
        noFill();
        stroke(lineColor);
        for(let i = graphXStart; i <= graphXEnd;i+=(graphInnerWidth/((60/minSep)*hoursRun))){
            line(i, graphYStart, i, graphYEnd);
        }
        stroke(boldLineColor);
        strokeWeight(3);
        strokeCap(PROJECT);
        line(graphXStart, graphYEnd, graphXEnd, graphYEnd);
        for(let x = graphXStart; x <= graphXEnd; x += graphInnerWidth/hoursRun){
            line(x, graphYStart, x, graphYEnd);
        }
        if(zeroMarkHeight)
            line(graphXStart, zeroMarkHeight, graphXEnd, zeroMarkHeight);
        strokeWeight(1);
        noStroke();
        for(let i = 0; i<graphColumns.length; i++){
            fill(graphColors[i]);
            rect(0, graphHeight+10+i*30, 30, 20);
            if(graphColumnsUnits[i])
                text(graphColumns[i] + ' (' + graphColumnsUnits[i] + ')', 35, graphHeight+25+i*30);
            else
                text(graphColumns[i], 35, graphHeight+25+i*30);
        }
        fill(boldLineColor);
        let dataTextSize = 12;
        textSize(dataTextSize);
        text(max_data, graphXStart-textWidth(max_data + ' '), graphYStart + dataTextSize/2);
        text(min_data, graphXStart-textWidth(min_data + ' '), graphYEnd + dataTextSize/2);
        if(zeroMarkHeight)
            text('0.0', graphXStart-textWidth('0.0 '), zeroMarkHeight + dataTextSize/2);
        
        for(let i = 0; i <= hoursRun; i++){
            if(i>0)
            text(i+'h', graphXStart+graphInnerWidth*i/hoursRun-(textWidth(i+'h')/2), graphYEnd+dataTextSize);
        }
        
        noFill();
        let x = graphXStart;
        let last_x = x;
        let last_y = new Array(nOfElements);
        for (let i = 0;i<table.rows.length;i++) {
            let row = table.rows[i];
            for(let j = 0;j<graphColumns.length;j++){
                if(row.get(graphColumns[j]) < min_data){
                    console.log(graphColumns[j], row.get(graphColumns[j]))
                }
                let y = map(row.get(graphColumns[j]), min_data, max_data, graphYEnd, graphYStart);
                stroke(graphColors[j]);
                if(last_y[j])
                    line(last_x, last_y[j], x, y);
                last_y[j] = y;
            }
            last_x = x;
            x+=sep;
        }
        console.log('Graph Loaded!');
        noLoop();
    }
}