var wikiLists = wikiLists || {};
var wl = wikiLists;
//var wl = {};
wl.parser = new function() {
    // callback function should accept elements as first parameter
    // and query string for broccoli query
    this.computeListElementsAndQueryString = function(callback) {
        this.computeListElementsAndQueryStringForWikiURL(callback,
            document.location.href);
    };  
    this.computeListElementsAndQueryStringForWikiURL = function(callback,
        wikiURL) {
        callbackForElementsAndBroccoliQueryString = callback;
        this.getListElementsAndQueryStringForWikiURL(wikiURL);
    };
    this.getListElementsAndQueryStringForWikiURL = function(wikiURL)  {
        var stromboliRequestURL = 
            'http://stromboli.informatik.uni-freiburg.de:' +
            wl.STROMBOLIPORT + '/' + wikiURL;
        jQuery.ajax({
          url: stromboliRequestURL,
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
        var linkElements = wl.parser.findListElements($(document), firstGroup);
        return linkElements;
        
    };
    // public for testing purposes ...
    this.findListElements = function(jqueryDOM, listItemArray) {
        var listElements = $();
        var linkElements = jqueryDOM.find('a');
        for (var i = 0; i < listItemArray.length; i++) {
            var listItem = listItemArray[i];
            var DOMElementsForThisItem = findListItemElements(listItem,
                linkElements);
            listElements = listElements.add(DOMElementsForThisItem);
        }
        return listElements;
    };
    
    var findListItemElements= function(listItem, linkElements) {
        var listItemElements = $();
        var linkElementsForHref = linkElements.filter('a[href="' +
        listItem.href + '"]');
        var listItemLinkNumbers = listItem.linkNumbers;
        for (var i = 0; i < listItemLinkNumbers.length; i++) {
            var listItemIndex = listItemLinkNumbers[i];
            var listItemElement = linkElementsForHref.get(listItemIndex);
            listItemElements = listItemElements.add(listItemElement);
        }
        return listItemElements;            
    };
};
wl.parser.computeListElementsAndQueryString(function (listElements, queryString) { $(listElements).css('background-color', 'green'); console.log('querystring: ' + queryString); });