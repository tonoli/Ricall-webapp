$(document).ready(function(){

  $('form').on('submit', function(){

      var event_name = $('form event_name');
      var title = $('form input title');
      var ricall_time = $('form input ricall_time');
      var urgency = $('form urgency');
      //var event_id = "1"
      var rivent = {
        //event_id : event_id.val();
        title: title.val(),
        ricall_time : ricall_time.val(),
        urgency : urgency.val()
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

  $( ".del-btn").on('click', function(){
      var event_id = $(this).attr('id');
      $.ajax({
        type: 'DELETE',
        url: '/dashboard/' + event_id,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });
  });

});

$(function(){
        $('#datepicker').datepicker({

            inline: true,
            showOtherMonths: true,
            dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            altField: "#date",
        });
});

$(document).ready( function() {
  $("#datepicker").datepicker("show");

});
