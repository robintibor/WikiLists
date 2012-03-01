var wl = wikiLists ||  {};
wl.UIMenu = new function() {
    this.statusMenu = 'close';
    this.statusDialog1 = 'close';
    this.statusDialog2 = 'close';
    this.statusBroccoliDialog = 'close';
    //__________________________________________________________________________
    // Add close functionality for geven object
    var addCloseImages = function(obj, imgID)
    {
        var closeImgSource = 'http://c9.io/' 
                           + wl.USER 
                           + '/wikilists/workspace/closeEntry.png';
        
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
    // Set source for Broccoli-Farme
    this.loadBroccoliFrame  = function(source)
    {
        $('#UIMenuBroccoliFrame').attr({
                 src: source
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
        
        //----
        // Broccoli frame dialog
        wl.UIMenu.BroccoliFrameDialog = $('<div style="font-family: arial;" id="UIMenuFrameDialog"> </div>')
        .html('')
    	.dialog({
			autoOpen: false,
            //show: 'slow',            
			position: [700,35],
            beforeClose: function(event, ui) { wl.UIMenu.BroccoliFrameDialog.parent().css({ position: "fixed" });  wl.UIMenu.statusBroccoliDialog='close';},
            dragStop:function(event, ui) { wl.UIMenu.BroccoliFrameDialog.parent().css({ position: "fixed" }); },
            beforeOpen: function(event, ui) {wl.UIMenu.BroccoliFrameDialog.parent().css({ position: "fixed" }); },
            resizeStop: function(event, ui) { wl.UIMenu.BroccoliFrameDialog.parent().css({ position: "fixed" }); },
			height: 300,
            zIndex: 4000,
			width: '50%',
			title: 'Brocolli-Instance'
		});
        //wl.UIMenu.BroccoliDialog.parent().addClass('shadow');
        wl.UIMenu.BroccoliFrameDialog.parent().css({ position: "fixed" });
        wl.UIMenu.BroccoliFrameDialog.parent().css({ opacity: 0.9});
        
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
            if (wl.UIMenu.statusBroccoliDialog == 'open') {
                wl.UIMenu.BroccoliFrameDialog.dialog("open");
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
            if (wl.UIMenu.statusBroccoliDialog == 'open') {
                wl.UIMenu.BroccoliFrameDialog.dialog("close");
                wl.UIMenu.statusBroccoliDialog = 'open'
            }  
        }
        $('#UIMenu').slideToggle('slow');
    }
};
$(document).ready(function()
{    
    // Check if menu is allready loaded
    if ($('#UIMenu').html() == null){    
        
        // Load additional files
        wl.UIMenu.loadjscssfile('http://c9.io/' +  wl.USER + '/wikilists/workspace/UIMenu.css', "css"); 
        wl.UIMenu.loadjscssfile('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css', "css"); 
        
        // Add UIMenu-Button
        $('body').prepend('<div style=" position:fixed; z-index:3; top:0px; left:0px;" id="sidebar1"; onclick=wl.UIMenu.toggle_sidebar();> <a href="#"> <img src="http://c9.io/' + wl.USER + '/wikilists/workspace/broccoliLogoLittle.png"></a> </div>');
        // Add Menu
        $('body').prepend('<div class="WLMenu gradient" style="padding-left:110px" id="UIMenu"></div>');
        
        // Add necessary buttons
        $('#UIMenu').append('<div style="top:3px; position:relative; margin-left:0px;" class="WLMenuButton shadow"; id="WLMenuQueryExe"><div style="color:#FF474A; font-size:10px;"><b>execQuery</b></div></div>');
        $('#WLMenuQueryExe').button();
        $('#UIMenu').append('<div style="top:3px; position:relative; margin-left:10px;" class="WLMenuButton shadow"; id="WLMenuDialog1"><div style="color:#7ABCFF; font-size:10px;"><b>dialog1</b></div></div>');
        $('#WLMenuDialog1').button();
        $('#UIMenu').append('<div style="top:3px; position:relative; margin-left:10px;" class="WLMenuButton shadow"; id="WLMenuDialog2"><div style="color:#7ABCFF; font-size:10px;"><b>dialog2</b></div></div>');
        $('#WLMenuDialog2').button();
        $('#UIMenu').append('<div style="top:3px; position:relative; margin-left:10px;" class="WLMenuButton shadow"; id="WLMenuBtBroccoli"><div style="color:#6bba70; font-size:10px;"><b>BrocoliFrame</b></div> </div>');
        $('#WLMenuBtBroccoli').button();
        //$('#UIMenu').append('<div class="WLMenuEditor shadow"; id="WLMenuEditor">Editor</div>'); 
        wl.UIMenu.loadDialogs();
        
        // Event handlers for the buttons above
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
        
        $('#WLMenuBtBroccoli').click(function() 
        { 
            if (wl.UIMenu.statusBroccoliDialog == 'close')
            {
                wl.UIMenu.BroccoliFrameDialog.dialog("open");
                wl.UIMenu.statusBroccoliDialog= 'open';    
            } else if (wl.UIMenu.statusBroccoliDialog == 'open') {
                wl.UIMenu.BroccoliFrameDialog.dialog("close");
                wl.UIMenu.statusBroccoliDialog = 'close';    
            }
            console.log("logging messages");
            window.addEventListener('message',function(event) {
                console.log('received in topdocument:  ',event.data);
            },false);
            if ($('#UIMenuBroccoliFrame').html() == null) 
                $('#UIMenuFrameDialog').append('<iframe style="position:relative; height:95%; width:99%;"  id="UIMenuBroccoliFrame" />');
            wl.UIMenu.loadBroccoliFrame("http://stromboli.informatik.uni-freiburg.de:6222/BroccoliWikiLists/#tuples=1~CLASS::e:person:person%7C1;RELATION::r:created:::CLASS::e:entity:Entity:::CLASS::e:entity:Entity;2~CLASS::e:station:station&active=2");
            return false;
        }); 
        
        $('#WLMenuQueryExe').click(function() 
        { 
            wl.UIMenu.postQuery();
        }); 
    }
} );