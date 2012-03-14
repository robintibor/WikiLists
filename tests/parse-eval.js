wl.parser.stromboliPort = 29385;
var parseTester = new function() {
    this.testSites = function(sites) {
        for (var i = 0; i < sites.length; i++) {
            var site = sites[i];
            var siteTester = new parseTester.siteTester(site.testURL,
                site.wikiURL, site.selector, site.notFilters);
            parseTester.appendSiteResultDiv(site.wikiURL);
            siteTester.test();
        }
    };
    this.appendSiteResultDiv = function (wikiURL)  {
        $('#testResults').append('<div> <div class="mainResult">' +
        '<a href="' + wikiURL + '">'+ wikiURL + '</a>' +
        '</div></div>');
    };
    this.appendResults= function (wikiURL, compareResult) {
        var resultDiv = findResultDivForWikiURL(wikiURL);
        var missingElements = compareResult.missingElements;
        var falsePositiveElements = compareResult.falsePositiveElements;
        appendResultsToDiv(resultDiv, missingElements, falsePositiveElements);
    };
    var findResultDivForWikiURL = function(wikiURL) {
        return $('#testResults > div').has('a[href="' + wikiURL + '"]');
    }
    var appendResultsToDiv = function(resultDiv, missingElements,
        falsePositiveElements) {
        if (missingElements.length === 0 && falsePositiveElements.length === 0)
            resultDiv.find('.mainResult').append('<div class="goodResult"> Ok </div>');
        else 
            resultDiv.find('.mainResult').append('<div class="badResult"> Failed </div>');
        if (missingElements.length > 0) {
            var missingDiv =  $('<div class="missingElements">' + 
            '<span class="resultHeader">Missing: ' + missingElements.length +
            '</span></div>').appendTo(resultDiv);
            missingDiv.append(missingElements);
        }
        if (falsePositiveElements.length > 0) {
            var falsePositiveDiv =  $('<div class="falsePositiveElements">' +
                '<span class="resultHeader">' +
                'False Positive: ' + falsePositiveElements.length +
                '</span></div>').appendTo(resultDiv);
            falsePositiveDiv.append(falsePositiveElements);
        }   
    }

 this.siteTester = function(testURL, wikiURL, selector, notFilters) {
     var receiveParsedElements = function(wikiURL, expectedElements, 
        parsedElements, queryString) {
        var compareResult = parseTester.compareListElements(parsedElements,
            expectedElements);
        parseTester.appendResults(wikiURL, compareResult);
     };
     var receiveTestSite = function(wikiURL, selector, notFilters, htmlString) {
        var htmlDOM = $(htmlString);
        var expectedElements = htmlDOM.find(selector);
        for (var i = 0; i < notFilters.length; i++) {
            expectedElements = expectedElements.not(notFilters[i]);
        }
        wl.parser.computeListElementsAndQueryStringForWikiURL(
            wikiURL, htmlDOM, receiveParsedElements.bind(this, wikiURL,
            expectedElements));
     };
     this.test = function() {
        $.get(testURL,
            receiveTestSite.bind(this, wikiURL, selector, notFilters));
     };

 };
};
parseTester.compareListElements = function(actualElements, expectedElements) {
    var computeSetDifferenceByHrefs = function(firstSet, secondSet) {
        return firstSet.filter(function() {
            var hrefOfFirstSetElement = $(this).attr("href");
            if (secondSet.filter(
                'a[href="' + hrefOfFirstSetElement + '"]').length === 0)
                return true;
            else
                return false;
                
        });
    };
    var missingElements = computeSetDifferenceByHrefs(
        expectedElements, actualElements);
    var falsePositiveElements = computeSetDifferenceByHrefs(
        actualElements, expectedElements);
    return { "missingElements" : missingElements,
             "falsePositiveElements" : falsePositiveElements};        
};


var testSites = [ 
    { testURL :'test-sites/List_of_healthcare_reform_advocacy_groups_in_the_United_States.html',
    wikiURL : 'http://en.wikipedia.org/wiki/List_of_healthcare_reform_advocacy_groups_in_the_United_States',
    selector : '.mw-content-ltr > ul li a[href^="/wiki/"]',
    notFilters : ['h2:has(span#See_also) ~ * * a']},
    { testURL : 'test-sites/List_of_Christian_denominations.html',
    wikiURL : 'http://en.wikipedia.org/wiki/List_of_Christian_denominations',
    selector : '.mw-content-ltr > table ul li a[href^="/wiki/"]',
    notFilters: ['#toc a', 'h2:has(span#See_also) ~ * * a'] }
    ];
jQuery(document).ready(function($) {
    parseTester.testSites(testSites);
});

// for backwards compatability of bind function, 
// from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP
                                 ? this
                                 : oThis || window,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}