var start_stop_btn,
    wpid=false,map,z,op,prev_lat,prev_long,min_speed=0,max_speed=0,min_altitude=0,max_altitude=0,distance_travelled=0,min_accuracy=1500,date_pos_updated="",info_string="";

var speeds = [];
var speedsChart = null;
var speedData = null;


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
};

function mobileAndTabletcheck() {
     var check = false;
     (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
     return check;
};

function setSpeed(coord) {
    if (mobileAndTabletcheck()) {
        if (coord.coords.speed !== null) {
           // convierto de m/s a km/h => 3600/1000 = 3.6
           sessionAvgSpeed = coord.coords.speed * 3.6;
        } else {
           sessionAvgSpeed = 0;
        }
    }
    else{
           sessionAvgSpeed = getRandomArbitrary(0, 15);
    }
};

function updateSpeedChart(){
    // get the last 400 rows only
    if (speedData.getNumberOfRows() > 400) {
       speedData.removeRow(0);
    }
    speedData.addRow(['', sessionAvgSpeed, 'color: #0000FF']);
    document.getElementById('speeds_div').style.display = 'block';
    speedsChart.clearChart();
    speedsChart.draw(speedData, {
        height: '100%',
        legend: 'none',
        titleY: 'Current Speed:'+sessionAvgSpeed,
        focusBorderColor: '#00ff00'
    });
};



function format_time_component(time_component){
    if(time_component<10)
        time_component="0"+time_component;
    else if(time_component.length<2)
        time_component=time_component+"0";return time_component;
}

function geo_success(position){
    start_stop_btn.innerHTML="Stop";
    info_string="";
    var d=new Date();
    var h=d.getHours();
    var m=d.getMinutes();
    var s=d.getSeconds();
    var current_datetime=format_time_component(h)+":"+format_time_component(m)+":"+format_time_component(s);
    if(position.coords.accuracy<=min_accuracy){
        if(prev_lat!=position.coords.latitude||prev_long!=position.coords.longitude){
            if(position.coords.speed>max_speed)
                max_speed=position.coords.speed;
            else if(position.coords.speed<min_speed)
                     min_speed=position.coords.speed;
            if(position.coords.altitude>max_altitude)
                max_altitude=position.coords.altitude;
            else if(position.coords.altitude<min_altitude)
                min_altitude=position.coords.altitude;
            prev_lat=position.coords.latitude;
            prev_long=position.coords.longitude;
           info_string="Current positon: lat="+position.coords.latitude+", long="+position.coords.longitude+" (accuracy "+Math.round(position.coords.accuracy,1)+"m)<br />Speed: current="+position.coords.speed+"min="+(min_speed?min_speed:"Not recorded/0")+"m/s, max="+(max_speed?max_speed:"Not recorded/0")+"m/s<br />Altitude: min="+(min_altitude?min_altitude:"Not recorded/0")+"m, max="+(max_altitude?max_altitude:"Not recorded/0")+"m (accuracy "+Math.round(position.coords.altitudeAccuracy,1)+"m)<br />last reading taken at: "+current_datetime;
        }
        setSpeed(position);
        updateSpeedChart();
    }
    else
        info_string="Accuracy not sufficient ("+Math.round(position.coords.accuracy,1)+"m vs "+min_accuracy+"m) - last reading taken at: "+current_datetime;if(info_string)
    op.innerHTML=info_string;
}
function geo_error(error){
    switch(error.code){
        case error.TIMEOUT:op.innerHTML="Timeout!";break;
    };
}
function get_pos(){
    if(!!navigator.geolocation)
        wpid=navigator.geolocation.watchPosition(geo_success,geo_error,{enableHighAccuracy:true,maximumAge:30000,timeout:27000});
    else
        op.innerHTML="ERROR: Your Browser doesnt support the Geo Location API";
};
function init_geo(){

    speedsChart = new google.visualization.AreaChart(document.getElementById('speeds_div'));

    speedData = new google.visualization.DataTable();
    speedData.addColumn('string', 'test');
    speedData.addColumn('number', 'Current Speed');
    speedData.addColumn({type: 'string', role: 'style'});

    op=document.getElementById("output");
    if(op){
        start_stop_btn=document.getElementById("geo_start_stop");
        if(start_stop_btn){
            start_stop_btn.onclick=function(){
                if(wpid){
                    start_stop_btn.innerHTML="Start";
                    navigator.geolocation.clearWatch(wpid);
                    wpid=false;
                }
                else{
                    start_stop_btn.innerHTML="Aquiring Geo Location...";get_pos();
                }
            }
        }
        else
            op.innerHTML="ERROR: Couldn't find the start/stop button";
    }
}

// Load the Visualization API and the piechart package.
google.load("visualization", "1", {packages: ["corechart"]});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(init_geo);