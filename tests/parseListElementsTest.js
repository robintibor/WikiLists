// Test for me for understanding jquery
test('add elements to jquery set', function () {
    var emptyJQueryList = $();
    equal(emptyJQueryList.length, 0);
    emptyJQueryList = emptyJQueryList.add('<h1><a>test</a></h1>');
    equal(emptyJQueryList.length, 1);
});

test('test extracting links from a group', function() {
    var pageDOM = $('<div> <a href="testhref"></a></div>');
    var testListItemArray = [{'href' : 'testhref' , 'linkNumbers' : [0]}];
    equal(wl.parser.findListElementsAndStoreData(pageDOM, testListItemArray).length, 1,
    "should find the link element by matching href");
    var pageDOM = $('<div> <a href="testhref"></a><a href="falsehref"></a></div>');
    equal(wl.parser.findListElementsAndStoreData(pageDOM, testListItemArray).length, 1,
    "should not find the link element with false href");
});
