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
    var createElementPath = function(element) {
        var elementPath = new wl.parser.path();
        elementPath.addNode(element.tagName, -1);
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
    };
    this.frequentElements = function() {
        if (_pathsAndElements.length === 0)
            return $();
        var maxNrElements = -1;
        var maxIndex;
        for (var i = 0; i < _pathsAndElements.length; i++) {
            var numElements = _pathsAndElements[i].elements.length;
            if (numElements > maxNrElements) {
                maxIndex = i;
                maxNrElements = numElements;
            }
        }
        var frequentElements = _pathsAndElements[maxIndex].elements;
        return $(frequentElements);
    };
};