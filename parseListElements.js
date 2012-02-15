var wl = (typeof wikiLists == "undefined" || !wikiLists ) ? {} : wikiLists;
//var wl = {};
wl.parser = new function() {
    this.dummyFindListElements = function() {
        if (document.URL == 'http://en.wikipedia.org/wiki/' + 
                            'List_of_healthcare_reform_advocacy_groups_in_the_United_States') {
            return $('.mw-content-ltr > ul li a[href!="http://www.uhcan.org/"]');           
        }
    };
    this.dummyTest = function() {
        return true;
    };
    this.parseListElements = function(htmlDOM) {
        var clonedDOM = htmlDOM.clone();
        var listElementsInClone = parseListElementsFromClonedDom(clonedDOM);
        var listElementsInOriginal = $();
        for (var i = 0; i < listElementsInClone.size(); i++) {            
            var selector = wl.parser.createTagIdAndTextSelector(listElementsInClone[i]);
            console.log(selector);
            var newElements = $(htmlDOM).find(selector);
            listElementsInOriginal = listElementsInOriginal.add(newElements);
        }
        return listElementsInOriginal;
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
    }
    
    var parseListElementsFromClonedDom = function (clonedDOM) {
        var contentDOM = clonedDOM.find('.mw-content-ltr');
        contentDOM.remove('#toc');
        return parseListElementsFromContent(contentDOM);
    }
    var parseListElementsFromContent = function (contentDOM) {
        return contentDOM.find('ul li a[href!="http://www.uhcan.org/"]').not('#toc a').not('h2:has(span#See_also) ~ * * a');
    }
};
wl.parser.dummyFindListElements().css('background-color', 'yellow');
// http://en.wikipedia.org/wiki/List_of_healthcare_reform_advocacy_groups_in_the_United_States
// For http://en.wikipedia.org/wiki/List_of_Christian_denominations :
// TODO(Robin): remove those 
//$('.mw-content-ltr > table ul li a[href^="\\/wiki\\/"]').css('background-color', 'yellow')
