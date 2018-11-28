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