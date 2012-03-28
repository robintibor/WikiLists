var wikiLists = wikiLists || {};
var wl = wikiLists;
wl.facade = new function() {
    this.computeListElementsAndQueryStringAndStoreList = function (callback) {
        var callbackAndStoreList = function(callback, listElements, queryString) {            
            wl.lists.lastListElements = listElements;
            callback(listElements, queryString);
        }.bind(this, callback);
        wl.facade.computeListElementsAndQueryString(callbackAndStoreList);
    };
    this.computeListElementsAndQueryString = function(callback) {
        wl.facade.computeListElementsAndQueryStringForWikiURL(
            document.location.href, $(document), callback);
    };
    this.computeListElementsAndQueryStringForWikiURL = function(
        wikiURL, jqueryDOM, callback) {
        var callbackForJSON = function(jqueryDOM, callback, responseJSON) {
                receiveListElementsAndQueryStringAndStoreList(jqueryDOM, callback,
                    responseJSON);
            }.bind(this, jqueryDOM, callback);
        wl.client.getListElementsAndQueryStringForWikiURL(wikiURL,
            callbackForJSON);
    };
    var receiveListElementsAndQueryStringAndStoreList = function(jqueryDOM,
        callback, responseJSON) {
        var listElements =  wl.parser.extractFirstGroupElementsAndStoreData(
            jqueryDOM, responseJSON.listItems);
        var queryString = responseJSON.broccoliQueryString;
        wl.parser.debugParser.addToolTipsForAllGroups(jqueryDOM,
            responseJSON.listItems);
        callback(listElements, queryString);
    };
};