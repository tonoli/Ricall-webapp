$(document).ready(function(){

	$('form').on('submit', function(){

		var event_name = $('form event_name');
		var title = $('form input title');
		var date = $('form input date');
		var category_id = $('form input cat');
		//var event_id = "1"
		var rivent = {
			//event_id : event_id.val();
			title: title.val(),
			date : date.val(),
			time : time.val()
			category_id : cat.val();
		};

		$.ajax({
			type: 'POST',
			url: '/dashboard',
			data: rivent,
			success: function(data){
				//do something with the data via front-end framework
				location.reload();
			}
		});
		return false;
	});

	$(".del-btn").on('click', function(){
		var event_id = $(".del-btn").attr('id');
		$.ajax({
			type: 'DELETE',
			url: '/dashboard/' + event_id,
			success: function(data){
				//do something with the data via front-end framework
				location.reload();
			}
		});
	});

//Datepicker
	$("#datepicker").datepicker("show");

// Upcoming and history
	$('button').on('click', function(){
		$('button').removeClass('selected');
		$(this).addClass('selected');

	});
// textJustify

});
