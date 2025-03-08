import { createMap } from "./charts/countryMap.js";

const dataDirectory = "/static/data/geojson/counties.json";

d3.json(dataDirectory)
  .then(function (json) {
    createMap(json);

    // Add window resize event listener
      window.addEventListener("resize", function () {
        console.log("resize");
      createMap(json);
    });
  })
  .catch(function (error) {
    console.error("Error loading the GeoJSON file:", error);
  });
