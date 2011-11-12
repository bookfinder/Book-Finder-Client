/* Author: 

 */

$('#form_search').submit(function(e) {
  
  var url = 'dummy-data.json';
  
  $.ajax({
    url: url,
    dataType: "json",
    beforeSend: function( xhr ) {
      console.log("beforeSend");
    },
    
    success: function(data, status){
      console.dir(data);
    },
    error: function(XHR, textStatus, errorThrown){
      console.log(textStatus);
      console.log(errorThrown);
    }
  });
  
  return false;
});
















