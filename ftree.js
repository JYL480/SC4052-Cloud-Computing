$(document).ready(docMain);

var conf = new Object();
conf["depth"] = 3;
conf["width"] = 8;
conf["topology"] = "fattree";
conf["gpus"] = 8;
conf["cpuGpuRatio"] = "1:2";

var controlVisible = true;

function docMain() {
  formInit();
  redraw();
  $(document).keypress(kpress);
}

function kpress(e) {
  if (e.which == 104) {
    // 'h'
    if (controlVisible) {
      controlVisible = false;
      $("div.control").hide();
    } else {
      controlVisible = true;
      $("div.control").show();
    }
  }
}

function redraw() {
  var topology = conf["topology"];

  // Show/hide AI-specific controls
  if (topology === "ai-optimized") {
    document.getElementById("gpu-config").style.display = "block";
    document.getElementById("cpu-config").style.display = "block";
    document.getElementById("ai-stats").style.display = "block";
    document.getElementById("bandwidth-stats").style.display = "block";
  } else {
    document.getElementById("gpu-config").style.display = "none";
    document.getElementById("cpu-config").style.display = "none";
    document.getElementById("ai-stats").style.display = "none";
  }

  // Show bandwidth stats for Jupiter and Dragonfly
  if (topology === "jupiter" || topology === "dragonfly") {
    document.getElementById("bandwidth-stats").style.display = "block";
  } else if (topology !== "ai-optimized") {
    document.getElementById("bandwidth-stats").style.display = "none";
  }

  switch (topology) {
    case "fattree":
      drawFatTree(conf["depth"], conf["width"]);
      break;
    case "jupiter":
      drawJupiter(conf["depth"], conf["width"]);
      break;
    case "dragonfly":
      drawDragonfly(conf["depth"], conf["width"]);
      break;
    case "leafspine":
      drawLeafSpine(conf["depth"], conf["width"]);
      break;
    case "ai-optimized":
      drawAIOptimized(conf["depth"], conf["width"], conf["gpus"]);
      break;
    default:
      drawFatTree(conf["depth"], conf["width"]);
  }
}

function drawFatTree(depth, width) {
  var k = Math.floor(width / 2);
  var padg = 13;
  var padi = 12;
  var hline = 70;
  var hhost = 50;

  var podw = 8;
  var podh = 8;
  var hostr = 2;

  var kexp = function (n) {
    return Math.pow(k, n);
  };

  d3.select("svg.main").remove();
  if (kexp(depth - 1) > 1500 || depth <= 0 || k <= 0) {
    return;
  }

  var w = kexp(depth - 1) * padg + 200;
  var h = 2 * depth * hline;

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "main")
    .append("g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  var linePositions = [];

  function podPositions(d) {
    var ret = [];

    var ngroup = kexp(d);
    var pergroup = kexp(depth - 1 - d);

    var wgroup = pergroup * padg;
    var wgroups = wgroup * (ngroup - 1);
    var offset = -wgroups / 2;

    for (var i = 0; i < ngroup; i++) {
      var wpods = pergroup * padi;
      var goffset = wgroup * i - wpods / 2;

      for (var j = 0; j < pergroup; j++) {
        ret.push(offset + goffset + padi * j);
      }
    }

    return ret;
  }

  for (var i = 0; i < depth; i++) {
    linePositions[i] = podPositions(i);
  }

  function drawPods(list, y) {
    for (var j = 0, n = list.length; j < n; j++) {
      svg
        .append("rect")
        .attr("class", "pod")
        .attr("width", podw)
        .attr("height", podh)
        .attr("x", list[j] - podw / 2)
        .attr("y", y - podh / 2);
    }
  }

  function drawHost(x, y, dy, dx) {
    svg
      .append("line")
      .attr("class", "cable")
      .attr("x1", x)
      .attr("y1", y)
      .attr("x2", x + dx)
      .attr("y2", y + dy);

    svg
      .append("circle")
      .attr("class", "host")
      .attr("cx", x + dx)
      .attr("cy", y + dy)
      .attr("r", hostr);
  }

  function drawHosts(list, y, direction) {
    for (var i = 0; i < list.length; i++) {
      if (k == 1) {
        drawHost(list[i], y, hhost * direction, 0);
      } else if (k == 2) {
        drawHost(list[i], y, hhost * direction, -2);
        drawHost(list[i], y, hhost * direction, +2);
      } else if (k == 3) {
        drawHost(list[i], y, hhost * direction, -4);
        drawHost(list[i], y, hhost * direction, 0);
        drawHost(list[i], y, hhost * direction, +4);
      } else {
        drawHost(list[i], y, hhost * direction, -4);
        drawHost(list[i], y, hhost * direction, 0);
        drawHost(list[i], y, hhost * direction, +4);
      }
    }
  }

  function linePods(d, list1, list2, y1, y2) {
    var pergroup = kexp(depth - 1 - d);
    var ngroup = kexp(d);

    var perbundle = pergroup / k;

    for (var i = 0; i < ngroup; i++) {
      var offset = pergroup * i;
      for (var j = 0; j < k; j++) {
        var boffset = perbundle * j;
        for (var t = 0; t < perbundle; t++) {
          var ichild = offset + boffset + t;
          for (var d = 0; d < k; d++) {
            var ifather = offset + perbundle * d + t;
            svg
              .append("line")
              .attr("class", "cable")
              .attr("x1", list1[ifather])
              .attr("y1", y1)
              .attr("x2", list2[ichild])
              .attr("y2", y2);
          }
        }
      }
    }
  }

  for (var i = 0; i < depth - 1; i++) {
    linePods(
      i,
      linePositions[i],
      linePositions[i + 1],
      i * hline,
      (i + 1) * hline,
    );
    linePods(
      i,
      linePositions[i],
      linePositions[i + 1],
      -i * hline,
      -(i + 1) * hline,
    );
  }

  drawHosts(linePositions[depth - 1], (depth - 1) * hline, 1);
  drawHosts(linePositions[depth - 1], -(depth - 1) * hline, -1);

  for (var i = 0; i < depth; i++) {
    if (i == 0) {
      drawPods(linePositions[0], 0);
    } else {
      drawPods(linePositions[i], i * hline);
      drawPods(linePositions[i], -i * hline);
    }
  }
}

// Google Jupiter Architecture - Based on Clos with Centauri fabric
function drawJupiter(depth, width) {
  var k = Math.floor(width / 2);
  var padg = 15;
  var padi = 13;
  var hline = 80;
  var hhost = 55;
  var podw = 10;
  var podh = 10;
  var hostr = 3;

  var kexp = function (n) {
    return Math.pow(k, n);
  };

  d3.select("svg.main").remove();
  if (kexp(depth - 1) > 1200 || depth <= 0 || k <= 0) {
    return;
  }

  var w = kexp(depth - 1) * padg + 250;
  var h = 2 * depth * hline + 100;

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "main")
    .append("g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  // Add Jupiter label
  svg
    .append("text")
    .attr("x", -w / 2 + 20)
    .attr("y", -h / 2 + 30)
    .attr("class", "topology-label")
    .text("Google Jupiter - Clos Fabric");

  var linePositions = [];

  function podPositions(d) {
    var ret = [];
    var ngroup = kexp(d);
    var pergroup = kexp(depth - 1 - d);
    var wgroup = pergroup * padg;
    var wgroups = wgroup * (ngroup - 1);
    var offset = -wgroups / 2;

    for (var i = 0; i < ngroup; i++) {
      var wpods = pergroup * padi;
      var goffset = wgroup * i - wpods / 2;
      for (var j = 0; j < pergroup; j++) {
        ret.push(offset + goffset + padi * j);
      }
    }
    return ret;
  }

  for (var i = 0; i < depth; i++) {
    linePositions[i] = podPositions(i);
  }

  function drawPods(list, y, stage) {
    for (var j = 0, n = list.length; j < n; j++) {
      svg
        .append("rect")
        .attr("class", stage === 0 ? "pod jupiter-spine" : "pod jupiter-leaf")
        .attr("width", podw)
        .attr("height", podh)
        .attr("x", list[j] - podw / 2)
        .attr("y", y - podh / 2);
    }
  }

  function drawHost(x, y, dy, dx) {
    svg
      .append("line")
      .attr("class", "cable jupiter-cable")
      .attr("x1", x)
      .attr("y1", y)
      .attr("x2", x + dx)
      .attr("y2", y + dy);

    svg
      .append("circle")
      .attr("class", "host jupiter-host")
      .attr("cx", x + dx)
      .attr("cy", y + dy)
      .attr("r", hostr);
  }

  function drawHosts(list, y, direction) {
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < k; j++) {
        drawHost(list[i], y, hhost * direction, (j - k / 2 + 0.5) * 3);
      }
    }
  }

  function linePods(d, list1, list2, y1, y2) {
    var pergroup = kexp(depth - 1 - d);
    var ngroup = kexp(d);
    var perbundle = pergroup / k;

    for (var i = 0; i < ngroup; i++) {
      var offset = pergroup * i;
      for (var j = 0; j < k; j++) {
        var boffset = perbundle * j;
        for (var t = 0; t < perbundle; t++) {
          var ichild = offset + boffset + t;
          for (var d = 0; d < k; d++) {
            var ifather = offset + perbundle * d + t;
            svg
              .append("line")
              .attr("class", "cable jupiter-cable")
              .attr("x1", list1[ifather])
              .attr("y1", y1)
              .attr("x2", list2[ichild])
              .attr("y2", y2);
          }
        }
      }
    }
  }

  for (var i = 0; i < depth - 1; i++) {
    linePods(
      i,
      linePositions[i],
      linePositions[i + 1],
      i * hline,
      (i + 1) * hline,
    );
    linePods(
      i,
      linePositions[i],
      linePositions[i + 1],
      -i * hline,
      -(i + 1) * hline,
    );
  }

  drawHosts(linePositions[depth - 1], (depth - 1) * hline, 1);
  drawHosts(linePositions[depth - 1], -(depth - 1) * hline, -1);

  for (var i = 0; i < depth; i++) {
    if (i == 0) {
      drawPods(linePositions[0], 0, 0);
    } else {
      drawPods(linePositions[i], i * hline, i);
      drawPods(linePositions[i], -i * hline, i);
    }
  }
}

// Dragonfly Topology - High-radix routers with hierarchical groups
function drawDragonfly(depth, width) {
  var k = Math.floor(width / 2);
  var groupSize = Math.max(4, k);
  var numGroups = Math.max(2, Math.floor(depth));

  var padg = 40;
  var hline = 90;
  var groupRadius = 30;
  var routerRadius = 6;
  var hostr = 3;

  d3.select("svg.main").remove();

  var w = numGroups * 200 + 200;
  var h = 500;

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "main")
    .append("g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  svg
    .append("text")
    .attr("x", -w / 2 + 20)
    .attr("y", -h / 2 + 30)
    .attr("class", "topology-label")
    .text("Dragonfly Topology - Hierarchical Groups");

  // Draw groups
  for (var g = 0; g < numGroups; g++) {
    var gx = (g - numGroups / 2 + 0.5) * 150;

    // Group circle
    svg
      .append("circle")
      .attr("cx", gx)
      .attr("cy", 0)
      .attr("r", groupRadius)
      .attr("class", "dragonfly-group")
      .attr("fill", "none")
      .attr("stroke", "#4CAF50")
      .attr("stroke-width", 2);

    // Routers within group
    for (var r = 0; r < groupSize; r++) {
      var angle = (r / groupSize) * 2 * Math.PI;
      var rx = gx + Math.cos(angle) * (groupRadius - 10);
      var ry = Math.sin(angle) * (groupRadius - 10);

      svg
        .append("circle")
        .attr("cx", rx)
        .attr("cy", ry)
        .attr("r", routerRadius)
        .attr("class", "pod dragonfly-router");

      // Hosts connected to router
      for (var h = 0; h < k; h++) {
        var hx = rx + Math.cos(angle) * 25;
        var hy = ry + Math.sin(angle) * 25;

        svg
          .append("line")
          .attr("class", "cable")
          .attr("x1", rx)
          .attr("y1", ry)
          .attr("x2", hx)
          .attr("y2", hy);

        svg
          .append("circle")
          .attr("class", "host")
          .attr("cx", hx)
          .attr("cy", hy)
          .attr("r", hostr);
      }
    }

    // Inter-group connections
    if (g < numGroups - 1) {
      var nextGx = (g + 1 - numGroups / 2 + 0.5) * 150;
      svg
        .append("line")
        .attr("class", "cable dragonfly-global")
        .attr("x1", gx + groupRadius)
        .attr("y1", 0)
        .attr("x2", nextGx - groupRadius)
        .attr("y2", 0)
        .attr("stroke-width", 3)
        .attr("stroke", "#FF5722");
    }
  }
}

// Leaf-Spine (Modern Clos) - Common in cloud data centers
function drawLeafSpine(depth, width) {
  var numSpines = Math.floor(width / 2);
  var numLeaves = Math.max(4, depth * 2);

  var padg = 30;
  var hline = 120;
  var podw = 12;
  var podh = 12;
  var hostr = 3;
  var hostsPerLeaf = Math.max(4, Math.floor(width / 2));

  d3.select("svg.main").remove();

  var w = Math.max(numSpines, numLeaves) * padg + 200;
  var h = 400;

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "main")
    .append("g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  svg
    .append("text")
    .attr("x", -w / 2 + 20)
    .attr("y", -h / 2 + 30)
    .attr("class", "topology-label")
    .text("Leaf-Spine (Clos) - Cloud DC Architecture");

  // Draw spine switches
  var spineY = -hline;
  for (var i = 0; i < numSpines; i++) {
    var x = (i - numSpines / 2 + 0.5) * padg;
    svg
      .append("rect")
      .attr("class", "pod leafspine-spine")
      .attr("width", podw)
      .attr("height", podh)
      .attr("x", x - podw / 2)
      .attr("y", spineY - podh / 2);

    svg
      .append("text")
      .attr("x", x)
      .attr("y", spineY - 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .text("S" + i);
  }

  // Draw leaf switches
  var leafY = hline;
  for (var i = 0; i < numLeaves; i++) {
    var x = (i - numLeaves / 2 + 0.5) * padg;
    svg
      .append("rect")
      .attr("class", "pod leafspine-leaf")
      .attr("width", podw)
      .attr("height", podh)
      .attr("x", x - podw / 2)
      .attr("y", leafY - podh / 2);

    svg
      .append("text")
      .attr("x", x)
      .attr("y", leafY + 25)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .text("L" + i);

    // Connect each leaf to all spines
    for (var s = 0; s < numSpines; s++) {
      var sx = (s - numSpines / 2 + 0.5) * padg;
      svg
        .append("line")
        .attr("class", "cable leafspine-cable")
        .attr("x1", x)
        .attr("y1", leafY)
        .attr("x2", sx)
        .attr("y2", spineY);
    }

    // Draw hosts connected to leaf
    for (var h = 0; h < hostsPerLeaf; h++) {
      var hx = x + (h - hostsPerLeaf / 2 + 0.5) * 4;
      var hy = leafY + 40;

      svg
        .append("line")
        .attr("class", "cable")
        .attr("x1", x)
        .attr("y1", leafY + podh / 2)
        .attr("x2", hx)
        .attr("y2", hy);

      svg
        .append("circle")
        .attr("class", "host")
        .attr("cx", hx)
        .attr("cy", hy)
        .attr("r", hostr);
    }
  }
}

// AI-Optimized Fabric - GPU-centric design
function drawAIOptimized(depth, width, gpusPerServer) {
  var k = Math.floor(width / 2);
  var padg = 35;
  var hline = 100;
  var podw = 14;
  var podh = 14;
  var serverW = 20;
  var serverH = 30;
  var gpuSize = 4;

  var kexp = function (n) {
    return Math.pow(k, n);
  };

  d3.select("svg.main").remove();
  if (kexp(depth - 1) > 800 || depth <= 0 || k <= 0) {
    return;
  }

  var w = kexp(depth - 1) * padg + 300;
  var h = 2 * depth * hline + 150;

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "main")
    .append("g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  svg
    .append("text")
    .attr("x", -w / 2 + 20)
    .attr("y", -h / 2 + 30)
    .attr("class", "topology-label")
    .text("AI-Optimized Fabric - GPU Clusters with NVLink/InfiniBand");

  var linePositions = [];

  function podPositions(d) {
    var ret = [];
    var ngroup = kexp(d);
    var pergroup = kexp(depth - 1 - d);
    var wgroup = pergroup * padg;
    var wgroups = wgroup * (ngroup - 1);
    var offset = -wgroups / 2;

    for (var i = 0; i < ngroup; i++) {
      var wpods = pergroup * padg * 0.9;
      var goffset = wgroup * i - wpods / 2;
      for (var j = 0; j < pergroup; j++) {
        ret.push(offset + goffset + padg * 0.9 * j);
      }
    }
    return ret;
  }

  for (var i = 0; i < depth; i++) {
    linePositions[i] = podPositions(i);
  }

  // Draw switches with AI-optimized styling
  function drawSwitches(list, y, stage) {
    for (var j = 0, n = list.length; j < n; j++) {
      svg
        .append("rect")
        .attr("class", stage === 0 ? "pod ai-spine" : "pod ai-leaf")
        .attr("width", podw)
        .attr("height", podh)
        .attr("x", list[j] - podw / 2)
        .attr("y", y - podh / 2)
        .attr("rx", 2);
    }
  }

  // Draw AI server with GPUs
  function drawAIServer(x, y, direction) {
    var serverY = y + direction * 60;

    // Server chassis
    svg
      .append("rect")
      .attr("class", "ai-server")
      .attr("width", serverW)
      .attr("height", serverH)
      .attr("x", x - serverW / 2)
      .attr("y", serverY - serverH / 2)
      .attr("rx", 2)
      .attr("fill", "#37474F")
      .attr("stroke", "#00BCD4")
      .attr("stroke-width", 2);

    // High-speed interconnect cable
    svg
      .append("line")
      .attr("class", "cable ai-cable")
      .attr("x1", x)
      .attr("y1", y)
      .attr("x2", x)
      .attr("y2", serverY - serverH / 2)
      .attr("stroke-width", 2)
      .attr("stroke", "#00BCD4");

    // Draw GPUs inside server
    var gpusPerRow = Math.min(4, gpusPerServer);
    var numRows = Math.ceil(gpusPerServer / gpusPerRow);
    for (var i = 0; i < gpusPerServer; i++) {
      var row = Math.floor(i / gpusPerRow);
      var col = i % gpusPerRow;
      var gx = x - serverW / 2 + 3 + col * (gpuSize + 1);
      var gy = serverY - serverH / 2 + 3 + row * (gpuSize + 1);

      svg
        .append("rect")
        .attr("class", "gpu")
        .attr("width", gpuSize)
        .attr("height", gpuSize)
        .attr("x", gx)
        .attr("y", gy)
        .attr("fill", "#4CAF50");
    }
  }

  function drawServers(list, y, direction) {
    for (var i = 0; i < list.length; i++) {
      drawAIServer(list[i], y, direction);
    }
  }

  function lineSwitches(d, list1, list2, y1, y2) {
    var pergroup = kexp(depth - 1 - d);
    var ngroup = kexp(d);
    var perbundle = pergroup / k;

    for (var i = 0; i < ngroup; i++) {
      var offset = pergroup * i;
      for (var j = 0; j < k; j++) {
        var boffset = perbundle * j;
        for (var t = 0; t < perbundle; t++) {
          var ichild = offset + boffset + t;
          for (var d = 0; d < k; d++) {
            var ifather = offset + perbundle * d + t;
            svg
              .append("line")
              .attr("class", "cable ai-cable")
              .attr("x1", list1[ifather])
              .attr("y1", y1)
              .attr("x2", list2[ichild])
              .attr("y2", y2)
              .attr("stroke-width", 1.5);
          }
        }
      }
    }
  }

  // Build topology
  for (var i = 0; i < depth - 1; i++) {
    lineSwitches(
      i,
      linePositions[i],
      linePositions[i + 1],
      i * hline,
      (i + 1) * hline,
    );
    lineSwitches(
      i,
      linePositions[i],
      linePositions[i + 1],
      -i * hline,
      -(i + 1) * hline,
    );
  }

  drawServers(linePositions[depth - 1], (depth - 1) * hline, 1);
  drawServers(linePositions[depth - 1], -(depth - 1) * hline, -1);

  for (var i = 0; i < depth; i++) {
    if (i == 0) {
      drawSwitches(linePositions[0], 0, 0);
    } else {
      drawSwitches(linePositions[i], i * hline, i);
      drawSwitches(linePositions[i], -i * hline, i);
    }
  }
}

function updateStat() {
  var w = Math.floor(conf["width"] / 2);
  var d = conf["depth"];
  var topology = conf["topology"];

  if (d == 0 || w == 0) {
    d3.select("#nhost").html("&nbsp;");
    d3.select("#nswitch").html("&nbsp;");
    d3.select("#ncable").html("&nbsp;");
    d3.select("#ntx").html("&nbsp;");
    d3.select("#nswtx").html("&nbsp;");
    d3.select("#ngpu").html("&nbsp;");
    d3.select("#bisectionbw").html("&nbsp;");
    return;
  }

  var line = Math.pow(w, d - 1);
  var nhost, nswitch, ncable, ntx, nswtx, ngpu, bisectionBW;

  // Calculate based on topology
  switch (topology) {
    case "jupiter":
      // Google Jupiter uses similar Clos but with higher radix switches
      nhost = 2 * line * w;
      nswitch = (2 * d - 1) * line;
      ncable = 2 * d * w * line;
      ntx = 2 * (2 * d) * w * line;
      nswtx = ntx - nhost;
      bisectionBW = (line * w * w) / 4 + " Tbps (Full Bisection)";
      break;

    case "dragonfly":
      var numGroups = Math.max(2, Math.floor(d));
      var groupSize = Math.max(4, w);
      nhost = numGroups * groupSize * w;
      nswitch = numGroups * groupSize;
      ncable =
        nhost + (numGroups * groupSize * (groupSize - 1)) / 2 + (numGroups - 1);
      ntx = ncable * 2;
      nswtx = ntx - nhost;
      bisectionBW =
        ((numGroups - 1) * groupSize) / 2 + " Links (Adaptive Routing)";
      break;

    case "leafspine":
      var numSpines = w;
      var numLeaves = Math.max(4, d * 2);
      var hostsPerLeaf = w;
      nhost = numLeaves * hostsPerLeaf;
      nswitch = numSpines + numLeaves;
      ncable = nhost + numSpines * numLeaves;
      ntx = ncable * 2;
      nswtx = ntx - nhost;
      bisectionBW = numSpines * numLeaves + " Links (Non-blocking)";
      break;

    case "ai-optimized":
      nhost = 2 * line * w;
      nswitch = (2 * d - 1) * line;
      ncable = 2 * d * w * line;
      ntx = 2 * (2 * d) * w * line;
      nswtx = ntx - nhost;
      ngpu = nhost * parseInt(conf["gpus"] || 8);
      bisectionBW = line * w * 400 + " Gbps (IB NDR/NVLink)";
      d3.select("#ngpu").html(formatNum(ngpu));
      break;

    default: // fattree
      nhost = 2 * line * w;
      nswitch = (2 * d - 1) * line;
      ncable = 2 * d * w * line;
      ntx = 2 * (2 * d) * w * line;
      nswtx = ntx - nhost;
  }

  d3.select("#nhost").html(formatNum(nhost));
  d3.select("#nswitch").html(formatNum(nswitch));
  d3.select("#ncable").html(formatNum(ncable));
  d3.select("#ntx").html(formatNum(ntx));
  d3.select("#nswtx").html(formatNum(nswtx));

  if (bisectionBW) {
    d3.select("#bisectionbw").html(bisectionBW);
  }
}

function formatNum(x) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return x;
}

function formInit() {
  var form = d3.select("form");

  function confInt() {
    conf[this.name] = parseInt(this.value);
    updateStat();
    redraw();
  }

  function confString() {
    conf[this.name] = this.value;
    updateStat();
    redraw();
  }

  function hook(name, func) {
    var fields = form.selectAll("[name=" + name + "]");
    fields.on("change", func);
    fields.each(func);
  }

  hook("depth", confInt);
  hook("width", confInt);
  hook("topology", confString);
  hook("gpus", confInt);
  hook("cpuGpuRatio", confString);
}
