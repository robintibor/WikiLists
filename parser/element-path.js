var wikiLists = wikiLists || {};
var wl = wikiLists;
wl.parser = wl.parser || {};
wl.parser.elementPath = function(element) {
    var element = element;
    this.element = function() {
        return element;
    };
    var reverseNodeList = [];
    this.numNodes = function() {
        return reverseNodeList.length;
    };
    this.addNodeToFront = function(tag, isChildNr) {
        var newNode = new node(tag, isChildNr);
        reverseNodeList.push(newNode);
    };
    var node = function(tag, isChildNr) {
        this.tag = tag;
        this.isChildNr = isChildNr;
    }
}
/*
wl.parser.elementPathPool = function(*/