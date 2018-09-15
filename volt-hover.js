$(document).ready(function () {
    // $(".substation-list-name").hover(function () {
    //     console.log("hover In handler");
    //     $("#volt-hover-div")
    //         .css("visibility", "visible");
    // },
    //     function () {
    //         console.log("hover Out handler");
    //         $("#volt-hover-div")
    //             .css("visibility", "hidden");
    //     });

    // $(".substation-list-name").mousemove(function (e) {
    //     console.log("mouse move handler");
    //     $("#volt-hover-div")
    //         .css("top", (e.pageY - 15) + "px")
    //         .css("left", (e.pageX - 20) + "px");
    // });
});
var voltPlot = new VoltPlot('volt-hover-div');
var oneMinuteLabels = Array.apply(null, { length: 1440 }).map(Function.call, function (k) {
    return getTimeStringFromMinutes(k);
});
function getTimeStringFromMinutes(m) {
    var hrs = parseInt(m / 60);
    var mins = m - hrs * 60;
    return makeTwoDigits(hrs) + ":" + makeTwoDigits(mins);
    //return makeTwoDigits(hrs) + " HRS";
}
function VoltPlot(divName) {
    this.divName = null;
    this.data = [];
    this.pntCnt = 10;
    this.layout = {
        autosize: true,
        margin: { l: 50, r: 10, b: 10, t: 10, pad: 1 },
        paper_bgcolor: '#333333',
        plot_bgcolor: '#333333',
        legend: { "orientation": "h", font: { color: '#fff' } },
        xaxis: { dtick: 60, tickfont: { color: '#fff' } },
        yaxis: { tickfont: { color: '#fff' } }
    };

    var ctorFunc = function (divName) {
        this.divName = divName;
        var trace1 = { x: [], y: [] };
        var trace2 = { x: [], y: [] };
        this.data = [trace1, trace2];
        Plotly.newPlot(divName, this.data, this.layout);
    }.bind(this);

    ctorFunc(divName);

    this.setPlotData = function (data) {
        // plotly restyle https://plot.ly/javascript/plotlyjs-function-reference/#plotlyrestyle
        this.data = data;
        Plotly.newPlot(this.divName, this.data, this.layout);
    }.bind(this);
}

function showVoltData(voltSource) {
    //console.log(voltSource);
    // get the last 2 days voltage info from api and present in the div
    // get yesterday date
    var todayTime = new Date();
    var yesterdayTime = new Date(todayTime);
    yesterdayTime.setDate(todayTime.getDate() - 1);
    var fromTimeStr = makeTwoDigits(yesterdayTime.getDate()) + "/" + makeTwoDigits(yesterdayTime.getMonth() + 1) + "/" + yesterdayTime.getFullYear() + "/" + "00:00:00";
    var toTimeStr = makeTwoDigits(todayTime.getDate()) + "/" + makeTwoDigits(todayTime.getMonth() + 1) + "/" + todayTime.getFullYear() + "/" + makeTwoDigits(todayTime.getHours()) + ":" + makeTwoDigits(todayTime.getMinutes()) + ":00";
    $.ajax({
        url: createUrl(document.getElementById("serverBaseAddressInput").value, voltSource[3], 'history', fromTimeStr, toTimeStr, 60, 'average'),
        indexValue: voltSource,
        type: 'GET',
        success: function (data) {
            var pointData = data;
            //todo check if pointData is a array of objects
            // get the first 1440 points into yesterday data
            var yestVolts = [];
            var todayVolts = [];
            var yestTimes = oneMinuteLabels;
            var todayTimes = oneMinuteLabels;
            for (var k = 0; k < 1440; k++) {
                yestVolts[k] = +pointData[k]["dval"];
                //yestTimes[k] = k;
            }
            for (var k = 1440; k < pointData.length; k++) {
                todayVolts[k - 1440] = +pointData[k]["dval"];
                //todayTimes[k] = k - 1440;
            }
            // console.log(pointData);
            //console.log(JSON.stringify(pointData, null, '\t'));
            var name = this.indexValue[5].substring(0, this.indexValue[5].indexOf(","))
            var trace1 = { x: yestTimes, y: yestVolts, name: 'yesterday', line: { color: 'red' } };
            var trace2 = { x: todayTimes, y: todayVolts, name: name, line: { color: 'yellow' } };
            voltPlot.setPlotData([trace1, trace2]);
        },
        error: function (textStatus, errorThrown) {
            //console.log(textStatus);
            //console.log(errorThrown);
            callback(textStatus);
        }
    });
}