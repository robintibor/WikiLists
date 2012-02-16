var wl = wikiLists ||  {};
wl.UIMenu = new function() {
    this.statusMenu = 'close';
    this.statusDialog1 = 'close';
    this.statusDialog2 = 'close';
    //__________________________________________________________________________
    var addCloseImages = function(obj, imgID)
    {
        var closeImgSource = 'http://c9.io/' + wl.USER + '/wikilists/workspace/closeEntry.png';
        
        $(obj).after('<img id="' + imgID 
                        + '" src="' + closeImgSource 
                        + '" style="visibility:hidden"/>');
        var imjObj = document.getElementById(imgID);
        $(imjObj).mouseover(function(){
                document.getElementById(imgID).style.visibility = "visible";
        });
        $(imjObj).mouseout(function(){
                document.getElementById(imgID).style.visibility = "hidden";
        });
        // Hack 
        $(imjObj).click(function(){
                $(imjObj).remove();
                obj.style.background = "#FFFFFF";
                $(obj).off();
        });
        
    }
    //__________________________________________________________________________
    // Add str string to obj object as tooltip
    // str cann be formated HTML
    var addToolTip = function(obj, str)
    {
         $(obj).qtip({
            content: str,
            position: {
                corner: {
                    target: 'topMiddle',
                    tooltip: 'bottomMiddle'
                }
            },
            style: { 
                name: 'red',
                tip: 'bottomMiddle' // Notice the corner value is identical to the previously mentioned positioning corners
            },
            show: 'mouseover',
            hide: 'mouseout'
        });
    }
    //__________________________________________________________________________
    this.loadWikiDialog = function()
    {
        var htmlStr = '';
        var divClass = 'class="shadow wikiDialogEntrys"; ';
        var divStyle = 'style="border-radius:4px;font-size:18px; font-family:solid; background-color:#9C9C9C; margin-bottom:10px;"';
        $(wl.parser.parseListElements($(document))).each(function (i){
            i++;
            var divID = 'id="wikiDialogEntry_' + i + '" ';
            htmlStr+= '<div ' + divID + divClass + divStyle + ' >' + $(this).html() + '</div>';
            // add Tooltip to the keyElements at source (Wiki) Site
            var imgID = 'EntryCloseImg_' + i;
            addToolTip(this, '<div style="color:#0000FF" >'+$(this).html())+'</div>';
            //alert("str" + $(this).mouseover);
            
            //HACK FOR SELECTING ELEMENTS BEGIN 
            this.style.background = "#00FF7F";
            var oldMouseOverEvent=$(this).mouseover;
            var oldMouseOutEvent=$(this).mouseout;        
            $(this).mouseover(function(){
                oldMouseOverEvent;
                document.getElementById(imgID).style.visibility = "visible";
            });
            $(this).mouseout(function(){
                oldMouseOutEvent;
                document.getElementById(imgID).style.visibility = "hidden";
            });
            //HACK FOR SELECTING ELEMENTS END
            addCloseImages(this, imgID);
        });
        $('#UIMenuWikiDialog').append(htmlStr);
        $(".wikiDialogEntrys").each(function(){
            addToolTip(this, '<div>'+$(this).html())+'</div>';
        });
    }
    //__________________________________________________________________________
    this.postQuery = function()
    {
        wl.UIMenu.loadWikiDialog();
    }
    //__________________________________________________________________________
    this.loadDialogs = function(){ 
        wl.UIMenu.WikiDialog = $('<div style="font-family: arial;" id="UIMenuWikiDialog"> </div>')
        .html('')
		.dialog({
			autoOpen: false,
            //show: 'slow',
			position: ['left','bottom'],
            beforeClose: function(event, ui) {wl.UIMenu.statusDialog1='close';},
            resize: function(event, ui) { wl.UIMenu.WikiDialog.parent().css({ position: "fixed" }); },
			height: 300,
			width: 400,
            zIndex: 3999,
			title: 'Wiki-Einträge'
		});
        //wl.UIMenu.WikiDialog.parent().addClass('shadow');
        wl.UIMenu.WikiDialog.parent().css({ position: "fixed" });
        wl.UIMenu.WikiDialog.parent().css({ opacity: 0.9});
        wl.UIMenu.BroccoliDialog = $('<div style="font-family: arial;"> </div>')
        .html('')
		.dialog({
			autoOpen: false,
            //show: 'slow',            
			position: ['right','bottom'],
            beforeClose: function(event, ui) {wl.UIMenu.statusDialog2='close';},
            resize: function(event, ui) { wl.UIMenu.BroccoliDialog.parent().css({ position: "fixed" }); },
			height: 300,
            zIndex: 4000,
			width: 400,
			title: 'Brocolli-Einträge'
		});
        //wl.UIMenu.BroccoliDialog.parent().addClass('shadow');
        wl.UIMenu.BroccoliDialog.parent().css({ position: "fixed" });
        wl.UIMenu.BroccoliDialog.parent().css({ opacity: 0.9});
    }
    //__________________________________________________________________________
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
    //__________________________________________________________________________
    this.toggle_sidebar = function()
    {
        if (wl.UIMenu.statusMenu =='close') 
        {
            wl.UIMenu.statusMenu ='open';
            if (wl.UIMenu.statusDialog1 == 'open') {
                wl.UIMenu.WikiDialog.dialog("open");
            }
            if (wl.UIMenu.statusDialog2 == 'open') {
                wl.UIMenu.BroccoliDialog.dialog("open");
            }
            
        }
        else if (wl.UIMenu.statusMenu =='open') {
            wl.UIMenu.statusMenu ='close';
            if (wl.UIMenu.statusDialog1 == 'open') {
                wl.UIMenu.WikiDialog.dialog("close");
                wl.UIMenu.statusDialog1 = 'open';
            }
            if (wl.UIMenu.statusDialog2 == 'open') {
                wl.UIMenu.BroccoliDialog.dialog("close");
                wl.UIMenu.statusDialog2 = 'open'
            }            
        }
        $('#UIMenu').toggle('slow');
    }
};
$(document).ready(function(){
    if ($('#UIMenu').html() == null){    
        wl.UIMenu.loadjscssfile('http://c9.io/' +  wl.USER + '/wikilists/workspace/UIMenu.css', "css"); 
        wl.UIMenu.loadjscssfile('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css', "css"); 
        $('body').prepend('<div style="border-radius:0px; z-index:3; left:161px;"class="WLMenuButton shadow"; onclick=wl.UIMenu.toggle_sidebar(); id="sidebar1"><img src="http://c9.io/' + wl.USER + '/wikilists/workspace/broccoliLogoLittle.png"></div>');
        $('body').prepend('<div class="WLMenu shadow" id="UIMenu"></div>');
        $('#UIMenu').append('<div style="position:absolute; top:40%; left:10px;" class="WLMenuButton shadow"; id="WLMenuQueryExe"> execQuery</div>');
        $('#UIMenu').append('<div style="position:absolute; top:60%; left:10px;" class="WLMenuButton shadow"; id="WLMenuDialog1"> dialog1</div>');
        $('#UIMenu').append('<div style="position:absolute; top:80%; left:10px;" class="WLMenuButton shadow"; id="WLMenuDialog2"> dialog2</div>');
        $('#UIMenu').append('<div class="WLMenuEditor shadow"; id="WLMenuEditor">Editor</div>'); 
        wl.UIMenu.loadDialogs();
        $('#WLMenuDialog1').click(function() 
        { 
            if (wl.UIMenu.statusDialog1 == 'close')
            {
                wl.UIMenu.WikiDialog.dialog("open");
                wl.UIMenu.statusDialog1 = 'open';    
            } else if (wl.UIMenu.statusDialog1 == 'open') {
                wl.UIMenu.WikiDialog.dialog("close");
                wl.UIMenu.statusDialog1 = 'close';    
            }
            
            return false;
        }); 
        $('#WLMenuDialog2').click(function() 
        { 
            if (wl.UIMenu.statusDialog2 == 'close')
            {
                wl.UIMenu.BroccoliDialog.dialog("open");
                wl.UIMenu.statusDialog2= 'open';    
            } else if (wl.UIMenu.statusDialog2 == 'open') {
                wl.UIMenu.BroccoliDialog.dialog("close");
                wl.UIMenu.statusDialog2 = 'close';    
            }
            return false;
        }); 
        
        $('#WLMenuQueryExe').click(function() 
        { 
            wl.UIMenu.postQuery();
        }); 
    }
} );