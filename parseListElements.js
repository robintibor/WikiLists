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
        return true;
    };
};
wl.parser.dummyFindListElements().css('background-color', 'yellow');
// http://en.wikipedia.org/wiki/List_of_healthcare_reform_advocacy_groups_in_the_United_States
// For http://en.wikipedia.org/wiki/List_of_Christian_denominations :
// TODO(Robin): remove those 
//$('.mw-content-ltr > table ul li a[href^="\\/wiki\\/"]').css('background-color', 'yellow')
