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
        savedPattern = [],
        patternSet = false,
        recordStart = false,
        recordEnd = false;


    // Library Initialization Function
    // Passing options parameter to set custom configuration
    function initialize(node, options) {
        // Extending Default Config Options
        extendOptions(options);
        console.log("Initializing Android Lock");
        console.log("Node :" + node);
        // Build all elements to display
        buildElements(node);

    }

    function buildElements(node) {
        var nodesContainer = document.createElement("div");
        nodesContainer.classList.add("nodeContainer");
        node.appendChild(nodesContainer);

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
        actionBtnContainer.appendChild(actionBtn);
        node.appendChild(actionBtnContainer);
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

    return {
        init: initialize
    }
}());