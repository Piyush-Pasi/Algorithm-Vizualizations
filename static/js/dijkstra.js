// dijkstra code
d3version3.dijkstra = function () {
  /* references: 
    http://bl.ocks.org/sdjacobs/3900867adc06c7680d48
    https://bl.ocks.org/mpmckenna8
    http://bl.ocks.org/mayblue9/e5b256b077ab6fa226f045b8c187ac1d
  */

  /**
   * Function to highlight the appropriate code line of Dijkstra's code by selecting the line
   * and applying code-highlight style to it.
   * @param {int} lineNo - line number to highlight
   */

  // to highlight given lines
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

  // delay function in milliseconds
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // set initial variables
  let animationSpeed = 1000;
  var dijkstra = {},
    nodes,
    edges,
    source,
    go,
    dispatch = d3version3.dispatch("start", "tick", "step", "end");

  // define colors
  var color = d3version3.scale
    .linear()
    .domain([0, 3, 10])
    .range(["green", "yellow", "red"]);
  var translate_speed = 3000;

  // on click run
  dijkstra.run = function (src) {
    // clear previous runs and reset variables
    clearInterval(go);
    source = src;
    var unvisited = [];
    var current = src;
    let nodeSize = 20;
    let newCurrent;
    let p = Promise.resolve();
    p = p
      .then(() => highlightCodeLine(1))
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine(2))
      .then(() => delay(animationSpeed))
      .then(() => {
        // set styles for nodes and links
        d3version3
          .selectAll(".node")
          .style("fill", "#fff")
          .attr("r", nodeSize + 3)
          .style("stroke-width", "1.5");
        d3version3.selectAll(".nodeNametext").text("");
        d3version3
          .select("." + src.name)
          .style("fill", "#fdb03f")
          .style("stroke-width", "0");
        d3version3.selectAll(".nodetext").text(function (d) {
          return d.name;
        });
        d3version3.selectAll(".linktext").style("opacity", "0");
      })
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine(3))
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine([4, 5, 6]))
      .then(() => delay(animationSpeed))
      .then(() => {
        // Initialization
        // All Node distances set to Infinity
        // Min heap created
        minHeap.values = [];
        nodes.forEach(function (d) {
          if (d != src) {
            d.distance = Infinity;
            unvisited.push(d);
            d.visited = false;
          }
          minHeap.add({ key: d.name, value: Infinity });
        });
        createHeapSVG(minHeap.values);
      })
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine(7))
      .then(() => delay(animationSpeed))
      .then(() => {
        // Setting Source distance as zero
        // var current = src;
        // redraw minheap
        current.distance = 0;
        minHeap.changeValue(current.name, current.distance);
        createHeapSVG(minHeap.values);
      })
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine(8))
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine([9, 10]))
      .then(() => delay(animationSpeed))
      .then(() => {
        // extract minheap to get next node
        newCurrent = minHeap.extractMin();
        createHeapSVG(minHeap.values);
      })
      .then(() => {
        function tick() {
          current.visited = true;
          p = p
            .then(() => delay(animationSpeed))
            .then(() => highlightCodeLine([12, 13, 14, 15]));
          // update neighbouring nodes
          current.links.forEach(function (link) {
            if (!link.target.visited) {
              var dist = current.distance * 1 + link.value * 1;
              link.target.distance = Math.min(dist, link.target.distance);

              minHeap.changeValue(link.target.name, link.target.distance);
              createHeapSVG(minHeap.values);

              // setting styles for neighbouring nodes
              d3version3
                .select("." + link.target.name)
                .transition()
                .delay(translate_speed / 8)
                .duration(500)
                .attr("r", nodeSize + 3)
                .style("fill", "#c5e3eb")
                .style("stroke-width", "2");
              d3version3
                .select(".nodetext." + link.target.name)
                .transition()
                .delay(translate_speed / 8)
                .duration(500)
                .text(link.target.distance);
              d3version3
                .select(".nodeNametext." + link.target.name + "_text")
                .transition()
                .delay(translate_speed / 8)
                .duration(500)
                .text(link.target.name);
              d3version3
                .select(".linktext." + link.id)
                .style("opacity", 1)
                .transition()
                .duration(translate_speed)
                .text(+link.value);
            }
          });
          //   When all nodes visited or node has infinite distance -> stop
          if (unvisited.length == 0 || current.distance == Infinity) {
            clearInterval(go);
            d3version4.select("#heap-div").select("svg").remove();
            p = p.then(() => highlightCodeLine(16));
            return true;
          }

          //   find minimum amongst the adjacent nodes
          unvisited.sort(function (a, b) {
            return b.distance - a.distance;
          });

          //   select minimum to visit next
          current = unvisited.pop();

          //   applying appropriate styles
          d3version3
            .select("." + current.name)
            .transition()
            .delay((translate_speed * 2) / 5)
            .duration(translate_speed / 5)
            .attr("r", nodeSize)
            .transition()
            .duration(translate_speed / 5)
            .attr("r", nodeSize + 3)
            .style("fill", "#D0E1C3")
            .style("stroke-width", "0");

          d3version3
            .select(".nodetext." + current.name)
            .transition()
            .delay((translate_speed * 4) / 5)
            .text(function (d) {
              return d.distance;
            });
        }
        tick();
        go = setInterval(tick, translate_speed);
      });
  };

  // set nodes in object
  dijkstra.nodes = function (_) {
    if (!arguments.length) return nodes;
    else {
      nodes = _;
      return dijkstra;
    }
  };
  // set edges in object
  dijkstra.edges = function (_) {
    if (!arguments.length) return edges;
    else {
      edges = _;
      return dijkstra;
    }
  };

  // set source in object
  dijkstra.source = function (_) {
    if (!arguments.length) return source;
    else {
      source = _;
      return dijkstra;
    }
  };

  // start code using above objects and run
  dispatch.on("start.code", dijkstra.run);

  return d3version3.rebind(dijkstra, dispatch, "on", "end", "start", "tick");
};
