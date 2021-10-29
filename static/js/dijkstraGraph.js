/**
 * Function to take input file from user which specifies the graph nodes and edges.
 * It also creates the graph inserted by user.
 * @param {file} data_file - graph layout file
 */
function makeDJGraph(data_file){
   
    // Dimensions of animation area
    var width = 960,
        height = 500;

    var color = d3.scale.category20();

    // Defining how nodes interact with each other
    var force = d3.layout.force()
        .charge(-5000)
        .linkDistance(1)
        .size([width, height]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Reading the CSV file and creating graph accordingly
    d3.csv(data_file, function(error, data) {
    
    var nodes = [], nodesByName = {}, links = [];
    function addNodeByName(fullname) {
        var name = fullname.split(',')[0];
        if (!nodesByName[name]) {
        var node = {"name":name, "links":[]}
        nodesByName[name] = node;
        nodes.push(node);
        return node;
        }
        else
        return nodesByName[name];
    }

    data.forEach(function(d) {
        for (k in d) {
        if (d.hasOwnProperty(k) && k != "nodes" && d[k] < 750) {
            var edge_weight =  parseFloat(d[k]).toFixed(2);
            if (typeof parseFloat(edge_weight) == "number"){
            links.push({"source": addNodeByName(d["nodes"]), "target": addNodeByName(k), "value": parseFloat(edge_weight), 'id':addNodeByName(d["nodes"]).name+addNodeByName(k).name });   
            }
            else{
            alert("Invalid File");
            } 
        }
        } 
    });

    // Visualising graph
    force
        .nodes(nodes)
        .links(links)
        .start();

    var glink = svg.append('g').selectAll(".link")
        .data(links).enter()

    var link = glink.append("line")
        .attr("class", function(d){ return "link "+d.id})
        .style("stroke-width", 2);

    var linktext = glink.append('text')
        .attr("class", function(d){ return "linktext "+d.id})
        .attr('text-anchor', 'middle')
        .style('opacity', 0)
        .text(function(d){ return d.value})

    var gnode = svg.append('g').selectAll(".node")
        .data(nodes).enter()

    var node = gnode.append("circle")
        .attr("class", function(d){ return 'node '+d.name})
        .attr("r", 15)
        .call(force.drag);

    var nodetext = gnode.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr("class", function(d){ return "nodetext "+d.name})
        .text(function(d){ return d.name})

    
    link.each(function(d) {
        d.source.links.push(d);
        d.selection = d3.select(this);
    });

    node.each(function(d) {
        d.selection = d3.select(this);
    });
    
    // Recreate graph on every instance
    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        linktext.attr("x", function(d) { return (d.source.x + d.target.x)/2 ; })
            .attr("y", function(d) { return (d.source.y + d.target.y)/2; })

        nodetext.attr("x", function(d) { return d.x ; })
            .attr("y", function(d) { return d.y; })

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });

    
    node.on("mouseover", function(d) {
        d3.select(this).attr('r', 16.5);
        
    });

    node.on("mouseout", function(d) {
        d3.select(this).attr('r', 15);
    });
        
    var dijkstra = d3.dijkstra()
        .nodes(nodes)
        .edges(links);

    node.on("click", dijkstra.start);

    });

}