var wikiLists = wikiLists || {};
var wl = wikiLists;
wl.parser = new function() {    
    this.stromboliPort = wl.STROMBOLIPORT;
    // callback function should accept elements as first parameter
    // and query string for broccoli query
    this.computeListElementsAndQueryString = function(callback) {
        this.computeListElementsAndQueryStringForWikiURL(
            document.location.href, $(document), callback);
    };  
    this.computeListElementsAndQueryStringForWikiURL = function(
        wikiURL, jqueryDOM, callback) {
        this.getListElementsAndQueryStringForWikiURL(wikiURL, jqueryDOM, callback);
    };
    this.getListElementsAndQueryStringForWikiURL = function(wikiURL,
        jqueryDOM, callback) {
        var stromboliRequestURL = 
            'http://stromboli.informatik.uni-freiburg.de:' +
            wl.parser.stromboliPort + '/' + wikiURL;
        jQuery.ajax({
          url: stromboliRequestURL,
          dataType: 'jsonp',
          data: {
              format: 'json'
              },
          success: receiveListElementsAndQueryString.bind(this, jqueryDOM,
            callback)
        });
    };
    var receiveListElementsAndQueryString = function(jqueryDOM, callback,
        responseJSON) {
        var listElements =  extractFirstGroupElements(responseJSON.listItems,
        jqueryDOM);
        var queryString = responseJSON.broccoliQueryString;
        callback(listElements, queryString);
    };

    var extractFirstGroupElements = function(listItemsJSON, jqueryDOM) {
        var firstGroup = listItemsJSON.listItemGroups[0];
        var linkElements = wl.parser.findListElements(jqueryDOM,
            firstGroup);
        return linkElements;
    };
    // public for testing purposes ...
    this.findListElements = function(jqueryDOM, listItemArray) {
        var listElements = [];
        for (var i = 0; i < listItemArray.length; i++) {
            var listItem = listItemArray[i];
            var DOMElementsForThisItem = findListItemElementsAndStoreData(
                listItem, jqueryDOM);
            listElements = listElements.concat(DOMElementsForThisItem);
        }
        return $(listElements);
    };
    var findListItemElementsAndStoreData= function(listItem, jqueryDOM) {
        var listItemElements = [];     
        var linkElementsForHref = jqueryDOM.find('a[href="' +
            listItem.href + '"]');
        var listItemLinkNumbers = listItem.linkNumbers;
        for (var i = 0; i < listItemLinkNumbers.length; i++) {
            var listItemIndex = listItemLinkNumbers[i];
            var listItemElement = linkElementsForHref.get(listItemIndex);
            $.data(listItemElement, 'score', listItem.score);
            $.data(listItemElement, 'classes', listItem.classes);
            listItemElements.push(listItemElement);
        }
        return listItemElements;            
    };
};
var hackElementsAndStringCallback = function(listElements, queryString) {
 $(listElements).css('background-color', 'green');
 console.log("list size " + listElements.length);
 console.log('querystring: ' + queryString);
}
if (document.location.href.substring(0, "http://en.wikipedia.org".length) ==
    "http://en.wikipedia.org") {
    wl.parser.computeListElementsAndQueryString(hackElementsAndStringCallback);
}