var wikiLists = wikiLists || {};
var wl = wikiLists;
wl.lists = new function(){
    this.lastListElements = {};
    this.addBroccoliInstances = function (broccoliInstances) {
        var newBroccoliListElements = [];
        var broccoliListElementsMatchedByWikiList = [];
        for (var i = 0; i < broccoliInstances.length; i++) {
            var broccoliInstance = broccoliInstances[i];
            addBroccoliInstance(broccoliInstance, newBroccoliListElements,
                broccoliListElementsMatchedByWikiList);
        }
        wl.UIMenu.loadBroccoliLists(broccoliListElementsMatchedByWikiList,
            newBroccoliListElements);
    };
    var addBroccoliInstance = function(broccoliInstance,
        newBroccoliListElements, broccoliListElementsMatchedByWikiList) {
        var wikiTitleLink = 
            wl.lists.extractHrefOfBroccoliInstanceText($(broccoliInstance).text());
        var wikiHref = '/wiki/' + wikiTitleLink;
        var isNewElement = !wikiListElementsContainHref(wikiHref);
        var linkElement = $(document.createElement('a')).
                attr('href', wikiHref).get();        
        $(linkElement).html(wikiTitleLink.replace(/_/g, ' '));
        if (isNewElement) {
            newBroccoliListElements.push(linkElement);
        } else {
            broccoliListElementsMatchedByWikiList.push(linkElement);
        }
    };
    this.extractHrefOfBroccoliInstanceText = function(instanceText) {
        // format  of instancetext:
        // :e:<entityname>:<wikipedia-href-link>
        // we are trying to extract the href, therefore take string
        // after last ':'
        // assumption: there should be no ':' inside the wikipedia link!
        return instanceText.slice(instanceText.lastIndexOf(':') + 1);
    };
    var wikiListElementsContainHref = function (wikiHref) {
        return wl.lists.lastListElements.is(function() {
            return $(this).attr('href') == wikiHref;});
    };
};

