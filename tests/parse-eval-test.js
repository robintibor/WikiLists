
function compareHrefs(firstElements, secondElements, message) {
    equal(firstElements.length, secondElements.length, message + 
    " | size should be equal");
    for (var i = 0; i < firstElements.length; i++) {
        equal(firstElements.eq(i).attr('href'), 
            secondElements.eq(i).attr('href'), message + 
        " | href nr " + i + "  should be equal");
    }
}
test("compare two element sets to each other by href and get missing and " +
    "false positive elements",
function() {
    var compareResult = parseTester.compareListElements($('<a href="test"></a>'),
    $('<a href="test"></a>'));
    compareHrefs(compareResult.missingElements, $(), 
        "same sets should not have missing elements");
    compareHrefs(compareResult.falsePositiveElements, $(), 
        "same sets should not have false positive elements");
    compareResult = parseTester.compareListElements($('<a href="test"></a>'),
        $('<a href="differentTest"></a>'));
    compareHrefs(compareResult.missingElements,
        $('<a href="differentTest"></a>'), 
        "missing Element should be identified");
    compareHrefs(compareResult.falsePositiveElements,
        $('<a href="test"></a>'), 
        "false positive element should be identified");
});


