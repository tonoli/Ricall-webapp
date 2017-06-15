$(document).ready(function(){

  $('form').on('submit', function(){

      var event_name = $('form event_name');
      var ricall_time = $('form ricall_time');
      var urgency = $('form urgency');
      var rivent = {
        event_name: event_name.val(),
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
