var wikiLists = wikiLists || {};
var wl = wikiLists;
wl.lists = new function(){
    this.lastListElements = {};
    this.addBroccoliInstances = function (broccoliInstances) {
        var newBroccoliListElements = [];
        for (var i = 0; i < broccoliInstances.length; i++) {
            var broccoliInstance = broccoliInstances[i];
            addBroccoliInstance(broccoliInstance, newBroccoliListElements);
        }
    };
    var addBroccoliInstance = function(element, newBroccoliListElements) {
        var wikiHref = '/wiki/' + 
            wl.lists.extractHrefOfBroccoliInstanceText($(element).text());
        var isNewElement = !wikiListElementsContainHref(wikiHref);
        if (isNewElement) {
            var newLinkElement = $(document.createElement('a')).
                attr('href', wikiHref);
            console.log("new element " + newLinkElement.get());
            newBroccoliListElements.push(newLinkElement);
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
        return wl.lists.lastListElements.is('a[href="' + wikiHref +'"]');
    };
};

