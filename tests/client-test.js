test("remove text surrounded by $addinfo tags from string",
    function() {
       equal(
           wl.broccoliClient.removeAddInfoText('test'),
           'test',
           'string without add info tag shold not be changed');
       equal(
           wl.broccoliClient.removeAddInfoText('teststart$addinfo$taptup' +
            '$/addinfo$testend'),
            'teststarttestend',
            'string should have info tag removed');
    });