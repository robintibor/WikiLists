wl.parserTests = new function() {
    this.testParsingKnownSites = function() {        
        for (var i = 0; i < testSites.length; i++) {
            var testSite = testSites[i].site;
            var testSelector = testSites[i].selector;
            var filters = testSites[i].filters;
            parseOneSite(testSite, testSelector, filters);
        }
    };
    var parseOneSite = function(testSite, testSelector, filters) {
        $.get(testSite, function(htmlString) {
            var htmlDOM = $(htmlString);
            var expectedListElements = htmlDOM.find(testSelector);
            for (var i = 0; i < filters.length; i++) {
                var filter = filters[i];
                expectedListElements = expectedListElements.not(filter);
            }
            var parserListElements = wl.parser.parseListElements(htmlDOM);
            equal(parserListElements.size(), expectedListElements.size(),
                    'parser should get as many elements as expected');
            for (var i = 0; i < parserListElements.size(); i++) {
                equal($(parserListElements[i]).html(), $(expectedListElements[i]).html());
            }
        });
        
    };
    var testSites = [ { site: 'test-sites/List_of_healthcare_reform_advocacy_groups_in_the_United_States.html',
                        selector: '.mw-content-ltr > ul li a[href!="http://www.uhcan.org/"]',
                        filters: ['#toc a', 'h2:has(span#See_also) ~ * * a']}];
};
        

test('testParsingListElements', function() {
    stop();
    var timeToLoadSites = 300;
    wl.parserTests.testParsingKnownSites();
    setTimeout(function() {  
        start();  
    }, timeToLoadSites);  
});

test('createSelectors', function() {
    var htmlElement = $('<a href = "wiki" id="testid">bla</a>')[0];    
    equal(wl.parser.createTagIdAndTextSelector(htmlElement), 
        'A#testid:contains("bla")', 'selector with id tag text should be correct');    
    equal(wl.parser.createTagIdAndTextSelector($('<a></a>')[0]), 
        'A', 'selector without anything should be correct');    
});

// Test for me for understanding jquery
test('add elements to jquery set', function () {
    var emptyJQueryList = $();
    equal(emptyJQueryList.length, 0);
    emptyJQueryList = emptyJQueryList.add('<h1><a>test</a></h1>');
    equal(emptyJQueryList.length, 1);
});

