// Application des conventions de marges pour D3.
const scale = 600;

// Données à afficher.
bleu = [
  86, 51, 42, 29, 89, 56, 73, 37, 81, 57, 54, 74, 72, 85, 56, 60, 72, 75, 57,
  89, 53, 77, 97, 77, 60, 86, 86, 60, 53, 77, 74, 50, 64, 90, 51, 90, 73, 86,
  55, 74, 64, 57, 75, 66, 58, 79, 55, 65, 62, 68, 20, 50, 82, 76, 79, 71, 63,
  78, 69, 76, 53, 91, 92, 83, 47, 72, 91, 80, 51, 71, 64, 75, 78, 49, 92, 52,
  82, 78, 57, 41, 28,
];
rouge = [56, 77, 74, 50, 64, 90, 51, 90, 67, 98, 100, 54, 65];
vert = [62, 68, 50, 11, 63, 18, 69, 16, 53];

// Affichage de données avec un diagramme de boîte dans un élément svg.
// Paramètres: svg : élément où on affiche
//             donnees: tableau de nombres entre 0 et 100
//             y : position verticale de la ligne horizontale
//             h : hauteur de la boîte
//             strokeC: couleur du trait des lignes
//             fillC: couleur de remplissage de la boite
//             y : fonction de transformation des données pour l'horizontale
function moustache(svg, donnees, y, h, strokeC, fillC, scaleData) {
  svg
    .append("line")
    .attr("x1", scaleData(d3.min(donnees)))
    .attr("x2", scaleData(d3.max(donnees)))
    .attr("y1", y)
    .attr("y2", y)
    .attr("stroke", strokeC);
  const sortFunction = (a, b) => {
    return a - b;
  };
  const firstQuartile = d3.quantile(donnees.sort(sortFunction), 0.25);
  const thirdQuartile = d3.quantile(donnees.sort(sortFunction), 0.75);
  const median = d3.median(donnees);
  svg
    .append("rect")
    .attr("x", scaleData(firstQuartile))
    .attr("width", scaleData(thirdQuartile - firstQuartile))
    .attr("height", 30)
    .attr("y", y - 15)
    .attr("stroke", strokeC)
    .attr("fill", fillC)
    .attr("stroke-width", 3);
  svg
    .append("line")
    .attr("x1", scaleData(median))
    .attr("x2", scaleData(median))
    .attr("y1", y - 15)
    .attr("y2", y + 15)
    .attr("stroke", strokeC)
    .attr("stroke-width", 3);
}

d3.select(window).on("load", function () {
  // Mettre en place la surface de dessin.

  const svg = d3
    .select("#boxPlot")
    .append("svg")
    .attr("width", scale)
    .attr("height", scale - 200)
    .attr("alignment-baseline", "middle");

  // Définir la fonction d'échelle (en utilisant d3.scale).
  const scaleData = d3
    .scaleLinear()
    .domain([0, 100]) // unit
    .range([10, scale - 10]);
  // Afficher l'axe des x.
  var x_axis = d3.axisBottom().scale(
    d3
      .scaleLinear()
      .domain([0, 100]) // unit
      .range([10, scale - 10])
  );
  svg
    .append("g")
    .call(x_axis)
    .append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")

    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("fill", "#5D6971");

  // Afficher les données.
  moustache(svg, bleu, 50, 30, "blue", "lightblue", scaleData);
  moustache(svg, vert, 130, 30, "green", "lightgreen", scaleData);
  moustache(svg, rouge, 210, 30, "red", "pink", scaleData);
});
