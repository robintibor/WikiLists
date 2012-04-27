var wikiLists = new function() {
    this.FRONTENDADRESS = 'http://stromboli.informatik.uni-freiburg.de/schirrmr/wikilists/frontend/';
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

    function addJavaScriptFilesAfterExists(fileURLs, objectThatHasToExist) {
      if (typeof eval(objectThatHasToExist) != 'undefined')
           wikiLists.addJavaScriptFiles(fileURLs);
      else
        setTimeout(addJavaScriptFilesAfterExists.bind(this, fileURLs, 
          objectThatHasToExist), 150);
    };

    function loadNewerJQueryAndJQueryUI() {
      var jQuerySources = [ 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js',
                            'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js']
      wikiLists.addJavaScriptFiles(jQuerySources);
    };

    function loadJQueryPlugins() {
      var jQueryPlugins = ['http://fgnass.github.com/spin.js/dist/spin.min.js',
                            wikiLists.FRONTENDADRESS + 'libs/jquery.qtip.min.js'];
        // wait for new jquery versions to load
        addJavaScriptFilesAfterExists(jQueryPlugins, 'jQuery && jQuery.ui');
    };

    function loadOurScripts() {
        var ourScripts = [wikiLists.FRONTENDADRESS + 'logic/parser/parse-list-elements.js',
                          wikiLists.FRONTENDADRESS + 'logic/facade.js',
                          wikiLists.FRONTENDADRESS + 'logic/lists.js',
                          wikiLists.FRONTENDADRESS + 'logic/client.js',
                          wikiLists.FRONTENDADRESS + 'UIMenu.js'];
        addJavaScriptFilesAfterExists(ourScripts, 'jQuery && jQuery().qtip');
    };

    function unloadJQuery() {
      jQuery = undefined;
    };    

    // Load Javascript files
    this.init = function() {
        unloadJQuery();
        loadNewerJQueryAndJQueryUI();
        loadJQueryPlugins();
        loadOurScripts();
    };
};


function scriptAlreadyLoaded() {
// wl is defined in the scripts that are loaded...
   return typeof wl != 'undefined';
}




if (!scriptAlreadyLoaded())
    wikiLists.init();