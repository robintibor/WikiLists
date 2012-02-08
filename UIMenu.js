var wl = wikiLists ||  {};
wl.UIMenu = new function() {
    this.status='close';
    this.loadjscssfile = function(filename, filetype){ 
        if (filetype=="js"){ //if filename is a external JavaScript file
            var fileref=document.createElement('script');
            fileref.setAttribute("type","text/javascript");
            fileref.setAttribute("src", filename);
        }   
        else if (filetype=="css"){ //if filename is an external CSS file
            var fileref=document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", 'text/css');
            fileref.setAttribute("href", filename);
        }
        if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)    
    }
 
    this.toggle_sidebar = function()
    {
        //if (status == 'open' && wl.UIMenu.status =='close') 
        //{
            //wl.UIMenu.status ='open';
            $('#UIMenu').toggle('slow');
        //} else if (status == 'close' && wl.UIMenu.status =='open') 
        //{
        //    wl.UIMenu.status ='close';
        //    $('#UIMenu').toggle('slow');
        //}
    }
};
$(document).ready(function(){
    if ($('#UIMenu').html() == null){    
        wl.UIMenu.loadjscssfile('http://c9.io/' +  wl.USER + '/wikilists/workspace/UIMenu.css', "css");    
        $('body').prepend('<div style="border-radius:0px; z-index:3; left:20%;"class="WLMenuButton shadow"; onclick=wl.UIMenu.toggle_sidebar(); id="sidebar1">Broccoli</div>');
        $('body').prepend('<div class="WLMenu shadow" id="UIMenu"></div>');
        $('#UIMenu').append('<div style="position:absolute; top:60%; left:10px;" class="WLMenuButton shadow"; id="WLMenuDialog1">dialog1</div>');
        $('#UIMenu').append('<div style="position:absolute; top:80%; left:10px;" class="WLMenuButton shadow"; id="WLMenuDialog1">dialog2</div>');
        $('#UIMenu').append('<div class="WLMenuEditor shadow"; id="WLMenuEditor">Editor</div>'); 
    }
} );