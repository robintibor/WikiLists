
test('assigning and retrieving elements', function() {
    var element = $('<a> test</a>');
    var elementPath = new wl.parser.elementPath(element);
    equal(elementPath.element(), element, 'element of path should be retrievable');
    deepEqual(elementPath.element(), element, 'element of path should be deeply equal');
    var newElement = $('<b>test</b>');
    var newElementPath = new wl.parser.elementPath(newElement);
    equal(newElementPath.element(), newElement, 'element of new path should be retrievable');
    deepEqual(newElementPath.element(), newElement, 'element of new path should be deeply equal');
    notEqual(newElementPath.element, elementPath.element, 'different elements shouldn\'t be equal');
});

test('adding nodes to the path, checking num of nodes', function() {
    var elementPath = new wl.parser.elementPath();
    equal(elementPath.numNodes(), 0, "should be empty at start");
    elementPath.addNodeToFront('a', 2);
    equal(elementPath.numNodes(), 1, "should have one node now");
    elementPath.addNodeToFront('b', 3);
    equal(elementPath.numNodes(), 2, "should have two nodes now");
});

test('understanding jquery elements and context', function() {
    var jqueryDOM = $('<div><test><a></a></test><div>');
    var elementInDOM = jqueryDOM.find('a')[0];
    equal($(elementInDOM).parent()[0].tagName, 'TEST');
});

