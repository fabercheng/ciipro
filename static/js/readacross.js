function readAcrossGraph(data) {
    d3.select("#graph").select("svg").remove();


    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 10, bottom: 30, left: 30},
      width = 750 - margin.left - margin.right,
      height = 750 - margin.top - margin.bottom;

        // append the svg object to the body of the page
    var root = d3.select("#graph");

        // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 30, left: 250},
      width = 750 - margin.left - margin.right,
      height = 750 - margin.top - margin.bottom;

    // append the svg object to the body of the page

    var svg = root.append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // unique CIDS
    var cids = data.cids;
    var aids = data.aids;
    // Labels of row and columns

    // Build X scales and axis:
    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(aids)
      .padding(0.01);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      // .call(d3.axisBottom(x))
      //   .selectAll("text")
      //   .style("text-anchor", "end")
      //   .attr("dx", "-.8em")
      //   .attr("dy", ".15em")
      //   .attr("transform", "rotate(-65)")
      //   .style("font-size",  0);


    // Build X scales and axis:
    var y = d3.scaleBand()
      .range([0, height])
      .domain(cids)
      .padding(0.01);
    svg.append("g")
      // .call(d3.axisLeft(y))
      // .style("font-size",  0);

    // Build color scale
    var myColor = d3.scaleOrdinal()
      .range(["blue", "white", "red"])
      .domain([-1,0,1]);

    var dataPlot = data.cids.map(function(e, i) {
          return [e, data.aids[i], data.outcomes[i]];
        });

    svg.selectAll()
      .data(dataPlot)
      .enter()
      .append("rect")
      .attr("x", function(d, i) { return x(d[1]) })
      .attr("y", function(d, i) { return y(d[0]) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d[2])} )

};


function bioactivityTable(data) {
    var tableScroll = $("#bioactivity-table").empty();
    var table = $('<table></table>').addClass("table table-bordered table-striped mb-0");
    tableScroll.append(table);

    var header = $('<thead></thead>').append($('<tr></tr>'));

    var uniqueAids = new Set(data.aids);
    var uniqueAids = Array.from(uniqueAids).sort(function(a, b){return a - b});

    var uniqueCids = new Set(data.cids);
    var uniqueCids = Array.from(uniqueCids).sort(function(a, b){return a - b});

    header.append($('<th scope="row" >CID</th>'));
    uniqueAids.map(function (aid, i) {
            header.append($('<th scope="row" >'+aid+'</th>'));
    });

    table.append(header);

    var matrix = [];

    for (var i = 0; i < uniqueCids.length; i++) {
        var row = [];
        for (var j = 0; j < uniqueAids.length; j++) {
            row.push(0)
        }
        matrix.push(row)
    }

    data.cids.map(function(cid, i) {
        var aid = data.aids[i];
        var outcome = data.outcomes[i];

        matrix[uniqueCids.indexOf(cid)][uniqueAids.indexOf(aid)] = outcome
    });

                // Build color scale
    var color = d3.scaleOrdinal()
              .range(["rgba(0, 0, 255, 0.3)", "rgba(0, 0, 0, 0.3)", "rgba(255, 0, 0, 0.3)"])
              .domain([-1,0,1]);

    var tableBody = $('<tbody></tbody>')
    table.append(tableBody);

    matrix.map(function(row, i) {
        var tableRow = $('<tr></tr>');
        tableRow.append($('<td scope="row" >'+uniqueCids[i]+'</td>'));
        row.map(function(datum, j) {
            tableRow.append($('<td>'+datum+'</td>').css("background-color", color(datum)));
        })
        tableBody.append(tableRow);
    })

}
