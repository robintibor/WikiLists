var wikiLists = wikiLists || {};
var wl = wikiLists;
// TODO(Robin): split up client into broccoli client and other client
// split broccoli client below into iframe client and broccoli client
// i.e. cleint broccoliclient -> wikilistclient broccoliclient iframelistener
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

    this.getBroccoliHitGroup = function(hitGroupIndex, queryString,
            broccoliHost, broccoliPort, callback) {
        wl.client.getURL(
            createBroccoliQueryURL(queryString, broccoliHost, broccoliPort) +
            '&nofinstances=0&firsthitgroup=' + hitGroupIndex + '&nofhitgroups=1',
            callback);
    };

    this.getBroccoliInstances = function (queryString, broccoliHost,
            broccoliPort, numberOfInstances, callback) {
        wl.client.getURL(
            createBroccoliQueryURL(queryString, broccoliHost, broccoliPort) +
            '&nofinstances=' + numberOfInstances + '&nofhitgroups=0',
             callback);
    };

    var createBroccoliQueryURL = function(queryString, 
        broccoliHost, broccoliPort) {
        return createBroccoliURL(broccoliHost, broccoliPort) + '/?s=' + 
            queryString;
    };

    var createBroccoliURL = function(broccoliHost, broccoliPort) {
        return  'http://' + broccoliHost + '.informatik.uni-freiburg.de:' + 
             broccoliPort;
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

// This "client" waits for messages from the broccoli 
// iframe and acts upon them :)
wl.broccoliClient = new function() {
    this.lastQueryString = '';
    this.broccoliHost = '';
    this.broccoliPort = '';

    this.listenForQueryStringFromBroccoliFrame = function() {              
        window.addEventListener('message',function(event) {                  
                        var broccoliJSON = $.parseJSON(event.data);
                        receiveBroccoliJSON(broccoliJSON);
        }, false);
    };

    var receiveBroccoliJSON = function (broccoliJSON) {
        if (broccoliJSON.type == 'queryString') {
            var nrOfInstances = 10000;
            wl.broccoliClient.lastQueryString = broccoliJSON.queryString;
            wl.broccoliClient.broccoliHost = broccoliJSON.broccoliHost;
            wl.broccoliClient.broccoliPort = broccoliJSON.broccoliPort;
            wl.client.getBroccoliInstances(broccoliJSON.queryString,
            broccoliJSON.broccoliHost, broccoliJSON.broccoliPort,
            nrOfInstances, receiveBroccoliInstances);
        }
    };

    var receiveBroccoliInstances = function(broccoliResultJSON) {
        var xmlResultString = broccoliResultJSON.responseBody;
        var xmlResult = $($.parseXML(xmlResultString));
        var broccoliInstances = xmlResult.find("i");
        wl.lists.addBroccoliInstances(broccoliInstances);
    };

    this.getHitGroupForElement = function (instanceElement, callback) {
        var instanceHref = $(instanceElement).attr('href');
        var hitGroupNr = wl.lists.getHitGroupNr(instanceHref);
        // we will extract the hit group of the result before using the given
        // callback (given callback will get hitgroup xml as input);
        var callbackForHitgroup = receiveHitgroup.bind(this, callback);
        wl.client.getBroccoliHitGroup(hitGroupNr, 
            wl.broccoliClient.lastQueryString, wl.broccoliClient.broccoliHost,
            wl.broccoliClient.broccoliPort, callbackForHitgroup);        
    };
    var receiveHitgroup = function(callbackForHitGroup, broccoliHitgroupJSON) {
        var xmlResultString = broccoliHitgroupJSON.responseBody;
        var xmlResult = $($.parseXML(xmlResultString));
        var hitGroup = xmlResult.find("group").first(); // there shold be only one anyways :)
        callbackForHitGroup(hitGroup);        
    };
};

wl.broccoliClient.listenForQueryStringFromBroccoliFrame();
