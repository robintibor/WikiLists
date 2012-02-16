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
        if (nodeList.length != otherNodeList.length) return false;
        for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].tag != otherNodeList[i].tag)
                return false;
        }
        return true;
    };
    var parseListElementsFromContent = function (contentDOM) {
        var wikiLinks = contentDOM.find('a').not('h2:has(span#See_also) ~ * * a').not('#toc a');        
        var pathPool = new wl.parser.elementPathPool(comparePathByTags);
        console.log("wikilinkslength = " + wikiLinks.length);
        for (var i = 0; i < wikiLinks.length; i++) {
            pathPool.addElement(wikiLinks[i]);
        }
        return pathPool.frequentElements();
    };
};
wl.addJavaScriptFiles(['http://c9.io/' + wl.USER + '/wikilists/workspace/parser/element-path.js']);
//wl.parser.dummyFindListElements().css('background-color', 'yellow');
