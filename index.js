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

let graph;
let overlay;
let markers = [];

let lastMouse = false;

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
        graph = createGraphics(width, height);
        overlay = createGraphics(width, height);
        sep = graphInnerWidth/table.rows.length;
        //console.log(sep);
        textSize(15);
        console.log('Loaded');
        text('Loaded data! Creating graph ...', 0,15);
    }
}

let state = 0;

function draw(){
    if(state == 0){
        state = 1;
    }else if(state == 1){
        let zeroMarkHeight = map(0, min_data, max_data, graphYEnd, graphYStart);
        //console.log(graphXStart, graphXEnd, graphYStart, graphYEnd);
        //console.log(zeroMarkHeight, (zeroMarkHeight >= graphYStart && zeroMarkHeight <= graphYEnd), (zeroMarkHeight >= graphYStart && zeroMarkHeight <= graphYEnd)?zeroMarkHeight:undefined);
        zeroMarkHeight = (zeroMarkHeight >= graphYStart && zeroMarkHeight <= graphYEnd)?zeroMarkHeight:undefined;
        
        graph.background(255);
        graph.noFill();
        graph.stroke(lineColor);
        for(let i = graphXStart; i <= graphXEnd;i+=(graphInnerWidth/((60/minSep)*hoursRun))){
            graph.line(i, graphYStart, i, graphYEnd);
        }
        graph.stroke(boldLineColor);
        graph.strokeWeight(3);
        graph.strokeCap(PROJECT);
        graph.line(graphXStart, graphYEnd, graphXEnd, graphYEnd);
        for(let x = graphXStart; x <= graphXEnd; x += graphInnerWidth/hoursRun){
            graph.line(x, graphYStart, x, graphYEnd);
        }
        if(zeroMarkHeight)
            graph.line(graphXStart, zeroMarkHeight, graphXEnd, zeroMarkHeight);
        graph.strokeWeight(1);
        graph.noStroke();
        for(let i = 0; i<graphColumns.length; i++){
            graph.fill(graphColors[i]);
            graph.rect(0, graphHeight+10+i*30, 30, 20);
            if(graphColumnsUnits[i])
                graph.text(graphColumns[i] + ' (' + graphColumnsUnits[i] + ')', 35, graphHeight+25+i*30);
            else
                graph.text(graphColumns[i], 35, graphHeight+25+i*30);
        }
        graph.fill(boldLineColor);
        let dataTextSize = 12;
        graph.textSize(dataTextSize);
        graph.text(max_data, graphXStart-graph.textWidth(max_data + ' '), graphYStart + dataTextSize/2);
        graph.text(min_data, graphXStart-graph.textWidth(min_data + ' '), graphYEnd + dataTextSize/2);
        if(zeroMarkHeight)
            graph.text('0.0', graphXStart-graph.textWidth('0.0 '), zeroMarkHeight + dataTextSize/2);
        
        for(let i = 0; i <= hoursRun; i++){
            if(i>0)
            graph.text(i+'h', graphXStart+graphInnerWidth*i/hoursRun-(graph.textWidth(i+'h')/2), graphYEnd+dataTextSize);
        }
        
        graph.noFill();
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
                graph.stroke(graphColors[j]);
                if(last_y[j])
                    graph.line(last_x, last_y[j], x, y);
                last_y[j] = y;
            }
            last_x = x;
            x+=sep;
        }
        console.log('Graph Loaded!');
        image(graph, 0, 0);
        state = 2;
    }else if(state == 2){
        // Interactivity
        image(graph, 0, 0);
        image(overlay, 0, 0);
        for(let i = 0; i<markers.length;i++){
            markers[i].draw();
        }


        if(mouseX>=graphXStart && mouseX<=graphXEnd && mouseY>=graphYStart && mouseY<=graphYEnd){
            cursor(CROSS);
            stroke(0);
            fill(255);
            let dataTextSize = 12;
            textSize(dataTextSize);
            let time = round(map(mouseX, graphXStart, graphXEnd, 0, hoursRun)*60);
            let yVal = custom_round(map(mouseY, graphYEnd, graphYStart, min_data, max_data),4);
            let txt = convert_time_to_string(time) + ' | ' + yVal;
            rect(mouseX + 5, mouseY + 5, textWidth(txt)+2, dataTextSize+1);
            noStroke();
            fill(0);
            text(txt, mouseX + 6, mouseY + dataTextSize + 4.5);
            if(!lastMouse && mouseIsPressed){
                // CLICK
                if(mouseButton == LEFT){
                    markers.push(new Marker(txt, dataTextSize));
                }else if(mouseButton == RIGHT){
                    for(let i = 0; i<markers.length;i++){
                        if(markers[i].isMouseInside()){
                            markers.splice(i);
                            break;
                        }
                    }
                }
            }
            lastMouse = mouseIsPressed;
        }else{
            cursor(ARROW);
        }
        
    }
}

function keyPressed(){

    if (keyCode == BACKSPACE || keyCode == DELETE){
        overlay.clear();
        markers = [];
    }
    // IF YOU'VE READ THIS AND WANT TO ADD MORE FEATURES, JUST DO IT (AND IT WOULD BE NICE IF YOU SEND A PULL REQUEST, SO I CAN ADD IT MYSELF)
}