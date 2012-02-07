var wl = wikiLists ||  {};
wl.UIMenu = new function() {
    var loadjscssfile = function(filename, filetype){ 
        if (filetype=="js"){ //if filename is a external JavaScript file
            var fileref=document.createElement('script');
            fileref.setAttribute("type","text/javascript");
            fileref.setAttribute("src", filename);
        }   
        else if (filetype=="css"){ //if filename is an external CSS file
            var fileref=document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
        }
        if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)    
    }
 
    this.toggle_sidebar = function()
    {
        alert('testUIMENU3');
        loadjscssfile('http://c9.io/' +  wl.USER + '/wikilists/workspace/UIMenu.css', "css");    
        $('#sidebar').toggle('slide', { direction: 'left' }, 500);
        alert('testUIMENU4');
    }
};
alert('testUIMENU2');
$( function(){
    $('body').prependpend('<div id="sidebar">My sidebar</div>');
    wl.UIMenu.toggle_sidebar();
    setTimeout(wl.UIMenu.toggle_sidebar,3000);
} );