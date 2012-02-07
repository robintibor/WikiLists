// Load Javascript files

var wikiLists = new function() {
    this.USER = 'robintibor';
    var addJavaScriptFiles = function(fileURLS) {
        for (var i = 0; i < fileURLS.length; i++) {
            var javaScriptSource = fileURLS[i];
            var headID = document.getElementsByTagName("head")[0];         
            var newScript = document.createElement('script');
            newScript.type = 'text/javascript';
            newScript.src = javaScriptSource;
            headID.appendChild(newScript);
        }
    };
    this.init = function() {
        var javaScriptSources = [ 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js',
                                  'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js',
                                  'http://c9.io/' + wikiLists.USER + '/wikilists/workspace/UIMenu.js',
                                  'http://c9.io/' + wikiLists.USER + '/wikilists/workspace/parseListElements.js'];
        addJavaScriptFiles(javaScriptSources);
    };
};
wikiLists.init();
// Start Main Parsing Routine