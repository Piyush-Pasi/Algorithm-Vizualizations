d3.dijkstra = function () {
  function highlightCodeLine(lineNo) {
    $(".code").removeClass("code-highlight");
    if (Array.isArray(lineNo)) {
      lineNo.forEach((d) => {
        $("#code-line-" + d).addClass("code-highlight");
      });
    } else {
      $("#code-line-" + lineNo).addClass("code-highlight");
    }
  }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let animationSpeed = 1000;

  var dijkstra = {},
    nodes,
    edges,
    source,
    go,
    dispatch = d3.dispatch("start", "tick", "step", "end");

  var color = d3.scale
    .linear()
    .domain([0, 3, 10])
    .range(["green", "yellow", "red"]);
  var translate_speed = 3000;

  dijkstra.run = function (src) {
    // clear previous run
    clearInterval(go);
    source = src;
    var unvisited = [];
    var current = src;
    let nodeSize = 20;

    let p = Promise.resolve();
    p = p
      .then(() => highlightCodeLine(1))
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine(2))
      .then(() => delay(animationSpeed))
      .then(() => {
        // reset styles
        d3.selectAll(".node")
          .style("fill", "#fff")
          .attr("r", 15)
          .style("stroke-width", "1.5");
        d3.select("." + src.name)
          .style("fill", "#fdb03f")
          .style("stroke-width", "0");
        d3.selectAll(".nodetext").text(function (d) {
          return d.name;
        });
        d3.selectAll(".linktext").style("opacity", "0");
      })
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine(3))
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine([4, 5, 6]))
      .then(() => delay(animationSpeed))
      .then(() => {
        // Initialization
        // All Node distances set to Infinity, setting all nodes as unvisited
        nodes.forEach(function (d) {
          if (d != src) {
            d.distance = Infinity;
            unvisited.push(d);
            d.visited = false;
          }
        });
      })
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine(7))
      .then(() => {
        // Setting Source distance as zero
        // var current = src;
        current.distance = 0;
      })
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine(8))
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine([9, 10]))
      .then(() => {
        function tick() {
          current.visited = true;
          p = p
            .then(() => delay(animationSpeed))
            .then(() => highlightCodeLine([12, 13, 14, 15]));
          current.links.forEach(function (link) {
            if (!link.target.visited) {
              var dist = current.distance + link.value;
              link.target.distance = Math.min(dist, link.target.distance);
              d3.select("." + link.target.name)
                .transition()
                .delay(translate_speed / 8)
                .duration(500)
                .attr("r", nodeSize + 3)
                .style("fill", "#ecf0f1");
              d3.select(".nodetext." + link.target.name)
                .transition()
                .delay(translate_speed / 8)
                .duration(500)
                .text(link.target.distance);
              d3.select(".linktext." + link.id)
                .style("opacity", 1)
                .transition()
                .duration(translate_speed)
                .text(+link.value);
            }
          });
          //   When all nodes visited or node has infinite distance -> stop
          if (unvisited.length == 0 || current.distance == Infinity) {
            clearInterval(go);
            return true;
          }

          //   find minimum amongst the adjacent nodes
          unvisited.sort(function (a, b) {
            return b.distance - a.distance;
          });

          //   select minimum to visit next
          current = unvisited.pop();

          //   applying appropriate css
          d3.select("." + current.name)
            .transition()
            .delay((translate_speed * 2) / 5)
            .duration(translate_speed / 5)
            .attr("r", 10)
            .transition()
            .duration(translate_speed / 5)
            .attr("r", 15)
            .style("fill", "#D0E1C3")
            .style("stroke-width", "0");

          d3.select(".nodetext." + current.name)
            .transition()
            .delay((translate_speed * 4) / 5)
            .text(function (d) {
              return d.distance;
            });
        }
        tick();
        go = setInterval(tick, translate_speed);
      });

    // recursively relax adjacent nodes starting from source
    // function tick() {
    //   current.visited = true;
    //   current.links.forEach(function (link) {
    //     if (!link.target.visited) {
    //       var dist = current.distance + link.value;
    //       link.target.distance = Math.min(dist, link.target.distance);
    //       d3.select("." + link.target.name)
    //         .transition()
    //         .delay(translate_speed / 8)
    //         .duration(500)
    //         .attr("r", nodeSize + 3)
    //         .style("fill", "#ecf0f1");
    //       d3.select(".nodetext." + link.target.name)
    //         .transition()
    //         .delay(translate_speed / 8)
    //         .duration(500)
    //         .text(link.target.distance);
    //       d3.select(".linktext." + link.id)
    //         .style("opacity", 1)
    //         .transition()
    //         .duration(translate_speed)
    //         .text(+link.value);
    //     }
    //   });
    //   //   When all nodes visited or node has infinite distance -> stop
    //   if (unvisited.length == 0 || current.distance == Infinity) {
    //     clearInterval(go);
    //     return true;
    //   }

    //   //   find minimum amongst the adjacent nodes
    //   unvisited.sort(function (a, b) {
    //     return b.distance - a.distance;
    //   });

    //   //   select minimum to visit next
    //   current = unvisited.pop();

    //   //   applying appropriate css
    //   d3.select("." + current.name)
    //     .transition()
    //     .delay((translate_speed * 2) / 5)
    //     .duration(translate_speed / 5)
    //     .attr("r", 10)
    //     .transition()
    //     .duration(translate_speed / 5)
    //     .attr("r", 15)
    //     .style("fill", "#D0E1C3")
    //     .style("stroke-width", "0");

    //   d3.select(".nodetext." + current.name)
    //     .transition()
    //     .delay((translate_speed * 4) / 5)
    //     .text(function (d) {
    //       return d.distance;
    //     });
    // }

    // tick();
    // go = setInterval(tick, translate_speed);
  };

  dijkstra.nodes = function (_) {
    if (!arguments.length) return nodes;
    else {
      nodes = _;
      return dijkstra;
    }
  };

  dijkstra.edges = function (_) {
    if (!arguments.length) return edges;
    else {
      edges = _;
      return dijkstra;
    }
  };

  dijkstra.source = function (_) {
    if (!arguments.length) return source;
    else {
      source = _;
      return dijkstra;
    }
  };

  dispatch.on("start.code", dijkstra.run);

  return d3.rebind(dijkstra, dispatch, "on", "end", "start", "tick");
};
