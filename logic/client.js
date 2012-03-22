var wikiLists = wikiLists || {};
var wl = wikiLists;
wl.client = new function() {
    this.getListElementsAndQueryStringForWikiURL = function(wikiURL,
        callbackForResponse) {
        var stromboliRequestURL = createStromboliRequestURL(wikiURL);
        jQuery.ajax({
          url: stromboliRequestURL,
          dataType: 'jsonp',
          data: {
              requesttype: 'wikilist',
              format: 'jsonp'
              },
          success: callbackForResponse
        });
    };

    this.getBroccoliInstances = function (queryString, numberOfInstances,
    callback) {
        wl.client.getURL(
            'http://stromboli.informatik.uni-freiburg.de:5839/?' + queryString + 
            '&nofinstances=' + numberOfInstances + '&nofhitgroups=0',
             callback);             
    };

    this.getURL = function(urlString, callback) {
        var stromboliRequestURL = createStromboliRequestURL(urlString);
        jQuery.ajax({
          url: stromboliRequestURL,
          dataType: 'jsonp',
          data: {
              requesttype: 'urlrequest',
              format: 'jsonp'
              },
          success: callback
        });
    };

    var createStromboliRequestURL  = function(urlString) {   
        var stromboliRequestURL = 
            'http://stromboli.informatik.uni-freiburg.de:' + 
            wl.STROMBOLIPORT + '/' + encodeURIComponent(urlString);
        return stromboliRequestURL;
    };
};

// This "client" just waits for messages from the iframe :)
wl.broccoliClient = new function() {
    this.listenForQueryStringFromBroccoliFrame = function() {              
        window.addEventListener('message',function(event) {                  
                        var broccoliJSON = $.parseJSON(event.data);
                        receiveBroccoliJSON(broccoliJSON);
        }, false);
    };
    var receiveBroccoliJSON = function (broccoliJSON) {
        if (broccoliJSON.type == 'queryString') {
            console.log('Got querystring: ' + broccoliJSON.queryString);
            var nrOfInstances = 10000;
            wl.client.getBroccoliInstances(broccoliJSON.queryString,
            nrOfInstances, receiveBroccoliInstances);
        }
    };
    var receiveBroccoliInstances = function(broccoliResultJSON) {
        var xmlResultString = broccoliResultJSON.responseBody;
        var xmlResult = $($.parseXML(xmlResultString));
        var broccoliInstances = xmlResult.find("i");
        wl.lists.addBroccoliInstances(broccoliInstances);
    };
};

wl.broccoliClient.listenForQueryStringFromBroccoliFrame();
