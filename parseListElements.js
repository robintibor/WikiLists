var wl = wikiLists || {};
wl.parser = new function() {
    this.dummyParse = function() {
        alert('dummyParse');
    };
};
$('.mw-content-ltr > ul li a[href!="http://www.uhcan.org/"]')