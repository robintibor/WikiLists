// Load Javascript files
alert('test1');
function addJavaScriptFiles(fileURLS) {
    for (var i = 0; i < fileURLS.length; i++) {
        var javaScriptSource = fileURLS[i];
        var headID = document.getElementsByTagName("head")[0];         
        var newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        newScript.src = javaScriptSource;
        headID.appendChild(newScript);
    }    
}
var javaScriptSources = [ 'http://c9.io/robintibor/wikilists/workspace/alertTest.js' , 
                          'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js' ];
addJavaScriptFiles(javaScriptSources);
// Start Main Parsing Routine