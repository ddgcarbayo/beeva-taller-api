/*************************************
//
// p1 app
//
**************************************/


    //http://en.wikipedia.org/w/api.php?action=query&list=recentchanges&format=json&rcprop=title|ids|sizes|flags|user

// connect to our socket server
var socket = io.connect();

var app = app || {};


// shortcut for document.ready
$(function(){

	//setup some common vars
	var $blastField = $('#blast'),
		$allPostsTextArea = $('#allPosts'),
		$clearAllPosts = $('#clearAllPosts'),
		$sendBlastButton = $('#send');

    $.get('/object',function(data){
        console.log(data);
        $allPostsTextArea.html(data.join("<br>"));
    });


	//SOCKET STUFF
	socket.on("update", function(data){
        $allPostsTextArea.html(data.join('<br>'));
	});

	$clearAllPosts.click(function(e){
        socket.emit("clean", {},
            function(data){
                $allPostsTextArea.text('');
            });
	});

	$sendBlastButton.click(function(e){

		var blast = $blastField.val();
		if(blast.length){
			socket.emit("update", {msg:blast},
				function(data){
					$blastField.val('');
				});
		}


	});

	$blastField.keydown(function (e){
	    if(e.keyCode == 13){
	        $sendBlastButton.trigger('click');//lazy, but works
	    }
	})

});
