function convert_time_to_string(minutes){
    let hours = int(minutes/60) + 'h';
    if(int(minutes/60)==0)
        hours = ''
    if(minutes%60>9)
        return hours + minutes%60 + 'min';
    else
        return hours + '0' + minutes%60 + 'min';
}

function custom_round(n,dec_place=0){
    return round(n*(10**dec_place))/(10**dec_place);
}

class Marker {
    constructor(txt, dataTextSize){
        textSize(dataTextSize);
        let graphics = createGraphics(14 + textWidth(txt), dataTextSize + 13);

        graphics.stroke(0);
        graphics.noFill();
        graphics.line(1, 6, 11, 6);
        graphics.line(6, 1, 6, 11);
        graphics.fill(255);
        graphics.textSize(dataTextSize);
        graphics.rect(11, 11, textWidth(txt)+2, dataTextSize+1);
        graphics.noStroke();
        graphics.fill(0);
        graphics.text(txt, 12, 10.5 + dataTextSize);


        this.graphics = graphics;
        this.px = mouseX-6;
        this.py = mouseY-6;
        this.startX = mouseX + 5;
        this.startY = mouseY + 5;
        this.endX = mouseX + 7 + textWidth(txt);
        this.endY = mouseY + 6 + dataTextSize;
    }

    draw(){
        image(this.graphics, this.px, this.py);
    }

    isMouseInside(){
        return mouseX>=this.startX && mouseX<=this.endX && mouseY>=this.startY && mouseY<=this.endY;
    }
}