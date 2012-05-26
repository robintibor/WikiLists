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
    this.broccoliQuery = 'http://stromboli.informatik.uni-freiburg.de:6222/BroccoliWikiLists/';
    this.loadedElements = new Object();

    //__________________________________________________________________________
    // take excerpt from broccoli and transform it into nicely readable html
    var createFormattedExcerpt = function(excerptXML) {
        var excerptText = excerptXML.find("text").text();
        var contextString = excerptXML.attr("context");
        var termList = convertTextToTermList(excerptText);
        var contextBoundaries = extractContextBoundariesFromContextString(contextString);
        var highlights = excerptXML.find("highlights").find("hl");
        return createFormattedText(termList, contextBoundaries, highlights);
    };
    
    //__________________________________________________________________________
    // public for testing
    this.createFormattedText = function(termList, contextBoundaries, highlights) {
        return createFormattedText(termList, contextBoundaries, highlights);
    };
    var createFormattedText = function(termList, contextBoundaries, highlights) {
        var formattedText = '';
        if (contextBoundaries[0].contextStart !== 0)
          formattedText += '<span class="unimportantExcerptText">';
        var currentContextIndex = 0;
        var currentContext = contextBoundaries[currentContextIndex];
        var currentHighlightIndex = 0;
        var currentHighlight = highlights[currentHighlightIndex];
        for (var i = 0; i < termList.length; i++) {
            
            if (i > 0 && currentContext.contextStart == i)
                formattedText += '</span>';
            else if (i == currentContext.contextEnd + 1) {
                formattedText += '<span class="unimportantExcerptText">';
                currentContextIndex++;
                if (currentContextIndex < contextBoundaries.length)
                    currentContext = contextBoundaries[currentContextIndex];
            }
            if (highlights.length > 0 && i == $(currentHighlight).attr("pos"))
                formattedText += "<b>";
            formattedText += termList[i];
            if (highlights.length > 0 && i == $(currentHighlight).attr("pos")) {
                formattedText += "</b>";
                currentHighlightIndex++;
                if (currentHighlightIndex < highlights.length)
                    currentHighlight = highlights[currentHighlightIndex];
            }
        }
        if (currentContext.contextEnd != termList.length - 1)
            formattedText += '</span>';
        return formattedText;
    };
    
    
    //__________________________________________________________________________
    // public for testing
    this.convertTextToTermList = function(excerptText) {
        return convertTextToTermList(excerptText);
    };
    // example: You@@ are@@ very very@@ smart@@. =>
    // ["You", " are", " very very", " smart", "."]
    var convertTextToTermList = function(excerptText) {
        return excerptText.split("@@");
    };
    
    
    //__________________________________________________________________________
    // public for testing
    this.extractContextBoundariesFromContextString = function(contextBoundariesString) {
        return extractContextBoundariesFromContextString(contextBoundariesString);
    };    
    var extractContextBoundariesFromContextString = function(contextBoundariesString) {
        var contextBoundaries = [];
        var contextBlocks = contextBoundariesString.split(",");
        for (var i = 0; i < contextBlocks.length; i++) {
            var contextBlock = contextBlocks[i];
            var contextBlockBoundaries = contextBlock.split("-");
            var decimalSystem = 10;
            var contextStart = parseInt(contextBlockBoundaries[0], decimalSystem);
            var contextEnd = parseInt(contextBlockBoundaries[1], decimalSystem);
            contextBoundaries.push(
                {
                    "contextStart": contextStart,
                    "contextEnd": contextEnd
                }
            );
        }
        return contextBoundaries;
    };
    
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
                //$('.qtip').qtip("hide");
                $(linkElement).qtip("show");
                document.getElementById(imgID).style.visibility = "visible";
            });
            wl.broccoliClient.getHitGroupForElement(linkElement, function(hitXML){
                //addToolTip(obj, hitXML);
                var htmlStr = '<div style="font-size:12px;">';
                $(hitXML).find('hit').each(function(){
                    var title = $(this).find('title').first().text().replace(/_/g," ");
                    var text = createFormattedExcerpt($(this).find('excerpt').first()); // there is only one anyways, jsut for better function call :)
                    // TOREMOVE(robin): .find('text').text().replace(/<hl>/g, '<b style="color:black">').replace(/<\/hl>/g, "</b>")
                    //                                                 .replace(/\$hlct\$/g, '<l style="color:#5B4646">').replace(/\$\/hlct\$/g, "</l>");
                    htmlStr+='<b style="font-size:13px; color:D15E5E;">'+title+'</b></br>';
                    htmlStr+='<div>'+text+'</div></br>';
                });
                htmlStr+="</div>";
                //alert($(obj).text()+"||||||||||||"+htmlStr);
                
                addSecondToolTip(obj, htmlStr);
                //$('.qtip').qtip("hide");
                $(obj).qtip("show");
            });
        });
        $(obj).mouseout(function(){
            $('.qtip').qtip("hide");
            document.getElementById(imgID).style.visibility = "hidden";
        });
        var closeImgSource = wl.FRONTENDADRESS + 'delete1.png';
        
        $(obj).prepend('<span style="visibility: hidden; " id="' + imgID +'"><img'
                        + ' src="' + closeImgSource 
                        + '" /> </span>');
        var imjObj = document.getElementById(imgID);
        $(imjObj).mouseover(function(){
            $(obj).qtip("show");
            document.getElementById(imgID).style.visibility = "visible";
        });
        $(imjObj).mouseout(function(){
            document.getElementById(imgID).style.visibility = "hidden";
        });
        // Hack 
        $(imjObj).click(function(){
                $(imjObj).remove();
                $(obj).qtip("destroy");
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
                at: "bottom left",
                my: "top left"
            },
            style: {
                    tip: "bottomLeft",
                    classes: "ui-tooltip-plain ui-tooltip-shadow"
            },
            show: {
                event: "mouseover",
                effect: function(offset) {
    		        $(this).fadeIn("slow"); // "this" refers to the tooltip
		        }
            },
            hide: {
                event: "mouseout"
            }
        }
        );
    };
    //__________________________________________________________________________
    // Add str string to obj object as tooltip
    // str cann be formated HTML
    var addSecondToolTip = function(obj, str)
    {
         $(obj).qtip({
            content: {
                text: str,
                title: {
                    text: "Hit by Broccoli"
                    }
            },
            position: {
                at: "top left",
                my: "bottom left"
            },
            style: {
                    tip: "bottomLeft",
                    classes: "ui-tooltip-blue ui-tooltip-shadow"
            },
            show: {
                event: "mouseover",
                effect: function(offset) {
        	        $(this).fadeIn("slow"); // "this" refers to the tooltip
		        }
            },
            hide: {
                event: "mouseout"
            }
        }
        );
    };
    //__________________________________________________________________________
    var markFoundedElementsOnWikiSite  = function(matchedElements)
    {
        var wikiElements = wl.UIMenu.wikiListsElements;
        $(wikiElements).each(function(j){
            var flag = false;
            for (var i=0; i < matchedElements.length; i++){
                if ($(this).attr("href") == $(matchedElements[i]).attr("href")){
                    flag=true;
                }
                //console.log($(this).attr("href")+" "+ $(matchedElements[i]).attr("href"));
            }
            if (flag){
                //$(this).addClass("matchedElement");
                this.style.background="#A0F78A";
                var obj = $(this).parent();
                //if (document.getElementById("listItems"+j)==null)
                //$(obj).html('<sp>'+$(obj).html()+'</sp>');
                //var obj = document.getElementById("listItems"+j);
                wl.broccoliClient.getHitGroupForElement(this, function(hitXML){
                    //addToolTip(obj, hitXML);
                    var htmlStr = '<div style="font-size:12px;">';
                    $(hitXML).find('hit').each(function(){
                        var title = $(this).find('title').first().text().replace(/_/g," ");
                        var text = $(this).find('excerpt').first().text().replace(/<hl>/g, '<b style="color:black">').replace(/<\/hl>/g, "</b>")
                                                                     .replace(/\$hlct\$/g, '<l style="color:#5B4646">').replace(/\$\/hlct\$/g, "</l>");
                        htmlStr+='<b style="font-size:13px; color:D15E5E;">'+title+'</b></br>';
                        htmlStr+='<div>'+text+'</div></br>';
                    });
                    htmlStr+="</div>";
                    //alert($(obj).text()+"||||||||||||"+htmlStr);
                
                    addSecondToolTip(obj, htmlStr);
                    //$('.qtip').qtip("hide");
                   // $(obj).qtip("show");
                });
                
            } else{
                var obj = $(this).parent();
                if ($(obj) != undefined)
                {
                    $(obj).qtip("destroy");            
                }
                this.style.background="#EFA8A2";
            }
        });
    }
    //__________________________________________________________________________
    // public tooltip funktion
    this.createToolTip  = function(obj, str)
    {
        addToolTip(obj, str);
    }
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
        var newElementStyle = 'style="font-size:14px; width:90%; background-color:#white;"';
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
        markFoundedElementsOnWikiSite(matchedElements); 
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
        $('#WLMenuBtStatistic').show();
        $('#WLMenuDialog1').show();
        $('#WLMenuBtBroccoli').show();
        wl.UIMenu.wikiListsElements = listElements;
        wl.UIMenu.loadWikiDialog();
        wl.UIMenu.broccoliQuery = broccoliQueryStr;
        wl.UIMenu.loadBroccoliFrame();
        wl.UIMenu.closeSpinner();
        wl.UIMenu.loadStatisticDialog();
        // open broccoli 
        if (wl.UIMenu.statusBroccoliDialog == 'close') {
            wl.UIMenu.BroccoliFrameDialog.dialog("open");
            wl.UIMenu.statusBroccoliDialog = 'open';
        } 
    }
    //__________________________________________________________________________
    // Set source for Broccoli-Farme
    this.loadBroccoliFrame  = function()
    {
        if ($('#UIMenuBroccoliFrame').html() == null)
        {
                $('#UIMenuFrameDialog').append('<iframe style="position:relative; height:95%; width:99%;"  id="UIMenuBroccoliFrame" />');
                $('#UIMenuBroccoliFrame').attr({
                    src: wl.UIMenu.broccoliQuery
                }); 
        }
    }
    //__________________________________________________________________________
    this.loadStatisticDialog = function()
    {
        var htmlStr='<div style="font-size:14px; padding:2px; border-radius:2px; border-width: 1px; border-style:solid; border-color: #666666; background-color:#EBED8E; width:98.5%">';
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
        htmlStr+='<table style="width:100%;">'
        htmlStr+='<tr>'
                   +'<td><b>Elements on wiki-site: </b></td> '
                   +'<td style="text-align: center;">'+ listElementsNumber +'</td> '
                + '</tr>';
        htmlStr+='<tr>'
                   +'<td><b>Elements <i>also</i> found in YAGO: </b></td> '
                   +'<td style="text-align: center;">'+ foundedInOntology +'</td> '
                + '</tr>';             
        htmlStr+='<tr>'
                   +'<td><b>Additional elements from Broccoli: </b></td> '
                   +'<td  id="nofMissingEllements" style="text-align: center;"></td> '
                + '</tr>';
        htmlStr+='<tr>'
                   +'<td><b>Matching elements from Broccoli: </b></td> '
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
            this.style.background = "#EFA8A2";
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
            create: function(event, ui) {
                 $(event.target).parent().css('position', 'fixed');
            },
			autoOpen: false,
            show: 'fade',
			position: ['right','bottom'],
            beforeClose: function(event, ui) {wl.UIMenu.statusDialog1='close';},
            resizeStop: function(event, ui) {
                var position = [(Math.floor(ui.position.left) - $(window).scrollLeft()),
                                (Math.floor(ui.position.top) - $(window).scrollTop())];
                $(event.target).parent().css('position', 'fixed');
                $(wl.UIMenu.WikiDialog).dialog('option','position',position);
            },
			height:  $(window).height() *0.36,
    		width: '49%',
            zIndex: 3999,
			title: 'Additional elements'
		});
        // full screen resizer
        var wikiDialogOptions = new Object();
        wikiDialogOptions["status"]=0;
        $('#ui-dialog-title-UIMenuWikiDialog').css('float', 'right');
        $('#ui-dialog-title-UIMenuWikiDialog').css("font-family", "'Averia Gruesa Libre', cursive");
        $('#ui-dialog-title-UIMenuWikiDialog').parent().dblclick(function() {
            var width = wl.UIMenu.WikiDialog.dialog("option","width");
            var height = wl.UIMenu.WikiDialog.dialog("option","height");
            var position = wl.UIMenu.WikiDialog.dialog("option","position");
            if (wikiDialogOptions["status"]==0)
            {
                wikiDialogOptions["status"]=1;
                wikiDialogOptions["position"]=position;
                wikiDialogOptions["width"]=width;
                wikiDialogOptions["height"]=height;
                wl.UIMenu.WikiDialog.dialog("option","width",$(window).width());
                wl.UIMenu.WikiDialog.dialog("option","height",$(window).height());
                wl.UIMenu.WikiDialog.dialog("option", "position",  ['left','top']);
            } else{
                wikiDialogOptions["status"]=0;
                wl.UIMenu.WikiDialog.dialog("option","width", wikiDialogOptions["width"]);
                wl.UIMenu.WikiDialog.dialog("option","height", wikiDialogOptions["height"]);
                wl.UIMenu.WikiDialog.dialog("option", "position",  wikiDialogOptions["position"]);
            }
        });
        //wl.UIMenu.WikiDialog.parent().addClass('shadow');
        //wl.UIMenu.WikiDialog.parent().css({ position: "fixed" });
        wl.UIMenu.WikiDialog.parent().css({ opacity: 0.9});
        wl.UIMenu.StatisticDialog = $('<div style="font-family: arial;" id="UIMenuStatisticDialog"> </div>')
        .html('')
		.dialog({
            create: function(event, ui) {
                 $(event.target).parent().css('position', 'fixed');
            },
			autoOpen: false,
            show: 'fade',            
			position: ['left','bottom'],
            beforeClose: function(event, ui) {wl.UIMenu.statusStatistic='close';},
            resizeStop: function(event, ui) {
                var position = [(Math.floor(ui.position.left) - $(window).scrollLeft()),
                                (Math.floor(ui.position.top) - $(window).scrollTop())];
                $(event.target).parent().css('position', 'fixed');
                $(wl.UIMenu.StatisticDialog).dialog('option','position',position);
            },
			height:  $(window).height() *0.36,
            zIndex: 4000,
    		width: '49%',
			title: 'Statistics'
		});
        // full screen resizer
        var statisticDialogOptions = new Object();
        statisticDialogOptions["status"]=0;
        $('#ui-dialog-title-UIMenuStatisticDialog').css('float', 'right');
        $('#ui-dialog-title-UIMenuStatisticDialog').css("font-family", "'Averia Gruesa Libre', cursive");
        $('#ui-dialog-title-UIMenuStatisticDialog').parent().dblclick(function() {
            var width = wl.UIMenu.StatisticDialog.dialog("option","width");
            var height = wl.UIMenu.StatisticDialog.dialog("option","height");
            var position = wl.UIMenu.StatisticDialog.dialog("option","position");
            if (statisticDialogOptions["status"]==0)
            {
                statisticDialogOptions["status"]=1;
                statisticDialogOptions["position"]=position;
                statisticDialogOptions["width"]=width;
                statisticDialogOptions["height"]=height;
                wl.UIMenu.StatisticDialog.dialog("option","width",$(window).width());
                wl.UIMenu.StatisticDialog.dialog("option","height",$(window).height());
                wl.UIMenu.StatisticDialog.dialog("option", "position",  ['left','top']);
            } else{
                statisticDialogOptions["status"]=0;
                wl.UIMenu.StatisticDialog.dialog("option","width", statisticDialogOptions["width"]);
                wl.UIMenu.StatisticDialog.dialog("option","height", statisticDialogOptions["height"]);
                wl.UIMenu.StatisticDialog.dialog("option", "position",  statisticDialogOptions["position"]);
            }
        });
        //wl.UIMenu.BroccoliDialog.parent().addClass('shadow');
        //wl.UIMenu.StatisticDialog.parent().css({ position: "fixed" });
        wl.UIMenu.StatisticDialog.parent().css({ opacity: 0.9});
        
        //----
        // Broccoli frame dialog
        wl.UIMenu.BroccoliFrameDialog = $('<div style="font-family: arial;" id="UIMenuFrameDialog"> </div>')
        .html('')
    	.dialog({
            create: function(event, ui) {
                 $(event.target).parent().css('position', 'fixed');
            },
			autoOpen: false,
            show: 'fade',            
			position: ['right','top'],
            beforeClose: function(event, ui) { wl.UIMenu.statusBroccoliDialog='close';},
            //dragStop:function(event, ui) { wl.UIMenu.BroccoliFrameDialog.parent().css({ position: "fixed" }); },
           // beforeOpen: function(event, ui) {wl.UIMenu.BroccoliFrameDialog.parent().css({ position: "fixed" }); },
            resizeStop: function(event, ui) {
                var position = [(Math.floor(ui.position.left) - $(window).scrollLeft()),
                                (Math.floor(ui.position.top) - $(window).scrollTop())];
                $(event.target).parent().css('position', 'fixed');
                $(wl.UIMenu.BroccoliFrameDialog).dialog('option','position',position);
            },
			height:  $(window).height() *0.6,
            zIndex: 4000,
			width: '49%',
			title: 'Broccoli'
		});
        // full screen resizer
        var BroccoliFrameDialogOptions = new Object();
        BroccoliFrameDialogOptions["status"]=0;
        $('#ui-dialog-title-UIMenuFrameDialog').css('float', 'right');
        $('#ui-dialog-title-UIMenuFrameDialog').css("font-family", "'Averia Gruesa Libre', cursive");
        $('#ui-dialog-title-UIMenuFrameDialog').parent().dblclick(function() {
            var width = wl.UIMenu.BroccoliFrameDialog.dialog("option","width");
            var height = wl.UIMenu.BroccoliFrameDialog.dialog("option","height");
            var position = wl.UIMenu.BroccoliFrameDialog.dialog("option","position");
            if (BroccoliFrameDialogOptions["status"]==0)
            {
                BroccoliFrameDialogOptions["status"]=1;
                BroccoliFrameDialogOptions["position"]=position;
                BroccoliFrameDialogOptions["width"]=width;
                BroccoliFrameDialogOptions["height"]=height;
                wl.UIMenu.BroccoliFrameDialog.dialog("option","width",$(window).width());
                wl.UIMenu.BroccoliFrameDialog.dialog("option","height",$(window).height());
                wl.UIMenu.BroccoliFrameDialog.dialog("option", "position",  ['left','top']);
            } else{
                BroccoliFrameDialogOptions["status"]=0;
                wl.UIMenu.BroccoliFrameDialog.dialog("option","width", BroccoliFrameDialogOptions["width"]);
                wl.UIMenu.BroccoliFrameDialog.dialog("option","height", BroccoliFrameDialogOptions["height"]);
                wl.UIMenu.BroccoliFrameDialog.dialog("option", "position",  BroccoliFrameDialogOptions["position"]);
            }
        });
        //wl.UIMenu.BroccoliDialog.parent().addClass('shadow');
        //wl.UIMenu.BroccoliFrameDialog.parent().css({ position: "fixed" });
        wl.UIMenu.BroccoliFrameDialog.parent().css({ opacity: 0.9});
       // wl.UIMenu.BroccoliFrameDialog.dialog({dialogClass: "flora"});
    //    $('.flora.ui-dialog').css({position:"fixed"});
        
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
        wl.UIMenu.loadjscssfile('http://fonts.googleapis.com/css?family=Averia+Gruesa+Libre','css');
        wl.UIMenu.loadjscssfile(wl.FRONTENDADRESS + 'libs/jquery.qtip.min.css', "css"); 
        
        // Add UIMenu-Button
        $('body').prepend('<div style=" position:fixed; z-index:30000; top:0px; left:0px;" id="sidebar1"; onclick=wl.UIMenu.toggle_sidebar();> <a href="#"> <img id="logo"; class="shadow roundCorners logo gradient"; src="' + wl.FRONTENDADRESS + 'logo1.png"></a> </div>');
        $('#logo').mouseover(function(){this.style.opacity='1';});
        $('#logo').mouseout(function(){this.style.opacity='0.9';});
        // Add Menu
        $('body').prepend('<div class="WLMenu gradient" style="padding-left:163px" id="UIMenu"></div>');
        
        // Add necessary buttons
        $('#UIMenu').append('<div style="top:0px; position:relative; margin-left:0px;" class="WLMenuButton shadow"; id="WLMenuQueryExe"><div style="color:#FF474A; font-size:10px;"><b>START</b></div></div>');
        $('#WLMenuQueryExe').button();
        $('#UIMenu').append('<div style="top:0px; position:relative; margin-left:10px;" class="WLMenuButton shadow"; id="WLMenuBtBroccoli"><div style="color:#6bba70; font-size:10px;"><b>Broccoli</b></div> </div>');
        $('#WLMenuBtBroccoli').button();
        $('#UIMenu').append('<div style="top:0px; position:relative; margin-left:10px;" class="WLMenuButton shadow"; id="WLMenuDialog1"><div style="color:#2c539e; font-size:10px;"><b>Additional elements</b></div></div>');
        $('#WLMenuDialog1').button();
        $('#UIMenu').append('<div style="top:0px; position:relative; margin-left:10px;" class="WLMenuButton shadow"; id="WLMenuBtStatistic"><div style="color:#FF474A; font-size:10px;"><b>Statistics</b></div> </div>');
        $('#WLMenuBtStatistic').button();
        //$('#UIMenu').append('<div class="WLMenuEditor shadow"; id="WLMenuEditor">Editor</div>'); 
        // set google-fonts
        $('#WLMenuBtStatistic').hide();
        $('#WLMenuDialog1').hide();
        $('#WLMenuBtBroccoli').hide();
        $('#WLMenuQueryExe').css("font-family", "'Averia Gruesa Libre', cursive");
        $('#WLMenuBtStatistic').css("font-family", "'Averia Gruesa Libre', cursive");
        $('#WLMenuDialog1').css("font-family", "'Averia Gruesa Libre', cursive");
        $('#WLMenuBtBroccoli').css("font-family", "'Averia Gruesa Libre', cursive");
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
            
            wl.UIMenu.loadBroccoliFrame();
            return false;
        }); 
        
        $('#WLMenuQueryExe').click(function() 
        { 
            $('#WLMenuQueryExe').hide();
            wl.UIMenu.postQuery();            
        }); 
    }
});