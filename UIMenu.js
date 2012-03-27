var wl = wikiLists ||  {};
wl.UIMenu = new function() {
    this.statusMenu = 'close';
    this.spinner;
    this.statusDialog1 = 'close';
    this.statusStatistic = 'close';
    this.statusBroccoliDialog = 'close';
    this.wikiListsElements;
    this.BroccoliMatchedListsElement;
    this.BroccoliNewListsElement;
    this.broccoliQuery = 'http://stromboli.informatik.uni-freiburg.de:6222/BroccoliWikiLists/'
    this.loadedElements = new Object();
    
    //__________________________________________________________________________
    // Add close functionality for geven object
    var addCloseImages = function(obj, imgID)
    {
        var linkElement = $(obj).find("a").first();
        //$(obj).mouseover(function(){
        //});
         $(obj).bind( "mouseenter",  function(){
            document.getElementById(imgID).style.visibility = "visible";
            $(obj).unbind("mouseenter");
            $(obj).bind("mouseenter", function(){
               // $('.qtip').qtip("hide");
                //$(linkElement).qtip("show");
                document.getElementById(imgID).style.visibility = "visible";
            });
           $(linkElement).mouseover(function(){
                $('.qtip').qtip("hide");
                //$(linkElement).qtip("show");
                document.getElementById(imgID).style.visibility = "visible";
            });
            wl.broccoliClient.getHitGroupForElement(obj, function(hitXML){
                //addToolTip(obj, hitXML);
                var htmlStr = '<div style="color:#D15E5E; font-size:12px;">';
                $(hitXML).find('hit').each(function(){
                    var title = $(this).find('title').first().text().replace(/_/g," ");
                    var text = $(this).find('excerpt').first().text().replace(/<hl>/g, '<b style="color:black">').replace(/<\/hl>/g, "</b>")
                                                                     .replace(/\$hlct\$/g, '<l style="color:#5B4646">').replace(/\$\/hlct\$/g, "</l>");
                    htmlStr+='<b style="font-size:13px; color:D15E5E;">'+title+'</b></br>';
                    htmlStr+='<div>'+text+'</div></br>';
                });
                htmlStr+="</div>";
                //alert(htmlStr);
                addToolTip(linkElement, htmlStr);
                $('.qtip').qtip("hide");
                $(linkElement).qtip("show");
            });
        });
        $(obj).mouseout(function(){
            document.getElementById(imgID).style.visibility = "hidden";
        });
        var closeImgSource = wl.FRONTENDADRESS + 'delete1.png';
        
        $(obj).prepend('<l style="visibility: hidden; " id="' + imgID +'"><img'
                        + ' src="' + closeImgSource 
                        + '" /> </l>');
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
                $(linkElement).qtip("destroy");
                //obj.style.background = "#FFFFFF";
                //$(obj).off();
                $(obj).remove();
                document.getElementById('nofMissingEllements').innerHTML = $(".newBroccoliElements").length;
        });
        
    }
    //__________________________________________________________________________
    // Add str string to obj object as tooltip
    // str cann be formated HTML
    var addToolTip = function(obj, str)
    {
         $(obj).qtip({
            content: {
                text: str,
                title: {
                    text: "Information"
                    }
            },
            position: {
                at: "top left",
                my: "bottom left"
            },
            style: {
                    tip: "bottomLeft",
                    classes: "ui-tooltip-red"
            },
            show: {
                event: "mouseover"
            },
            hide: {
                event: "mouseout"
            }
        }
    );
};
    //__________________________________________________________________________
    // load Broccoli result lists
    this.loadBroccoliLists  = function(matchedElements, newElements)
    {
        document.getElementById('nofMissingEllements').innerHTML = newElements.length;
        document.getElementById('nofMatchingEllements').innerHTML = matchedElements.length;
        wl.UIMenu.BroccoliMatchedListsElement = matchedElements;
        wl.UIMenu.BroccoliNewListsElement = newElements; 
        var htmlStr="<ul>";
        var newElementClasses = 'class="newBroccoliElements"';
        var newElementStyle = 'style="font-size:14px; width:90%"';
        for (var i=0; i < newElements.length; i++){
            htmlStr+='<li id="broccoliNewElement'+i+'" '+newElementClasses+' '+newElementStyle+'>';
            //htmlStr+=elem.innerHTML;
            htmlStr+="</li>";
        }
        htmlStr+="</ul>";
        $('#UIMenuWikiDialog').html("");
        $('#UIMenuWikiDialog').append(htmlStr);
        for (var i=0; i < newElements.length; i++){
            var id= '#broccoliNewElement'+i;
            $(id).append(newElements[i]);
        }
        // add loading-tolltips and close functionality
        $(".newBroccoliElements").each(function(k){
            //addToolTip(this, '<div style="width:300px;" id="toolTip' + k +'"><img style="margin-left:100px; margin-bottom:20px; margin-top:20px; opacity:0.1" src="'+ wl.FRONTENDADRESS +'/loading3.gif"></img></div>');
            var imgID = 'EntryCloseImg_' + k;
            addCloseImages(this, imgID);
            k++;
        });
        // add close functionality
        //for (var i=0; i < newElements.length; i++){
        //    var imgID = 'EntryCloseImg_' + i;
        //    addCloseImages(newElements[i], imgID);
        //}
    }
    //__________________________________________________________________________
    // Initialize Spiner
    this.closeSpinner  = function()
    {
        $('#UIMenuLoader').remove();
    }
    
    //__________________________________________________________________________
    // Initialize Spiner
    this.loadSpinner  = function()
    {
        var opts = {
            lines: 14, // The number of lines to draw
            length: 19, // The length of each line
            width: 6, // The line thickness
            radius: 190, // The radius of the inner circle
            color: '#000', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: true, // Whether to render a shadow
            hwaccel: true, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 10001, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        };
        $('body').prepend('<div style="background-color:#3D3D3D; opacity:0.55; position:fixed; z-index:10000; width:100%; height:100%; top:0px; left:0px;" id="UIMenuLoader"></div>');
        var target = document.getElementById('UIMenuLoader');
        wl.UIMenu.spinner = new Spinner(opts).spin(target);
    }
    //__________________________________________________________________________
    // Set source for Broccoli-Farme
    this.refreshUI  = function(listElements, broccoliQueryStr)
    {
        wl.UIMenu.wikiListsElements = listElements;
        wl.UIMenu.loadWikiDialog();
        wl.UIMenu.broccoliQuery = broccoliQueryStr;
        wl.UIMenu.loadBroccoliFrame();
        wl.UIMenu.closeSpinner();
        wl.UIMenu.loadStatisticDialog();
    }
    //__________________________________________________________________________
    // Set source for Broccoli-Farme
    this.loadBroccoliFrame  = function()
    {
        $('#UIMenuBroccoliFrame').attr({
                 src: wl.UIMenu.broccoliQuery
        });
    }
    //__________________________________________________________________________
    this.loadStatisticDialog = function()
    {
        var htmlStr='<div style="font-size:14px; padding:2px; border-radius:2px; border-width: 1px; border-style:solid; border-color: #666666; background-color:#EBED8E; width:100%">';
        htmlStr+='<div style="width=100%;border-radius:2px; text-align: center; font-sytle:solid; font-size:18px; border-width: 1px; border-style:solid; border-color: #666666; font-family:solid; background-color:#D3CC4C; margin-bottom:10px;"><b>Query Information</b></div>'
        // Add Query Statistic
        // Add classes statistic
        var listMap = new Object();
        var listElementsNumber=0;
        var foundedInOntology=0;
        // map all elements for avoiding of double entrys
        $(wl.UIMenu.wikiListsElements).each(function (i){
        if (listMap[this]==undefined) {
                listMap[this]=$.data(this,"classes");
                if (listMap[this]!='')
                    foundedInOntology++;
                listElementsNumber++;
            }
        });
        htmlStr+='<table style="width:100%">'
        htmlStr+='<tr>'
                   +'<td><b>Number of elements found on wiki-site: </b></td> '
                   +'<td style="text-align: center;">'+ listElementsNumber +'</td> '
                + '</tr>';
        htmlStr+='<tr>'
                   +'<td><b>Number of elements <i>also</i> found in ontology: </b></td> '
                   +'<td style="text-align: center;">'+ foundedInOntology +'</td> '
                + '</tr>';             
        htmlStr+='<tr>'
                   +'<td><b>Number of additional elements from Broccoli: </b></td> '
                   +'<td  id="nofMissingEllements" style="text-align: center;"></td> '
                + '</tr>';
        htmlStr+='<tr>'
                   +'<td><b>Number of matching elements: </b></td> '
                   +'<td  id="nofMatchingEllements" style="text-align: center;"></td> '
                + '</tr>';        
        htmlStr+='</table></div></br>';
        var classToFreqMap =new Object();
        for (var elem in listMap){
            var listItemClasses = listMap[elem];
            for (var listItemId in listItemClasses){
                if (classToFreqMap[listItemClasses[listItemId]] == undefined){
                    classToFreqMap[listItemClasses[listItemId]] = 1;
                }
                else
                    classToFreqMap[listItemClasses[listItemId]]+=1;
            }
        }
        var keys = [];
        // check function for testing, if elem occurs in list; if yes then return false
        var check = function(list, elem){for (var i=0; i<list.length; i++) if (list[i]==elem) return false; return true;}
            
        for (var clStr in classToFreqMap){
            if (clStr.length>0 && (keys.length ==0 || check(keys, Number(classToFreqMap[clStr]))))
            {
                keys.push(Number(classToFreqMap[clStr]));
            }
        }
        var numOrd  = function(a, b){ return (a-b); }
        keys.sort(numOrd);
        var divClass = 'class=""; ';
        var divStyle = 'style="border-radius:2px; font-size:18px; border-width: 1px; border-style:solid; border-color: #666666; font-family:solid; background-color:#CC6666; margin-bottom:10px;"';
        htmlStr += '<table style="font-size:14px; border-radius:2px; border-width: 1px; border-style:solid; border-color: #666666; background-color:#F77F6A; width:100%">';
        htmlStr += '<thead><th '+divStyle+'>Class</th><th '+divStyle+'>Frequency</th><th '+divStyle+'>Score</th></thead>';
        for (var i=keys.length-1; i >=0; i--){
            for (var item in classToFreqMap){
                if (keys[i] == classToFreqMap[item]){
                    var scoreStr = item.substring(item.indexOf('['), item.indexOf(']')+1);
                    var classStr = item.substring(0, item.indexOf('['));
                    htmlStr+= '<tr>' 
                        +'<td>' + classStr +'</td> '
                        +'<td style="text-align: center;">'+ keys[i] +'</td> '
                        +'<td style="text-align: center;">'+ scoreStr +'</td> '
                    + '</tr>';
                }
            }
        }
        htmlStr += '</table>';
        $('#UIMenuStatisticDialog').append(htmlStr);
    }
    //__________________________________________________________________________
    this.loadWikiDialog = function()
    {
        var htmlStr = '';
        var divClass = 'class=""; ';
        var divStyle = 'style="border-radius:4px;font-size:18px; font-family:solid; background-color:#9C9C9C; margin-bottom:10px;"';
        $(wl.UIMenu.wikiListsElements).each(function (i){
            i++;
            var divID = 'id="wikiDialogEntry_' + i + '" ';
            htmlStr+= '<div ' + divID + divClass + divStyle + ' >' + $(this).html() + '</div>';
            // add Tooltip to the keyElements at source (Wiki) Site
            //var imgID = 'EntryCloseImg_' + i;
            var toolTipStr = '<b style="color:black;">Classes:</b>'+$.data(this,"classes") + "<br/><br/>"
                           + '<b style="color:black;">Score:</b>'+$.data(this,"score");
            //alert($.data(this,"classes"));
            addToolTip(this, '<div style="color:#5B4646" >'+toolTipStr+'</div>');
            //alert("str" + $(this).mouseover);
            
            //HACK FOR SELECTING ELEMENTS BEGIN 
            this.style.background = "#A0F78A";
            $(this).addClass("roundCorners");
            //var oldMouseOverEvent=$(this).mouseover;
            //var oldMouseOutEvent=$(this).mouseout;        
            //$(this).mouseover(function(){
            //    oldMouseOverEvent;
            //    document.getElementById(imgID).style.visibility = "visible";
            //});
            //$(this).mouseout(function(){
            //    oldMouseOutEvent;
            //    document.getElementById(imgID).style.visibility = "hidden";
            //});
            //HACK FOR SELECTING ELEMENTS END
            //addCloseImages(this, imgID);
        });
    }
    //__________________________________________________________________________
    this.postQuery = function()
    {
        wl.UIMenu.loadSpinner();
        wl.facade.computeListElementsAndQueryStringAndStoreList(
            wl.UIMenu.refreshUI);
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
			title: 'Additional elements'
		});
        //wl.UIMenu.WikiDialog.parent().addClass('shadow');
        wl.UIMenu.WikiDialog.parent().css({ position: "fixed" });
        wl.UIMenu.WikiDialog.parent().css({ opacity: 0.9});
        wl.UIMenu.StatisticDialog = $('<div style="font-family: arial;" id="UIMenuStatisticDialog"> </div>')
        .html('')
		.dialog({
			autoOpen: false,
            //show: 'slow',            
			position: ['right','bottom'],
            beforeClose: function(event, ui) {wl.UIMenu.statusStatistic='close';},
            resize: function(event, ui) { wl.UIMenu.StatisticDialog.parent().css({ position: "fixed" }); },
			height: 300,
            zIndex: 4000,
			width: 400,
			title: 'Statistics'
		});
        //wl.UIMenu.BroccoliDialog.parent().addClass('shadow');
        wl.UIMenu.StatisticDialog.parent().css({ position: "fixed" });
        wl.UIMenu.StatisticDialog.parent().css({ opacity: 0.9});
        
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
			title: 'Broccoli-Instance'
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
            if (wl.UIMenu.statusStatistic == 'open') {
                wl.UIMenu.StatisticDialog.dialog("open");
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
            if (wl.UIMenu.statusStatistic == 'open') {
                wl.UIMenu.StatisticDialog.dialog("close");
                wl.UIMenu.statusStatistic = 'open'
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
        wl.UIMenu.loadjscssfile(wl.FRONTENDADRESS + 'UIMenu.css', "css"); 
        wl.UIMenu.loadjscssfile('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.8/themes/flick/jquery-ui.css', "css"); 
        wl.UIMenu.loadjscssfile(wl.FRONTENDADRESS + 'libs/jquery.qtip.min.css', "css"); 
        
        // Add UIMenu-Button
        $('body').prepend('<div style=" position:fixed; z-index:3; top:0px; left:0px;" id="sidebar1"; onclick=wl.UIMenu.toggle_sidebar();> <a href="#"> <img src="' + wl.FRONTENDADRESS + 'broccoliLogoLittle.png"></a> </div>');
        // Add Menu
        $('body').prepend('<div class="WLMenu gradient" style="padding-left:110px" id="UIMenu"></div>');
        
        // Add necessary buttons
        $('#UIMenu').append('<div style="top:0px; position:relative; margin-left:0px;" class="WLMenuButton shadow"; id="WLMenuQueryExe"><div style="color:#FF474A; font-size:10px;"><b>START</b></div></div>');
        $('#WLMenuQueryExe').button();
        $('#UIMenu').append('<div style="top:0px; position:relative; margin-left:10px;" class="WLMenuButton shadow"; id="WLMenuBtStatistic"><div style="color:#2c539e; font-size:10px;"><b>Statistics</b></div> </div>');
        $('#WLMenuBtStatistic').button();
        $('#UIMenu').append('<div style="top:0px; position:relative; margin-left:10px;" class="WLMenuButton shadow"; id="WLMenuDialog1"><div style="color:#2c539e; font-size:10px;"><b>List of additional elements</b></div></div>');
        $('#WLMenuDialog1').button();
        $('#UIMenu').append('<div style="top:0px; position:relative; margin-left:10px;" class="WLMenuButton shadow"; id="WLMenuBtBroccoli"><div style="color:#6bba70; font-size:10px;"><b>Broccoli</b></div> </div>');
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
        $('#WLMenuBtStatistic').click(function() 
        { 
            if (wl.UIMenu.statusStatistic == 'close')
            {
                wl.UIMenu.StatisticDialog.dialog("open");
                wl.UIMenu.statusStatistic= 'open';    
            } else if (wl.UIMenu.statusStatistic == 'open') {
                wl.UIMenu.StatisticDialog.dialog("close");
                wl.UIMenu.statusStatistic = 'close';    
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
            
            if ($('#UIMenuBroccoliFrame').html() == null) 
                $('#UIMenuFrameDialog').append('<iframe style="position:relative; height:95%; width:99%;"  id="UIMenuBroccoliFrame" />');
            wl.UIMenu.loadBroccoliFrame();
            return false;
        }); 
        
        $('#WLMenuQueryExe').click(function() 
        { 
            wl.UIMenu.postQuery();
        }); 
    }
});