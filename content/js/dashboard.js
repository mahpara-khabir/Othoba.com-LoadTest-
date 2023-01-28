/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.32319444444444445, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Home Page-1"], "isController": false}, {"data": [0.0375, 500, 1500, "ToysPage-1"], "isController": false}, {"data": [0.945, 500, 1500, "WinterCollection-0"], "isController": false}, {"data": [1.0, 500, 1500, "Home Page-0"], "isController": false}, {"data": [0.0175, 500, 1500, "WinterCollection-1"], "isController": false}, {"data": [0.955, 500, 1500, "ToysPage-0"], "isController": false}, {"data": [0.01, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.9375, 500, 1500, "Registration-0"], "isController": false}, {"data": [0.03, 500, 1500, "ToysPage"], "isController": false}, {"data": [0.8775, 500, 1500, "ElectronicsPage-0"], "isController": false}, {"data": [0.0175, 500, 1500, "WinterCollection"], "isController": false}, {"data": [0.8925, 500, 1500, "MobilePage-0"], "isController": false}, {"data": [0.025, 500, 1500, "ElectronicsPage"], "isController": false}, {"data": [0.03, 500, 1500, "ElectronicsPage-1"], "isController": false}, {"data": [0.02, 500, 1500, "MobilePage-1"], "isController": false}, {"data": [0.0125, 500, 1500, "MobilePage"], "isController": false}, {"data": [0.01, 500, 1500, "Registration"], "isController": false}, {"data": [0.0, 500, 1500, "Home Page"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3600, 0, 0.0, 19269.856111111076, 69, 280426, 14626.0, 39632.700000000004, 60343.95, 171646.31999999925, 12.661923135092168, 2026.607171198873, 2.0388773798260393], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Home Page-1", 200, 0, 0.0, 37607.87500000001, 7180, 280275, 19456.0, 72847.10000000002, 160637.8999999995, 280027.31, 0.7134575938642647, 97.80620150717917, 0.08082136805493624], "isController": false}, {"data": ["ToysPage-1", 200, 0, 0.0, 20956.435, 427, 71356, 19913.5, 38399.5, 46075.44999999999, 68943.94, 0.9614829913658828, 340.3624203095855, 0.11267378805068938], "isController": false}, {"data": ["WinterCollection-0", 200, 0, 0.0, 231.1550000000001, 69, 2407, 113.0, 508.30000000000007, 726.6999999999992, 1590.4500000000032, 0.7557179509463477, 0.5940946782341895, 0.09815477292564868], "isController": false}, {"data": ["Home Page-0", 200, 0, 0.0, 186.77999999999997, 135, 282, 167.5, 257.0, 270.9, 280.99, 221.48394241417495, 170.43881506090807, 25.08997785160576], "isController": false}, {"data": ["WinterCollection-1", 200, 0, 0.0, 28898.619999999995, 374, 195723, 21287.0, 55103.50000000001, 72904.04999999993, 184552.86000000063, 0.7537896776041549, 161.13223096304168, 0.09790432336069589], "isController": false}, {"data": ["ToysPage-0", 200, 0, 0.0, 229.94999999999985, 69, 1917, 113.0, 468.6, 843.1499999999994, 1887.700000000002, 0.9629968461853288, 0.7448178732214652, 0.1128511929123432], "isController": false}, {"data": ["Registration-1", 200, 0, 0.0, 21333.675000000014, 576, 183451, 14204.0, 33803.700000000004, 58702.64999999998, 175055.91000000003, 0.7304308446337072, 101.19300470945288, 0.08845061009236299], "isController": false}, {"data": ["Registration-0", 200, 0, 0.0, 272.1650000000002, 99, 2557, 112.5, 646.8000000000003, 1277.6999999999998, 2379.100000000007, 0.7318367272261559, 0.5688887059297071, 0.0886208536875423], "isController": false}, {"data": ["ToysPage", 200, 0, 0.0, 21186.469999999987, 500, 71465, 20133.0, 38822.5, 46178.69999999999, 69152.92000000001, 0.9604625587683028, 340.74404764584625, 0.22510841221132097], "isController": false}, {"data": ["ElectronicsPage-0", 200, 0, 0.0, 387.8249999999999, 70, 6346, 204.0, 1205.9, 1236.75, 3231.9300000000003, 0.8769045270196207, 0.6842253096569111, 0.108756713800285], "isController": false}, {"data": ["WinterCollection", 200, 0, 0.0, 29129.914999999986, 446, 195835, 21396.0, 55210.700000000004, 73041.54999999993, 184758.91000000061, 0.7534971687343884, 161.66205228140106, 0.1957326629720189], "isController": false}, {"data": ["MobilePage-0", 200, 0, 0.0, 586.0950000000001, 71, 39076, 186.0, 933.5000000000001, 1229.75, 9367.430000000044, 0.7967524370665169, 0.6177943701472797, 0.09492558332237798], "isController": false}, {"data": ["ElectronicsPage", 200, 0, 0.0, 30764.754999999983, 494, 197374, 23994.0, 53089.000000000015, 89504.55, 186657.28000000006, 0.8746075198754558, 267.60567428276715, 0.2169436621566072], "isController": false}, {"data": ["ElectronicsPage-1", 200, 0, 0.0, 30376.834999999995, 422, 197151, 23840.0, 52882.90000000001, 89370.4, 186086.88000000003, 0.8750705525633004, 267.0645551510481, 0.10852925798392496], "isController": false}, {"data": ["MobilePage-1", 200, 0, 0.0, 32360.089999999986, 451, 179471, 25633.5, 64504.10000000003, 102459.84999999987, 174357.4700000004, 0.794773569010189, 228.3038302621958, 0.09468981974535455], "isController": false}, {"data": ["MobilePage", 200, 0, 0.0, 32946.325000000004, 525, 180407, 26257.0, 65856.1, 102679.94999999988, 174638.6900000004, 0.7944042166975822, 228.81370501189622, 0.18929162975997077], "isController": false}, {"data": ["Registration", 200, 0, 0.0, 21606.05, 722, 183569, 14597.0, 33914.3, 58805.84999999998, 175503.5, 0.7301428524490816, 101.72067860389386, 0.176831472077512], "isController": false}, {"data": ["Home Page", 200, 0, 0.0, 37796.39500000002, 7379, 280426, 19649.5, 73009.60000000002, 160807.5499999995, 280269.86, 0.712809180982251, 98.26584107028299, 0.16149583006629126], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
