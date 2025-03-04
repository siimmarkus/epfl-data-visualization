const data_directory = "/static/data/geojson/maakond.json";
const color = d3.scaleSequential(d3.interpolateViridis).domain([0, 120000]);

d3.json(data_directory)
  .then(function (json) {

    var container = d3.select("body").select("#map-container");
    var width = container.node().getBoundingClientRect().width;
    var height = container.node().getBoundingClientRect().height;

    var svg = container
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    var path = d3
      .geoPath()
      .projection(d3.geoAlbers().fitSize([width - 50, height - 50], json));

    // bind data and create one path per GeoJSON feature
    var geos = svg
      .selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      // .attr("transform", "translate(680, -100) rotate(70)")
      .attr("transform", "translate(680, -300) rotate(70)")
      .style("fill", function (d) {
        //Get data value
        var value = 0; // d.properties.income;
        if (value) {
          return color(value);
        } else {
          return "#000000";
        }
      });
  })
  .catch(function (error) {
    console.error("Error loading the GeoJSON file:", error);
  });
