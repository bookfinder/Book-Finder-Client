/* Author: 

 */

$(function(){
	$('#search .more-options').hide()
	$('#search .show-options').click(function()
	{
		$('#search .more-options').toggle('fade')
	})
})

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
      for(item in data.results){
        console.dir(data.results[item]);
      }
      
    },
    error: function(XHR, textStatus, errorThrown){
      console.log(textStatus);
      console.log(errorThrown);
    }
  });
  
  return false;
});

$(function(){
	$('.provider-icon').each(function()
	{
		$(this).twipsy();		
	});
	
});

// ------------------------------------------------
// Geolocalisation
// ------------------------------------------------

// Check if the position is in cookies
if(!$.cookie('coords-latitude') || !$.cookie('coords-longitude'))
{
	// If client support HTML5 Geolocation
	if (navigator.geolocation) 
	{
		var callbackSuccess = function callbackSuccess(position)
		{
			$.cookie('coords-latitude', position.coords.latitude, { expires: 1 });
			$.cookie('coords-longitude', position.coords.longitude, { expires: 1 });
		};
		
		var callbackError = function callbackSuccess(error)
		{
			switch(error.code) 
			{
				case error.TIMEOUT:
					alert ('Timeout');
					break;
				case error.POSITION_UNAVAILABLE:
					alert ('Position unavailable');
					break;
				case error.PERMISSION_DENIED:
					alert ('Permission denied');
					break;
				case error.UNKNOWN_ERROR:
					alert ('Unknown error');
					break;
			}
		};
		
		navigator.geolocation.getCurrentPosition(callbackSuccess, callbackError);
	}
	// finish the error checking if the client is not compliant with the spec
	else 
	{
		alert('Erreur supporte pas HTML 5');
	}
}
else
{
	//alert($.cookie('coords-latitude') + ' : ' + $.cookie('coords-longitude'));
}
















