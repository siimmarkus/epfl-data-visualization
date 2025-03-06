const data_directory = "/static/data/geojson/maakond.json";
const color = d3.scaleSequential(d3.interpolateViridis).domain([0, 120000]);

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
  var yCenter = node.getBBox().y + node.getBBox().height / 2;

  // Apply scaling and rotation
  rotationGroup.attr("transform", `rotate(70, ${xCenter}, ${yCenter})`);

  // Color the paths
  rotationGroup.selectAll("path").style("fill", function (d) {
    var value = 0; // d.properties.income;
    return value ? color(value) : "#000000";
  });

  // Create zoom behavior
  var zoom = d3.zoom().scaleExtent([0.5, 1.5]).on("zoom", zoomed);

  // Apply zoom behavior to SVG
  zoomGroup.call(zoom);

  // Zoom function
  function zoomed(event) {
    zoomGroup.attr("transform", event.transform);
  }

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
