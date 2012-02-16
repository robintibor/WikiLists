test("adding nodes to the path, checking num of nodes", function() {
    var elementPath = new wl.parser.path();
    equal(elementPath.numNodes(), 0, "should be empty at start");
    elementPath.addNode("a", 2);
    equal(elementPath.numNodes(), 1, "should have one node now");
    elementPath.addNode("b", 3);
    equal(elementPath.numNodes(), 2, "should have two nodes now");
    var newElementPath = new wl.parser.path();
    equal(newElementPath.numNodes(), 0, "new element path should still be empty");
    equal(elementPath.numNodes(), 2, "should still have two nodes");
    
});

var comparePathByTags = function(nodeList, otherNodeList) {
        if (nodeList.length != otherNodeList.length) return false;
        for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].tag != otherNodeList[i].tag)
                return false;
        }
        return true;
    };

test("comparing paths by tagName", function() {
    var elementPath = new wl.parser.path();
    elementPath.addNode("a", 2);
    elementPath.addNode("b", 3);
    var otherElementPath = new wl.parser.path();
    otherElementPath.addNode("a", 2);
    otherElementPath.addNode("b", 5);
    ok(elementPath.equalToPath(otherElementPath, comparePathByTags),
                    "paths should be the same"); 
    var thirdElementPath = new wl.parser.path();
    thirdElementPath.addNode("a", 3);
    ok(!elementPath.equalToPath(thirdElementPath, comparePathByTags), 
    "different length paths should not be seen as equal" );
    thirdElementPath.addNode("c", 5);
    ok(!elementPath.equalToPath(thirdElementPath, comparePathByTags),
        "different tags should result in different paths");
                    
});

test("adding elements to the path pool, retrieving most used path", function() {
    var pathPool = new wl.parser.elementPathPool(comparePathByTags); 
    var jqueryDOM = $("<div><test><a></a></test><test><a></a><test><div>");
    var elementInDOM = jqueryDOM.find("a")[0];   
    var similarElementInDOM = jqueryDOM.find("a")[1];
    pathPool.addElement(elementInDOM);
    equal(pathPool.frequentElements(1).length, 1,
      "most frequent elements should contain one element after adding");
    pathPool.addElement(similarElementInDOM);
    equal(pathPool.frequentElements(1).length, 2,
      "similar elements should be grouped together");
    var differentElementInDOM = jqueryDOM.find("test")[0];
    pathPool.addElement(differentElementInDOM);
    equal(pathPool.frequentElements(0.5).length, 2,
      "different elements should not be grouped together");
    equal(pathPool.frequentElements(0.2).length, 3,
      "different element should be present with frequency of its path at 0.33!");
});

test("understanding jquery elements and context", function() {
    var jqueryDOM = $("<div><test><a></a></test><div>");
    var elementInDOM = jqueryDOM.find("a")[0];
    equal($(elementInDOM).parent()[0].tagName, "TEST");
});

