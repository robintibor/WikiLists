var wikiLists = wikiLists || {};
var wl = wikiLists;
wl.parser = new function() {
    this.extractFirstGroupElements = function(jqueryDOM, listItemsJSON) {
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
    var findListItemElementsAndStoreData = function(listItem, jqueryDOM) {
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