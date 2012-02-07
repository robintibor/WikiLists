var wl = wikiLists || {};
wl.parser = new function() {
    this.dummyFindListElements = function() {
        if (document.URL == 'http://en.wikipedia.org/wiki/' + 
                            'List_of_healthcare_reform_advocacy_groups_in_the_United_States') {
            return $('.mw-content-ltr > ul li a[href!="http://www.uhcan.org/"]');           
        }
    };
};
// BEISPIEL :) : $(wl.parser.dummyFindListElements()[15]).css('background-color', 'yellow');