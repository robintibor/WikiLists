var wikiLists = wikiLists || {};
var wl = wikiLists;
//var wl = {};
wl.parser = new function() {
    this.dummyFindListElements = function() {
        if (document.URL == 'http://en.wikipedia.org/wiki/' + 
                            'List_of_healthcare_reform_advocacy_groups_in_the_United_States') {
            return $('.mw-content-ltr > ul li a[href!="http://www.uhcan.org/"]').not('#toc a').not('h2:has(span#See_also) ~ * * a');           
        }
    };
    this.dummyTest = function() {
        return true;
    };
    this.parseListElements = function(htmlDOM) {
        var contentDOM = htmlDOM.find('.mw-content-ltr');
        return parseListElementsFromContent(contentDOM);
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
        // compared to the wikilinks
        var minFrequencyOfElementPath;
        if (wikiLinks.length > 100)
            minFrequencyOfElementPath = 0.2;
         else
            minFrequencyOfElementPath = 0.4;
        return pathPool.frequentElements(minFrequencyOfElementPath);
    };
};
wl.addJavaScriptFiles(['http://c9.io/' + wl.USER + '/wikilists/workspace/parser/element-path.js']);
setTimeout(function() {
    wl.parser.parseListElements($(document)).css('background-color', 'green');
}, 1000);
//wl.parser.dummyFindListElements().css('background-color', 'yellow');
