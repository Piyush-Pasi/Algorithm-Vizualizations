// Giving style to elements of cytoscape linked list objects
cytoscapeStyle = [
  {
    // Adding style of normal node
    selector: "node",
    style: {
      "background-color": "white",
      shape: "rectangle",
      content: "data(weight)",
      "text-valign": "center",
      "text-halign": "center",
      height: "30px",
      width: "50px",
      "border-color": "black",
      "border-opacity": "1",
      "border-width": "1px",
    },
  },

  {
    // Adding style to edges
    selector: "edge",
    style: {
      width: 2,
      "line-color": "black",
      "target-arrow-color": "black",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  },

  {
    // Adding style to node highlighted to represent active node
    selector: ".highlight-node",
    style: {
      "background-color": "#61bffc",
      "transition-property": "background-color",
      "transition-duration": "0.5s",
    },
  },

  {
    // Adding style to node pointer
    selector: ".pointer",
    style: {
      "background-color": "white",
      "border-width": "0px",
      "line-color": "black",
      "target-arrow-color": "black",
      "transition-property": "background-color, line-color, target-arrow-color",
      "transition-duration": "0.5s",
    },
  },

  {
    // Adding style to pointer to current node
    selector: ".pointer-highlighted",
    style: {
      "background-color": "#61bffc",
      "line-color": "#61bffc",
      "border-width": "0px",
      "line-color": "black",
      "target-arrow-color": "black",
      "transition-property": "background-color, line-color, target-arrow-color",
      "transition-duration": "0.5s",
    },
  },

  {
    // Adding style to null pointer
    selector: ".null",
    style: {
      shape: "rectangle",
      content: "NULL",
      "background-color": "white",
      "border-width": "0px",
      "line-color": "black",
      "target-arrow-color": "black",
      "transition-property": "background-color, line-color, target-arrow-color",
      "transition-duration": "0.5s",
    },
  },
];

/**
 * Function to create node with properties of node, ID, position and weight
 * @param {int} id - Node id
 * @param {int} xpos - x axis coordinate
 * @param {int} ypos - y axis coordinate
 * @param {int} weight - node weight
 * @returns Node
 */
let createNodeData = function (id, xpos, ypos, weight = 0) {
  return {
    group: "nodes",
    data: { id: id, weight: weight },
    position: { x: xpos, y: ypos },
  };
};

/**
 * Function to create edge with properties, ID, start and end
 * @param {int} id - Edge id
 * @param {string} source - Edge start
 * @param {string} target - Edge end
 * @return edge
 */
let createEdgeData = function (id, source, target) {
  return {
    group: "edges",
    data: { id: id, source: source, target: target },
  };
};

/**
 * Funciton to create linked list
 * @param {array} nodes - array of linked list nodes
 */
let drawGraph = function (nodes) {
  // Defualt linked list
  cy.add(createNodeData("NULL", 200, 300, "NULL"));
  cy.add(createNodeData("prev", 100, 300, "prev"));
  cy.add(createNodeData("next", 300, 100, "next"));
  cy.add(createNodeData("curr", 100, 200, "curr"));
  cy.add(createNodeData("head", 300, 400, "head"));
  cy.$("#prev, #curr, #NULL, #head, #next").addClass("pointer");
  cy.add(createEdgeData("prev_pointer", "prev", "NULL"));
  for (let i = 0; i <= nodes.length; i++) {
    if (i !== nodes.length) {
      cy.add(createNodeData("node" + i, 200 + 100 * i, 200, nodes[i]));
    } else {
      cy.add(createNodeData("node" + i, 200 + 100 * i, 200, "NULL"));
    }
  }

  // change content of last node
  cy.$("#node" + nodes.length).addClass("null");

  // adding linkedlist edges
  for (let i = 0; i < nodes.length; i++) {
    let eid = "edge" + i;
    let esource = "node" + i;
    let etarget = "node" + (i + 1);
    cy.add(createEdgeData(eid, esource, etarget));
  }

  // create curr and head edges
  cy.add(createEdgeData("curr_pointer", "curr", "node0"));
  cy.add(createEdgeData("head_pointer", "head", "node0"));

  //Layout specifications
  let options = {
    name: "preset",
    fit: true,
    animate: false,
    padding: 30,
  };
  cy.layout(options).run();
};

/**
 * Function to highlight the relevent lines of code
 * @param {int} lineNo Line number in code
 */
function highlightCodeLine(lineNo) {
  $(".code").removeClass("code-highlight");
  $("#code-line-" + lineNo).addClass("code-highlight");
}

/**
 * Function to highlight current node
 * @param {int} nodeId - ID of node
 * @param {string} nodeType - Source/Target node
 */
function highlightNode(nodeId, nodeType = "source") {
  if (nodeId === "#node-1") {
    nodeId = "#NULL";
  }
  let backgroundColor;
  if (nodeType === "source") {
    backgroundColor = "#61bffc";
  } else if (nodeType === "target") {
    backgroundColor = "red";
  } else {
    return;
  }
  cy.nodes(nodeId).animate(
    {
      style: { backgroundColor: backgroundColor },
    },
    {
      duration: animationSpeed,
    }
  );
}

/**
 * Function to toggle highlighted node back to normal
 * @param {int} nodeId - ID of node
 */
function deHighlightNode(nodeId) {
  if (nodeId === "#node-1") {
    nodeId = "#NULL";
  }
  cy.nodes(nodeId).animate(
    {
      style: { backgroundColor: "white" },
    },
    {
      duration: animationSpeed,
    }
  );
}

/**
 * Function to set next pointer to current's next node
 * @param {int} currNode - Current node's index
 */
function setNextPointerToCurrentNext(currNode) {
  if (currNode === 0) {
    cy.add(createEdgeData("next_pointer", "next", "node" + (currNode + 1)));
  } else {
    let ej = cy.$("#next_pointer");
    ej = ej.move({
      target: "node" + (currNode + 1),
    });
  }
}

/**
 * Function to set current node's next node to previous
 * @param {int} currNode - Current node's index
 */
function setCurrentNextToPrevPointer(currNode) {
  let target;
  if (currNode === 0) {
    target = "NULL";
  } else {
    target = "node" + (currNode - 1);
  }
  let ej = cy.$("#edge" + currNode);
  ej = ej.move({
    target: target,
  });
}

/**
 * Function to set Previous node to current
 * @param {int} currNode - Current node's index
 */
function SetPrevToCurrent(currNode) {
  let nullPos = cy.$("#NULL").position();
  cy.nodes("#NULL").animate(
    {
      position: { x: nullPos.x + 100, y: nullPos.y },
    },
    {
      duration: animationSpeed,
    }
  );
  let iPos;
  for (let i = 0; i < currNode; i++) {
    iPos = cy.$("#node" + i).position();
    cy.nodes("#node" + i).animate(
      {
        position: { x: iPos.x + 100, y: iPos.y },
      },
      {
        duration: animationSpeed,
      }
    );
  }
  let ej = cy.$("#prev_pointer");
  ej = ej.move({
    target: "node" + currNode,
  });
  let currPosition = cy.$("#node" + currNode).position();
  cy.nodes("#node" + currNode).animate(
    {
      position: { x: currPosition.x, y: currPosition.y + 100 },
    },
    {
      duration: animationSpeed,
    }
  );
}

/**
 * Function to set current node to next
 * @param {int} currNode - Current node's index
 */
function SetCurrentToNext(currNode) {
  let ej = cy.$("#curr_pointer");
  ej = ej.move({
    target: "node" + (currNode + 1),
  });
  let iPos;
  for (let i = currNode + 1; i <= numberOfNodes; i++) {
    iPos = cy.$("#node" + i).position();
    cy.nodes("#node" + i).animate(
      {
        position: { x: iPos.x - 100, y: iPos.y },
      },
      {
        duration: animationSpeed,
      }
    );
  }
}

/**
 * Function to set head pointer to previous
 */
function setHeadToPrev() {
  let target = cy.$("#prev_pointer").data().target;
  let ej = cy.$("#head_pointer");
  ej = ej.move({
    target: target,
  });
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Function to animate the linked list reversal with code line highlighting
 * Syncing line highlight with visualisation
 */
function reversal() {
  p = Promise.resolve();
  for (let currentNode = 0; currentNode < numberOfNodes; currentNode++) {
    p = p
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine(1))
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine(2))
      .then(() => delay(animationSpeed))
      .then(() => highlightNode("#next", "source"))
      .then(() => highlightNode("#node" + (currentNode + 1), "target"))
      .then(() => delay(animationSpeed))
      .then(() => setNextPointerToCurrentNext(currentNode))
      .then(() => delay(animationSpeed))
      .then(() => deHighlightNode("#next"))
      .then(() => deHighlightNode("#node" + (currentNode + 1)))
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine(3))
      .then(() => delay(animationSpeed))
      .then(() => highlightNode("#node" + currentNode, "source"))
      .then(() => highlightNode("#node" + (currentNode - 1), "target"))
      .then(() => delay(animationSpeed))
      .then(() => setCurrentNextToPrevPointer(currentNode))
      .then(() => delay(animationSpeed))
      .then(() => deHighlightNode("#node" + currentNode))
      .then(() => deHighlightNode("#node" + (currentNode - 1)))
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine(4))
      .then(() => delay(animationSpeed))
      .then(() => highlightNode("#prev", "source"))
      .then(() => highlightNode("#node" + currentNode, "target"))
      .then(() => delay(animationSpeed))
      .then(() => SetPrevToCurrent(currentNode))
      .then(() => delay(animationSpeed))
      .then(() => deHighlightNode("#prev"))
      .then(() => deHighlightNode("#node" + currentNode))
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine(5))
      .then(() => delay(animationSpeed))
      .then(() => highlightNode("#curr", "source"))
      .then(() => highlightNode("#node" + (currentNode + 1), "target"))
      .then(() => delay(animationSpeed))
      .then(() => SetCurrentToNext(currentNode))
      .then(() => delay(animationSpeed))
      .then(() => deHighlightNode("#curr"))
      .then(() => deHighlightNode("#node" + (currentNode + 1)))
      .then(() => delay(animationSpeed))
      .then(() => highlightCodeLine(6));
  }
  p = p
    .then(() => delay(1000))
    .then(() => highlightCodeLine(1))
    .then(() => delay(1000))
    .then(() => highlightCodeLine(7))
    .then(() => delay(1000))
    .then(() => highlightNode("#head"))
    .then(() => highlightNode("#node" + (numberOfNodes - 1), "target"))
    .then(() => delay(1000))
    .then(() => setHeadToPrev())
    .then(() => delay(1000))
    .then(() => deHighlightNode("#head"))
    .then(() => deHighlightNode("#node" + (numberOfNodes - 1)))
    .then(() => {
      $("#submit").removeAttr("disabled");
    });
}

/**
 * Function to check if object is numeric or not
 * @param {Object} obj
 * @returns {Boolean}
 */
function isNumeric(obj) {
  var realStringObj = obj && obj.toString();
  return (
    !jQuery.isArray(obj) && realStringObj - parseFloat(realStringObj) + 1 >= 0
  );
}

// Reset button functionality
$("#reset").click(function () {
  cy.destroy();
  startPage();
});

// Submit button functionality
$("#submit").click(function () {
  let input = $("#customNodes").val().replace(/ /g, "").split(",");
  for (let j = 0; j < input.length; j++) {
    if (!isNumeric(input[j])) {
      alert("Please enter a valid number.");
      return;
    }
  }

  $("#submit").attr("disabled", "disabled");
  customNodes = [];
  input.forEach(function (item) {
    customNodes.push(parseInt(item));
  });
  cy.destroy();
  startPage(customNodes);
});

// ----------- Controlling animation speed ---------------
$("#slow").click(function () {
  animationSpeed = 1000;
});

$("#normal").click(function () {
  animationSpeed = 500;
});

$("#fast").click(function () {
  animationSpeed = 100;
});
// -------------------------------------------------------

/**
 * Function to show the linked list with specified node weights
 * @param {Array} customNodes - array of node weights
 */
function startPage(customNodes = [10, 20, 30]) {
  cy = cytoscape({
    container: document.getElementById("cy"),
    style: cytoscapeStyle,
  });
  edgeIndex = 0;
  prev = "NULL";
  curr = "node" + edgeIndex;
  head = curr;
  next = prev;
  numberOfNodes = customNodes.length;
  animationSpeed = 1000;
  $("#submit").attr("disabled", "disabled");
  setTimeout(drawGraph(customNodes), 4000);
  setTimeout(reversal, 1000);
}

// Initialization
let edgeIndex;
let prev;
let curr;
let head;
let next;
let numberOfNodes;
let animationSpeed;
let cy;

startPage();
