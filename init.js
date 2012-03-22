var wikiLists = new function() {
    this.FRONTENDADRESS = 'http://c9.io/robintibor/wikilists/workspace/';
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
                                  wikiLists.FRONTENDADRESS + 'jquery.qtip-1.0.0-rc3.min.js',
                                  wikiLists.FRONTENDADRESS + 'logic/parser/parse-list-elements.js',
                                  wikiLists.FRONTENDADRESS + 'logic/facade.js',
                                  wikiLists.FRONTENDADRESS + 'logic/lists.js',
                                  wikiLists.FRONTENDADRESS + 'logic/client.js',
                                  wikiLists.FRONTENDADRESS + 'UIMenu.js'];
        this.addJavaScriptFiles(javaScriptSources);
    };
};
wikiLists.init();
