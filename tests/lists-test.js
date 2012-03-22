test("get href of instance from broccoli",
    function() {
       equal(
           wl.lists.extractHrefOfBroccoliInstanceText("e:americanchestnut:American_Chestnut"),
           "American_Chestnut", 
           "should get correct href");
    });