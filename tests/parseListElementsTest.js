wl.parserTests = new function() {
    this.testParsingKnownSites = function() {        
        for (var i = 0; i < testSites.length; i++) {
            var testSite = testSites[i].site;
            var testSelector = testSites[i].selector;
        }
    };
    var parseOneSite = function(testSite, testSelector) {
        
    };
    var testSites = [ { site: 'http://en.wikipedia.org/wiki/List_of_healthcare_reform_advocacy_groups_in_the_United_States',
                        selector: '.mw-content-ltr > ul li a[href!="http://www.uhcan.org/"]' }];
};
jQuery(document).ready(function($) {
    alert($('h1').html());
});

        


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

wl.parserTests.testParsingKnownSites();
