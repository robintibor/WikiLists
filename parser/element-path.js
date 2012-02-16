var wikiLists = wikiLists || {};
var wl = wikiLists;
wl.parser = wl.parser || {};
wl.parser.path =  function() {
    var _nodeList = [];
    this.nodeList = function() {
        return _nodeList;
    };
    this.numNodes = function() {
        return _nodeList.length;
    };
    this.addNode = function(tag, isChildNr) {
        var newNode = new node(tag, isChildNr);
        _nodeList.push(newNode);
    };
    var node = function(tag, isChildNr) {
        this.tag = tag;
        this.isChildNr = isChildNr;
    };
    this.equalToPath = function(otherPath, comparator) {
        return comparator(this.nodeList(), otherPath.nodeList());
    };
};

wl.parser.elementPathPool = function(pathComparator) {
    var _pathComparator = pathComparator;
    var pathAndElements = function(path) {
        this.path = path;
        this.elements = [];
    };
    var numberOfElements = 0;
    var createElementPath = function(element) {
        var elementPath = new wl.parser.path();
        var elementIsChildNr = $(element).parent().contents().index(element);
        elementPath.addNode(element.tagName, elementIsChildNr);
        var parents = $(element).parents();
        for (var i = 0; i < parents.length; i++) {
            var isChildNr = -1;            
            elementPath.addNode(parents[i].tagName, isChildNr);
        }
        return elementPath;
    };
    var getMatchingPathIndex = function(path) {
        for (var j = 0; j < _pathsAndElements.length; j++) {
            var otherPath = _pathsAndElements[j].path;
            if (path.equalToPath(otherPath, _pathComparator)) {
                return j;
            }
        }
        return -1;
    };
    var _pathsAndElements = [];
    // for convenience
    this.addElements = function(elements) {
        for (var i = 0; i < elements.length; i++) {
            this.addElement(elements[i]);
        }
    };
    this.addElement = function(element) {
        var elementPath = createElementPath(element);
        // TODO: function getMatchingPathIndex
        var pathIndex = getMatchingPathIndex(elementPath);
        if (pathIndex !=  -1) {        
            _pathsAndElements[pathIndex].elements.push(element);
        } else {
            var newPathAndElements = new pathAndElements(elementPath);
            newPathAndElements.elements.push(element);
            _pathsAndElements.push(newPathAndElements);
        }
        numberOfElements++;
    };
    this.frequentElements = function(minFrequencyOfPath) {
        if (_pathsAndElements.length === 0)
            return $();
        var frequentElements = [];
        for (var i = 0; i < _pathsAndElements.length; i++) {
            var numElementsOfPath = _pathsAndElements[i].elements.length;
            var frequencyOfPath = numElementsOfPath / numberOfElements;
            console.log("firstElement: " + _pathsAndElements[i].elements[0]);
            console.log("num elements: " + numElementsOfPath);
            console.log("freq: " + frequencyOfPath);
            if (frequencyOfPath >= minFrequencyOfPath) {
                frequentElements = frequentElements.concat(_pathsAndElements[i].elements);
            }
        }
        console.log("minFreq: " +  minFrequencyOfPath);
        return $(frequentElements);
    };
};