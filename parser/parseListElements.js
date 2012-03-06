var wikiLists = wikiLists || {};
var wl = wikiLists;
//var wl = {};
wl.parser = new function() {
    this.findListElements = function(callback) {
        callbackForElements = callback;
        this.getListElementsFromServer();
    };
    this.getListElementsFromServer = function() {       
        jQuery.ajax({
          url: 'http://stromboli.informatik.uni-freiburg.de:' + wl.STROMBOLIPORT +
          '/' + document.location.href,
          dataType: 'jsonp',
          data: {
              format: 'json'
              },
          success: receiveListElements
        });
    };
    var receiveListElements = function(listItemsJSON) {
        var listElements =  extractFirstGroupElements(listItemsJSON);
        callbackForElements(listElements);
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
    var callbackForElements;
};
wl.parser.findListElements(function (listElements) { $(listElements).css('background-color', 'green'); });
/*wl.addJavaScriptFiles(['http://c9.io/' + wl.USER + '/wikilists/workspace/parser/element-path.js']);
setTimeout(function() {
    wl.parser.parseListElements($(document)).css('background-color', 'green');
}, 1000);*/