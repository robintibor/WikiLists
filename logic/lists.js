var wikiLists = wikiLists || {};
var wl = wikiLists;
wl.lists = new function(){
    this.lastListElements = [];
    this.hrefToBroccoliHitNumber = {};
    this.wikiListLinkSet = {};

    this.setListElements = function(listElements) {
        wl.lists.lastListElements = listElements;
    };
    
    this.setWikiListLinkSet = function (wikiListLinkSet) {
        wl.lists.wikiListLinkSet = wikiListLinkSet;
    };
    
    var BroccoliInstance = function(broccoliInstanceXML, hitGroupIndex) {
        var xmlInstanceText = $(broccoliInstanceXML).text();
        var wikiTitleLink = 
            wl.lists.extractHrefOfBroccoliInstanceText(xmlInstanceText);
        this.wikiHref = '/wiki/' + wikiTitleLink;
        this.title = wikiTitleLink.replace(/_/g, ' ');
        this.hitGroupIndex = hitGroupIndex;
    };

    this.extractHrefOfBroccoliInstanceText = function(instanceText) {
        // format  of instancetext:
        // :e:<entityname>:<wikipedia-href-link>
        // we are trying to extract the href, therefore take string
        // after last ':'
        // assumption: there should be no ':' inside the wikipedia link!
        return instanceText.slice(instanceText.lastIndexOf(':') + 1);
    };

    this.getHitGroupNr = function(wikiHref) {
        return wl.lists.hrefToBroccoliHitNumber[wikiHref];
    };

    this.addBroccoliInstances = function (broccoliInstancesXML) {        
        wl.lists.hrefToBroccoliHitNumber = {};
        var newBroccoliListElements = [];
        var broccoliListElementsMatchedByWikiList = [];
        for (var i = 0; i < broccoliInstancesXML.length; i++) {
            var instanceXML = broccoliInstancesXML[i];
            var broccoliInstance = new BroccoliInstance(instanceXML, i);
            addBroccoliInstance(broccoliInstance, newBroccoliListElements,
                broccoliListElementsMatchedByWikiList);
        }
        wl.UIMenu.loadBroccoliLists(broccoliListElementsMatchedByWikiList,
            newBroccoliListElements);
    };

    var addBroccoliInstance = function(broccoliInstance,
        newBroccoliListElements, broccoliListElementsMatchedByWikiList) {
        var wikiHref = broccoliInstance.wikiHref;
        var isNewElement = !wl.lists.wikiListLinkSet.hasOwnProperty(wikiHref);
        var linkElement = createLinkElement(wikiHref, broccoliInstance.title);
        if (isNewElement) {
            newBroccoliListElements.push(linkElement);
        } else {
            broccoliListElementsMatchedByWikiList.push(linkElement);
        }
        rememberHitGroupIndexInMap(wikiHref, broccoliInstance.hitGroupIndex);
    };

    // create link element opening in new window
    var createLinkElement = function(href, text) {
        var linkElement = $(document.createElement('a')).attr('href', href); 
        // open link in new window
        linkElement.attr('target', '_blank');
        linkElement.html(text);
        return linkElement.get();
    };

    var rememberHitGroupIndexInMap = function(wikiHrefOfInstance, hitGroupIndex) {
        wl.lists.hrefToBroccoliHitNumber[wikiHrefOfInstance] = hitGroupIndex;
    };
};
