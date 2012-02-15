wl.parserTests = new function() {
    this.testParsingKnownSites = function() {        
        for (var i = 0; i < testSites.length; i++) {
            var testSite = testSites[i].site;
            var testSelector = testSites[i].selector;
            parseOneSite(testSite, testSelector);
        }
    };
    var parseOneSite = function(testSite, testSelector) {
        $.get(testSite, function(htmlString) {
            var expectedListElements = $(htmlString).find(testSelector);
            var parserListElements = wl.parser.parseListElements(htmlString);
            equal(expectedListElements.size(), parserListElements.size(),
                    'parser should get as many elements as expected');
            for (var i = 0; i < parserListElements.size(); i++) {
                equal($(parserListElements[i]).html(), $(expectedListElements[i]).html());
            }
        });
        
    };
    var testSites = [ { site: 'test-sites/List_of_healthcare_reform_advocacy_groups_in_the_United_States.html',
                        selector: '.mw-content-ltr > ul li a[href!="http://www.uhcan.org/"]' }];
};
        

test('testParsingListElements', function() {
    stop();
    var timeToLoadSites = 300;
    wl.parserTests.testParsingKnownSites();
    setTimeout(function() {  
        start();  
    }, timeToLoadSites);  
})

test('firstTests()', function() {
    ok(wl.parser.dummyTest(), 'should be true');
})


asyncTest('asynchronous test', function() {
    // The test is automatically paused

	setTimeout(function() {
		ok(true);

		// After the assertion has been called,
		// continue the test
		start();
	}, 100)
})

