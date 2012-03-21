var wikiLists = new function() {
    this.USER = 'robintibor';
    this.STROMBOLIPORT = 29385;
    this.addJavaScriptFiles = function(fileURLS) {
        for (var i = 0; i < fileURLS.length; i++) {
            var javaScriptSource = fileURLS[i];
            var headID = document.getElementsByTagName("head")[0];         
            var newScript = document.createElement('script');
            newScript.type = 'text/javascript';
            newScript.src = javaScriptSource;
            headID.appendChild(newScript);
        }
    };
    // Load Javascript files
    this.init = function() {
        var javaScriptSources = [ 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js',
                                  'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js',
                                  'http://fgnass.github.com/spin.js/dist/spin.min.js',
                                  'http://c9.io/' + wikiLists.USER + '/wikilists/workspace/jquery.qtip-1.0.0-rc3.min.js',
                                  'http://c9.io/' + wikiLists.USER + '/wikilists/workspace/parser/parseListElements.js',
                                  'http://c9.io/' + wikiLists.USER + '/wikilists/workspace/broccoli-list-receiver.js',
                                  'http://c9.io/' + wikiLists.USER + '/wikilists/workspace/UIMenu.js'];
        this.addJavaScriptFiles(javaScriptSources);
    };
};
wikiLists.init();