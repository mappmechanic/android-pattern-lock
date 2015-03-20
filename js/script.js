/*   Android Lock Pattern 
 *   Description: Reusable security module for use in Hybrid Mobile Apps or Web Apps as an alternative to password
 *   Author: mAppMechanic
 *   Twitter: http://twitter.com/mappmechanic
 *   Date: 18th March 2015
 */

/* Library is based on Module Revealing Pattern */
var AndroidLock = (function () {
    // Default Config Options & Other Private Variables
    var _options = {
            rows: 3,
            cols: 3,
            lineColor: '#28bc6e',
            backgroundColor: '#3366cc'
        },
        containerNode,
        savedPattern = [],
        patternSet = false,
        recordStart = false,
        recordEnd = false,
        patternInProgress = [],
        lastVisitedNode = null,
        buttonAction = 'set';


    // Library Initialization Function
    // Passing options parameter to set custom configuration
    function initialize(node, options) {
        // Extending Default Config Options
        extendOptions(options);
        console.log("Initializing Android Lock");
        console.log("Node :" + node);
        containerNode = node;
        // Build all elements to display
        buildElements(node);

    }

    function buildElements(node) {
        var nodesContainer = document.createElement("div");
        nodesContainer.classList.add("nodeContainer");
        node.appendChild(nodesContainer);

        /*
        nodesContainer.addEventListener("touchstart", handleStart, true);
        nodesContainer.addEventListener("touchmove", handleMove, true);
        nodesContainer.addEventListener("touchend", handleEnd, true);
*/

        // Making Nodes by using rows X cols values
        for (var i = 0; i < _options.rows; i++) {
            var row = document.createElement("div");
            row.classList.add("row");
            row.style.height = parseFloat((100 / _options.rows) - 0.5) + '%';
            for (var j = 0; j < _options.cols; j++) {
                var col = document.createElement("div");
                col.classList.add("col");
                col.style.width = parseFloat((100 / _options.cols) - 0.5) + '%';
                var dot = document.createElement("div");
                dot.classList.add("dot");
                var patternNode = document.createElement("div");
                patternNode.classList.add("patternNode");
                patternNode.id = i + "_" + j;

                patternNode.addEventListener("touchstart", handleStart, false);
                patternNode.addEventListener("mousedown", handleStart, false);
                // patternNode.addEventListener("touchenter", handleMove, false);
                //    patternNode.addEventListener("touchend", handleEnd, true);

                dot.appendChild(patternNode);
                col.appendChild(dot);
                row.appendChild(col);
            }
            nodesContainer.appendChild(row);
        }

        var actionBtnContainer = document.createElement("div");
        actionBtnContainer.classList.add("actionBtnContainer");
        var actionBtn = document.createElement("button");
        actionBtn.textContent = "Set Pattern";
        actionBtn.classList.add("actionBtn");
        actionBtn.id = "actionBtn";
        actionBtn.addEventListener("click", performAction, false);
        actionBtnContainer.appendChild(actionBtn);
        node.appendChild(actionBtnContainer);

        var statusContainer = document.createElement("div");
        statusContainer.classList.add("statusContainer");
        var statusText = document.createElement("span");
        statusText.classList.add("statusText");
        statusText.id = "status";
        statusText.textContent = "Draw an unlock pattern";
        statusContainer.appendChild(statusText);
        node.appendChild(statusContainer);

        var linesContainer = document.createElement("div");
        linesContainer.id = "linesContainer";
        //linesContainer.setAttribute("style", "position:absolute");
        node.appendChild(linesContainer);

    }

    function extendOptions(newOptions) {
        if (newOptions) {
            for (key in newOptions) {
                if (_options[key])
                    _options[key] = newOptions[key];
                else
                    console.error("Malformed options object. No key '" + key + "' in config exists");
            }
        }
    }

    function handleStart(evt) {
        console.log("in handle start");
        //console.log(evt);
        if (evt.target.className === "patternNode") {
            visitNode(evt.target);
        }
    }

    function handleMove(evt) {
        console.log("in handle move");
        //console.log(evt.target.className);
        if (evt.target.className === "patternNode") {
            //console.log(evt);
            visitNode(evt.target);
        }
    }

    function handleEnd(evt) {
        console.log("in handle end");
        console.log(evt);
    }

    function visitNode(node) {

        var statusText = document.getElementById('status');
        node.parentNode.style.backgroundColor = _options.lineColor;
        if (patternInProgress.length === 0)
            statusText.textContent = "Release finger when done";

        patternInProgress.push(node.id);

        //Drawing Line
        if (lastVisitedNode) {
            var positionA = calculateXY(lastVisitedNode);
            console.log("positionA", positionA);
            var positionB = calculateXY(node);
            console.log("positionB", positionB);
            linedraw(positionA[0], positionA[1], positionB[0], positionB[1]);

        }

        lastVisitedNode = node;
    }

    function calculateXY(element) {

        var rect = element.getBoundingClientRect();
        console.log(rect);
        var x = rect.left + rect.width / 2;
        var y = rect.top + rect.height / 2;
        return [x, y];
    }

    function linedraw(x1, y1, x2, y2) {

        if (y1 < y2) {
            var pom = y1;
            y1 = y2;
            y2 = pom;
            pom = x1;
            x1 = x2;
            x2 = pom;
        }

        var a = Math.abs(x1 - x2);
        var b = Math.abs(y1 - y2);
        var c;
        var sx = (x1 + x2) / 2;
        var sy = (y1 + y2) / 2;
        var width = Math.sqrt(a * a + b * b);
        var x = sx - width / 2;
        var y = sy;

        a = width / 2;

        c = Math.abs(sx - x);

        b = Math.sqrt(Math.abs(x1 - x) * Math.abs(x1 - x) + Math.abs(y1 - y) * Math.abs(y1 - y));

        var cosb = (b * b - a * a - c * c) / (2 * a * c);
        var rad = Math.acos(cosb);
        var deg = (rad * 180) / Math.PI

        var line = document.createElement("div");
        line.setAttribute('style', 'border:1px solid ' + _options.lineColor + ';width:' + width + 'px;height:0px;-moz-transform:rotate(' + deg + 'deg);-webkit-transform:rotate(' + deg + 'deg);position:absolute;top:' + y + 'px;left:' + x + 'px;');

        document.getElementById("linesContainer").appendChild(line);

    }

    function performAction() {
        var status = document.getElementById('status');
        if (buttonAction === 'set') {
            if (patternInProgress.length < 4) {
                status.textContent = 'Please select atleast 4 nodes';
            } else {
                status.textContent = 'Pattern Saved';
                savedPattern = patternInProgress;
                setTimeout(function () {
                        resetPattern();
                        var status = document.getElementById('status');
                        status.textContent = 'Match Pattern to Unlock';
                        var actionBtn = document.getElementById("actionBtn").textContent = "Unlock";
                        buttonAction = "unlock"
                    },
                    2000);
            }
        } else if (buttonAction === 'unlock') {

            if (patternInProgress.length < 4) {
                status.textContent = 'Please select atleast 4 nodes';
            } else {
                if (arraysEqual(patternInProgress, savedPattern)) {
                    alert("Unlocked");
                } else {
                    alert("Wrong Pattern");
                    resetPattern();
                    var actionBtn = document.getElementById("actionBtn").textContent = "Unlock";
                }

            }
        }
    }

    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length)
            return false;
        for (var i = arr1.length; i--;) {
            if (arr1[i] !== arr2[i])
                return false;
        }

        return true;
    }

    function resetPattern() {
        patternInProgress = [];
        lastVisitedNode = null;
        containerNode.innerHTML = "";
        buildElements(containerNode);
        document.getElementById("linesContainer").innerHTML = "";
    }

    return {
        init: initialize
    }
}());