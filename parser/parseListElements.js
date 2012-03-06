var wikiLists = wikiLists || {};
var wl = wikiLists;
//var wl = {};
wl.parser = new function() {
    this.parseListElements = function(htmlDOM) {
        // send to server
        
        var contentDOM = htmlDOM.find('.mw-content-ltr');
        return parseListElementsFromContent(contentDOM);
    };
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
    this.createTagIdAndTextSelector = function(element) {
        var tagName = element.tagName;
        var selector = tagName;
        var id = $(element).attr('id');
        if (id) { 
            selector += '#'+ id;
        }
        var text = $(element).text();
        if (text.length > 0)
            selector += ':contains("' + text + '")';
        return selector;
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
    var comparePathByTags = function(nodeList, otherNodeList) {
//        if (nodeList.length != otherNodeList.length) return false;
        for (var i = 0; i < Math.min(nodeList.length, 2); i++) {
            if (i === 0 && nodeList[i].isChildNr != otherNodeList[i].isChildNr)
                return false;
            if (nodeList[i].tag != otherNodeList[i].tag)
                return false;
        }
        return true;
    };
    var parseListElementsFromContent = function (contentDOM) {
        var wikiLinks = contentDOM.find('a');
        wikiLinks = wikiLinks.not('#toc a');
        wikiLinks = wikiLinks.not('h2:has(span#See_also) ~ * * a');
        wikiLinks = wikiLinks.not(':header:has(span.editsection) a');
        wikiLinks = wikiLinks.not(contentDOM.find('h2:has(span#References) ~ *').find('a'));
        wikiLinks.css('background-color', 'yellow');
        var pathPool = new wl.parser.elementPathPool(comparePathByTags);
        pathPool.addElements(wikiLinks);
        // The more links, the more list items => you can expect that a site
        // with a lot of wikilinks will have relatively few other links
        // compared to the list item links
        var minFrequencyOfElementPath;
        if (wikiLinks.length > 100)
            minFrequencyOfElementPath = 0.2;
         else
            minFrequencyOfElementPath = 0.4;
        return pathPool.frequentElements(minFrequencyOfElementPath);
    };
};
wl.parser.computeListElementsAndQueryString(function (listElements, queryString) { $(listElements).css('background-color', 'green'); console.log('querystring: ' + queryString); });
/*wl.addJavaScriptFiles(['http://c9.io/' + wl.USER + '/wikilists/workspace/parser/element-path.js']);
setTimeout(function() {
    wl.parser.parseListElements($(document)).css('background-color', 'green');
}, 1000);*/