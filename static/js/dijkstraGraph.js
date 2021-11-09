/* references: 
    http://bl.ocks.org/sdjacobs/3900867adc06c7680d48
    https://bl.ocks.org/mpmckenna8
    http://bl.ocks.org/mayblue9/e5b256b077ab6fa226f045b8c187ac1d
  */
/**
 * Function to take input file from user which specifies the graph nodes and edges.
 * It also creates the graph inserted by user.
 * @param {file} data_file - graph layout file
 */
function makeDJGraph(data_file) {
  // Dimensions of animation area
  var width = 960,
    height = 500;

  var color = d3.scale.category20();

  // Defining how nodes interact with each other
  var force = d3.layout
    .force()
    .charge(-5000)
    .linkDistance(1)
    .size([width, height]);

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Reading the CSV file and creating graph accordingly
  d3.csv(data_file, function (error, data) {
    var nodes = [],
      nodesByName = {},
      links = [];

    /**
     * Function to add nodes to graph with name specified.
     * @param {string} fullname - name of the node
     * @returns {node} - Node with name
     */
    function addNodeByName(fullname) {
      var name = fullname.split(",")[0];
      if (!nodesByName[name]) {
        var node = { name: name, links: [] };
        nodesByName[name] = node;
        nodes.push(node);
        return node;
      } else return nodesByName[name];
    }

    // Parse the file to add the nodes and edges to graph
    data.forEach(function (d) {
      for (k in d) {
        if (d.hasOwnProperty(k) && k != "nodes" && d[k] < 750) {
          var edge_weight = parseFloat(d[k]).toFixed(2);
          if (typeof parseFloat(edge_weight) == "number") {
            links.push({
              source: addNodeByName(d["nodes"]),
              target: addNodeByName(k),
              value: parseFloat(edge_weight),
              id: addNodeByName(d["nodes"]).name + addNodeByName(k).name,
            });
          } else {
            alert("Invalid File");
          }
        }
      }
    });

    // Visualising graph
    force.nodes(nodes).links(links).start();

    // defining edges
    var glink = svg.append("g").selectAll(".link").data(links).enter();

    // setting edge visual
    var link = glink
      .append("line")
      .attr("class", function (d) {
        return "link " + d.id;
      })
      .style("stroke-width", 2);

    // adding edge weight in the right position
    var linktext = glink
      .append("text")
      .attr("class", function (d) {
        return "linktext " + d.id;
      })
      .attr("text-anchor", "middle")
      .style("opacity", 0)
      .text(function (d) {
        return d.value;
      });

    // defining nodes
    var gnode = svg.append("g").selectAll(".node").data(nodes).enter();

    // adding node visual
    var node = gnode
      .append("circle")
      .attr("class", function (d) {
        return "node " + d.name;
      })
      .attr("r", 15)
      .call(force.drag);

    // adding node name in the middle of node
    var nodetext = gnode
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("class", function (d) {
        return "nodetext " + d.name;
      })
      .text(function (d) {
        return d.name;
      });

    link.each(function (d) {
      d.source.links.push(d);
      d.selection = d3.select(this);
    });

    node.each(function (d) {
      d.selection = d3.select(this);
    });

    // Recreate graph on every instance
    force.on("tick", function () {
      link
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });

      linktext
        .attr("x", function (d) {
          return (d.source.x + d.target.x) / 2;
        })
        .attr("y", function (d) {
          return (d.source.y + d.target.y) / 2;
        });

      nodetext
        .attr("x", function (d) {
          return d.x;
        })
        .attr("y", function (d) {
          return d.y;
        });

      node
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        });
    });

    // action to perform when user taked the mouse pointer over node
    node.on("mouseover", function (d) {
      d3.select(this).attr("r", 16.5);
    });

    // action on taking mouse pointer away from node
    node.on("mouseout", function (d) {
      d3.select(this).attr("r", 15);
    });

    var dijkstra = d3.dijkstra().nodes(nodes).edges(links);

    // Dijkstra's algorithm visualisation starts on clicking start node
    node.on("click", dijkstra.start);
  });
}
