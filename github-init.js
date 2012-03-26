var wikiLists = new function() {
    this.FRONTENDADRESS = 'https://raw.github.com/robintibor/WikiLists/master/';
    this.STROMBOLIPORT = 29385;
    this.addJavaScriptFiles = function(fileURLS) {
        for (var i = 0; i < fileURLS.length; i++) {
            var javaScriptSource = fileURLS[i];
            var body = document.getElementsByTagName("body")[0];         
            var newScript = document.createElement('script');
            newScript.type = 'text/javascript';
            newScript.src = javaScriptSource;
            body.appendChild(newScript);
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

function scriptAlreadyLoaded() {
    // wl is defined in the scripts that are loaded...
   return typeof wl != 'undefined'; 
}

if (!scriptAlreadyLoaded())
    wikiLists.init();