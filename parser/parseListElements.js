var wikiLists = wikiLists || {};
var wl = wikiLists;
//var wl = {};
wl.parser = new function() {
    // callback function should accept elements as first parameter
    // and query string for broccoli query
    this.computeListElementsAndQueryString = function(callback) {
        callbackForElementsAndBroccoliQueryString = callback;
        this.getListElementsAndQueryStringFromServer();
    };
    this.getListElementsAndQueryStringFromServer = function() {       
        jQuery.ajax({
          url: 'http://stromboli.informatik.uni-freiburg.de:29385/' + document.location.href,
          dataType: 'jsonp',
          data: {
              format: 'json'
              },
          success: receiveListElementsAndQueryString
        });
    };
    var callbackForElementsAndBroccoliQueryString;
    var receiveListElementsAndQueryString = function(responseJSON) {        
        var listElements =  extractFirstGroupElements(responseJSON.listItems);
        var queryString = responseJSON.broccoliQueryString;
        callbackForElementsAndBroccoliQueryString(listElements, queryString);
    };

    var extractFirstGroupElements = function(listItemsJSON) {
        var firstGroup = listItemsJSON.listItemGroups[0];
        var firstGroupHrefSet = firstGroup.listItemScores;
        return wl.parser.findLinkElements($(document), firstGroupHrefSet);
        
    };
    // public for testing purposes ...
    this.findLinkElements = function(jqueryDOM, hrefSet) {
        var linkElements = $();
        linkElements = jqueryDOM.find('a').filter(function() { 
                var hrefOfElement = $(this).attr('href');
                if (hrefSet.hasOwnProperty(hrefOfElement)) return true;
                else return false;
            });
        return linkElements;
    };
};
wl.parser.computeListElementsAndQueryString(function (listElements, queryString) { $(listElements).css('background-color', 'green'); console.log('querystring: ' + queryString); });