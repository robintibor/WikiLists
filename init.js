// Load Javascript files
alert('test1');
var wikiLists = new function() {
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
        var javaScriptSources = [ 'http://c9.io/robintibor/wikilists/workspace/alertTest.js' , 
                                  'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js' ];
        addJavaScriptFiles(javaScriptSources);
    };
};
wikiLists.init();

// Start Main Parsing Routine