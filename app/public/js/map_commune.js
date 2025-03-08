const data_directory = "/static/data/geojson/maakond.json";
const color = d3.scaleSequential(d3.interpolateViridis).domain([0, 100000]);

function createMap(json) {
  var container = d3.select("body").select("#map-container");
  var width = container.node().getBoundingClientRect().width;
  var height = container.node().getBoundingClientRect().height;

  // Remove existing SVG if any
  container.select("svg").remove();

  var svg = container.append("svg").attr("viewBox", `0 0 ${width} ${height}`);
  var zoomGroup = svg.append("g");
  var rotationGroup = zoomGroup.append("g");

  var projection = d3.geoAlbers().fitSize([width, height], json);
  var path = d3.geoPath().projection(projection);

  // bind data and create one path per GeoJSON feature
  rotationGroup
    .selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path);

  // find the center of the map (for rotation)
  var node = svg.node();
  var xCenter = node.getBBox().x + node.getBBox().width / 2;
  var yCenter = node.getBBox().y + node.getBBox().height / 1.7;

  // Apply scaling and rotation
  rotationGroup.attr("transform", `rotate(70, ${xCenter}, ${yCenter})`);

  // Color the paths
  var paths = rotationGroup.selectAll("path").style("fill", function (d) {
    var value = Math.sqrt(d.properties.AREA);
    return value ? color(value) : "#000000";
  });

  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  paths
    .on("click", function (event, d) {
      const pathId = d.properties.MNIMI;
      const formattedPathId = formatPathID(pathId);
      window.location.href = `/county/${formattedPathId}`;
    })
    .on("mouseover", function (event, d) {
      d3.select(this)
        .style("fill", "orange") // Change fill color on hover
        .style("cursor", "pointer"); // Change cursor to pointer
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(d.properties.MNIMI)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function (event, d) {
      d3.select(this).style("fill", function (d) {
        var value = Math.sqrt(d.properties.AREA); // Reset to original color
        return value ? color(value) : "#000000";
      });
      tooltip.transition().duration(500).style("opacity", 0);
    });

  // Create zoom behavior
  var zoom = d3.zoom().scaleExtent([0.5, 1.5]).on("zoom", zoomed);

  // Apply zoom behavior to SVG
  zoomGroup.call(zoom);

  // Zoom function
  function zoomed(event) {
    zoomGroup.attr("transform", event.transform);
  }

  var legendWidth = 300; // Adjust as needed
  var legendHeight = 50; // Adjust as needed

  var legend = svg
    .append("g")
    .attr("class", "legend")
    .attr(
      "transform",
      "translate(" + (width - legendWidth) / 2 + "," + 10 + ")"
    );

  var legendItems = legend
    .selectAll(".legend-item")
    .data(color.ticks(6))
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", function (d, i) {
      return "translate(" + i * (legendWidth / 6) + ", 140)";
    });

  legendItems
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", color);

  legendItems
    .append("text")
    .attr("x", 10)
    .attr("y", -5)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text(function (d) {
      return d;
    });
}

d3.json(data_directory)
  .then(function (json) {
    createMap(json);

    // Add window resize event listener
    window.addEventListener("resize", function () {
      createMap(json);
    });
  })
  .catch(function (error) {
    console.error("Error loading the GeoJSON file:", error);
  });

function formatPathID(pathID) {
  return pathID
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-zõäöõü0-9-]/g, "");
}
