// Functions to support the optimizter page




function refreshProfile() {

    // replaces all the profile data on the optimizer page
    // and also replorts the heatmap

    var e = document.getElementById("profile-selection");
    var currentProfile = e.options[e.selectedIndex].value;

    var queryUrl = $SCRIPT_ROOT + "get_bioprofile/" + currentProfile;
    var profile_data = JSON.parse(getResponseFromURL(queryUrl));


    var tsElement = document.getElementById('this_ts');
    tsElement.innerHTML = profile_data.meta.training_set;

    var tsElement = document.getElementById('cmps');
    tsElement.innerHTML = profile_data.meta.num_cmps;

    var tsElement = document.getElementById('aids');
    tsElement.innerHTML = profile_data.meta.num_aids;

    var tsElement = document.getElementById('tot_acts');
    tsElement.innerHTML = profile_data.meta.num_total_actives;

    var tsElement = document.getElementById('tot_inacts');
    tsElement.innerHTML = profile_data.meta.num_total_inactives;

    var queryUrlClassification = $SCRIPT_ROOT + "get_bioprofile_class_overview/" + currentProfile;
    var classificationData = JSON.parse(getResponseFromURL(queryUrlClassification));

    // plotHeatMap comes from
    // plotHeatMap(profile_data);

    aidStackedBar(classificationData);
    tableUpdate();
}


function addFilter() {

    var statsFilter = document.getElementById("stats-filter");
    var selectedStat = statsFilter.options[statsFilter.selectedIndex].value;

    var statsThreshold = document.getElementById("stats-threshold");
    var selectedThreshold = statsThreshold.options[statsThreshold.selectedIndex].value;


    var appliedFilters = document.getElementById('applied-filters');


    var appliedFilter = document.createElement("li");
    appliedFilter.classList.add("applied-filter");
    appliedFilter.classList.add("list-group-item");

    var newStat = document.createElement("span");
    newStat.classname = "stat";
    newStat.setAttribute("data-value", selectedStat)
    newStatText = document.createTextNode(selectedStat + " @ ");
    newStat.appendChild(newStatText);

    appliedFilter.appendChild(newStat);

    var threshold = document.createElement("span");
    threshold.classname = "thresh";
    threshold.setAttribute("data-value", selectedThreshold);

    threshText = document.createTextNode(selectedThreshold);
    threshold.appendChild(threshText);

    appliedFilter.appendChild(threshold);

    appliedFilters.append(appliedFilter);


}

function deleteProfile() {
    var e = document.getElementById("profile-selection");
    var currentProfile = e.options[e.selectedIndex].value;


    data = {
        profile_name: currentProfile
    }

    postData('/delete_profile', data);

    location.reload();
}

function clearFilters() {

    // removes the applied filters

    var statsFilters = document.getElementById("applied-filters");
    while (statsFilters.firstChild) {
        statsFilters.removeChild(statsFilters.firstChild);
    }


}

function aggFilters() {

    var statsFilters = document.getElementsByClassName("applied-filter");

    filters = [];


    for (var i = 0; i < statsFilters.length; i++) {

        // for each filter the first child node is the stats
        // and the second is the threshold
        // values for both are stored in the "data-value" attribute

        var statVal = statsFilters[i].children[0].getAttribute("data-value");
        var threshVal = statsFilters[i].children[1].getAttribute("data-value");

        var filter = {
            stat : statVal,
            thresh : threshVal
        };

        filters.push(filter);
    }

    return filters;
}




function postData(url, data) {
    // function that uses fetch model to send the current filters to the flask function


    fetch(url, {

            method: 'POST',

            headers: {
                'Content-type': 'application/json'
            },

            body: JSON.stringify(data)
        }
        )
}

function aidStackedBar(data){

    // This is necessary for
    d3.select("#stackedBar").select("svg").remove();

    var cardBody = d3.select("#bar-card-body");
    currentWidth = parseInt(cardBody.style("width"));

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 30, left: 30},
      width = currentWidth - margin.left - margin.right,
      height = 750 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#stackedBar")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");




    stack = d3.stack().keys(["inactives", "actives"]);
    series = stack(data);

    console.log(series);
    //colour scale


    var x = d3.scaleBand()
        .domain(data.map(function(d) { return d.aid; }))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([d3.min(series, stackMin), d3.max(series, stackMax)])
        .rangeRound([height - margin.bottom, margin.top]);

    var z = d3.scaleOrdinal(["blue", "red"]);



    svg.append("g")
      .selectAll("g")
      .data(series)
      .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("width", x.bandwidth)
        .attr("x", function(d) { return x(d.data.aid); })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })



svg.append("g")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");


svg.append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y));



function stackMin(serie) {
  return d3.min(serie, function(d) { return d[0]; });
}

function stackMax(serie) {
  return d3.max(serie, function(d) { return d[1]; });
}

}

function tableUpdate() {

    var e = document.getElementById("profile-selection");
    var currentProfile = e.options[e.selectedIndex].value;


    var queryUrlDesc = $SCRIPT_ROOT + "get_bioprofile_descriptions/" + currentProfile;
    var descData = JSON.parse(getResponseFromURL(queryUrlDesc));

    var tableScroll = $("#assay-overview").empty();

    var table = $('<table></table>').addClass("table table-bordered table-striped mb-0");

    tableScroll.append(table);
    var head = $("                            <thead>\n" +
        "                              <tr>\n" +
        "                                  <th scope=\"row\" >AID</th>\n" +
        "                                  <th scope=\"row\" >No. Actives</th>\n" +
        "                                  <th scope=\"row\" >No. Inactives</th>\n" +
        "                                  <th scope=\"row\" >Source</th>\n" +
        "                                  <th scope=\"row\" >Description</th>\n" +
        "                              </tr>\n" +
        "                            </thead>");

    table.append(head);

    var tableBody = $('<tbody></tbody>')

    table.append(tableBody);

    for (var i = 0; i < descData.length; i++) {


        var row = $("<tr></tr>");

        tableBody.append(row);

        var rowHead = $("<th scope=\"row\"></th>");
        var rowLink = $("<a target=\"_blank\"></a>");

        rowLink.attr("href", "https://pubchem.ncbi.nlm.nih.gov/assay/" + descData[i].AID.toString());

        rowHead.append(rowLink);
        rowLink.text(descData[i].AID);
        row.append(rowHead);

        var actives = $("<td></td>").text(descData[i].no_actives.toString());
        row.append(actives);

        var inactives = $("<td></td>").text(descData[i].no_inactives.toString());
        row.append(inactives);

        var source = $("<td></td>").text(descData[i].Source);
        row.append(source);

        var desc = $("<td></td>").text(descData[i].Description);
        row.append(desc);

    }


}

function addToolButton() {

            var dropdownDiv = $("#dropdown-page-tools");

            var button = $("                      <button class=\"btn btn-info\" style=\"margin-left: 10px\" type=\"button\" id=\"dropdownMenuButton\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
                "                        <i class=\"fas fa-chevron-circle-down\"></i>\n" +
                "                        <span style=\"margin-left: 5px\">Actions</span>\n" +
                "                      </button>");

            var dropdown = $("<div class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuButton\"></div>")


            var link = $("<a onclick=\"downloadProfile()\" class=\"dropdown-item\" href=\"#\"><i class=\"fas fa-download\"></i><span style=\"margin-left: 10px\">Download bioprofile</span></a>");

            dropdown.append(link);

            dropdownDiv.append(button);
            dropdownDiv.append(dropdown);
}

function downloadProfile() {
    var e = document.getElementById("profile-selection");
    var currentProfile = e.options[e.selectedIndex].value;
    var queryUrl = $SCRIPT_ROOT + "download_bioprofile/" + currentProfile;

    window.open(queryUrl);
}