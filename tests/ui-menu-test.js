test("extract context boundaries from context string",
    function() {
        deepEqual(wl.UIMenu.extractContextBoundariesFromContextString("0-13"), 
            [ 
                {
                    "contextStart" : 0,
                    "contextEnd" : 13
                }
            ],
            "should get correct boundary for just one context block"
        );
        deepEqual(wl.UIMenu.extractContextBoundariesFromContextString("0-11,14-18"),
            [
                {
                    "contextStart" : 0,
                    "contextEnd" : 11
                },
                {
                    "contextStart" : 14,
                    "contextEnd" : 18
                }
            ],
            "should get correct boundaries for two context blocks");
                    
    });
    
test(" convert text to term list",
    function() { 
        deepEqual(wl.UIMenu.convertTextToTermList("It@@ is a@@ nut@@.") , 
            ["It", " is a", " nut", "."],
            "correctly convert text to term list");
        deepEqual(wl.UIMenu.convertTextToTermList("I@@ know@@,@@ it is@@ wrong@@.") , 
            ["I", " know", ",", " it is", " wrong", "."],
            "correctly convert text to term list");
            
    });
    
test( "create formatted text from excerpt properly",
        function() {
            equal(wl.UIMenu.createFormattedText(["I", " know", ",", " it is", " wrong", "."],
            [
                {
                    "contextStart" : 3,
                    "contextEnd" : 5
                }
            ],
            $("<hl pos=3></hl>")), '<span class="unimportantExcerptText">I know,</span><b> it is</b> wrong.',
            'should correctly format small text');
        }
    );