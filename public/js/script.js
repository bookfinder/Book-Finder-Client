/* Author: 

 */

$(function(){
	$('#search .more-options').hide()
	$('#search .show-options').click(function()
	{
		$('#search .more-options').toggle('fade')
	});
})

$('#form_search').submit(function(e) {
	
  var keywords = $("#keywords").val();
  var author = $("#author").val();
  var editor = $("#editor").val();
  var isbn = $("#isbn").val();
  
  var url = 'http://bookfinder-api.herokuapp.com/api/search?';
  if(keywords) url += 's=' + keywords;
  /*if(author) url += 's=' + author;
  if(editor) url += 's=' + editor;
  if(isbn) url += 's=' + isbn;*/
  
  // Show loading
  $("#results-loading").show();
  $("div#results").html("");
  
  $.ajax({
	type: 'GET',
    url: url,
    dataType: "json",    
    success: function(data, status)
    {	  
	  // Hide loading
	  $("#results-loading").hide();
	  
	  if(data && data.success && data.results)
	  {
		  var item;
		  var results = "";
		  
		  for(item in data.results)
		  {
			  var result = data.results[item];
			  var resultHTML = "";
			  
			  var providers = {'google':null, 'amazon':null, 'library':null};
			  
			  if(result.locations)
			  {
				  var location;
				  for(location in result.locations)
				  {
					  location = result.locations[location];
					  
					  if(location.name)
					  {
						  switch(location.name)
						  {
							  case 'Amazon':
								  if(Number(location.price) > 0) providers['amazon'] = "Meilleur prix sur Amazon: " + Number(location.price).toFixed(2) + ' $';								  
							  break;
							  case 'Google':
								  providers['google'] = "Disponible sur Google Books";								  
							  break;
							  default:
								  if(location.distance) providers["library"] = "Disponible à la bibliothèque " +  location.name + " (" + location.distance + " km)";								  
							  break;
						  }
					  }
				  }
			  }
			  
				// Result line
				resultHTML += '<div class="row result-row breadcrumb" isbn="' + result.isbn + '">';
				resultHTML += '<div class="span15"><h3>' + result.title + '</h3></div>';
				resultHTML += '<div class="span12">' + result.author + ' ' + result.year + '</div>';
				resultHTML += '<div class="availability">';
				  
			  	var provider;
			  	for(provider in providers)
			  	{
			  		var providerText = providers[provider];
			  		
			  		resultHTML += '<div class="span1">';
			  		
			  		if(providerText)
			  		{			  			
					  	resultHTML += '<span class="provider-icon '+provider+' active" title="'+providerText+'"></span>';					  	
			  		}
			  		else
			  		{
			  			resultHTML += '<span class="provider-icon '+provider+'"></span>';			  	
			  		}
			  		
			  		resultHTML += '</div>';			  		
				}				  
						  
				 resultHTML += '</div>';
				 resultHTML += '</div>';
				 
				 // Add to the result list
				 results += resultHTML;
		  }
		  
		  if(results == "")
		  {
			  results = "<div class='alert-message warning'>Aucun résultat trouvé.</div>";
		  }
		  
		  $("div#results").html(results);
		  $('.provider-icon').twipsy();
	  }
	  else
	  {
		  // Parse error
		  $("div#results").html("<div class='alert-message error'>Erreur serveur</div>");
	  }
    },
    error: function(XHR, textStatus, errorThrown)
    {
    	// Hide loading
  	  	$("#results-loading").hide();
  	  	
  	  	// TODO: Show human-readable message
  	  	
  	  	// Show error message
    	$("div#results").html("<div class='alert-message error'>" + textStatus + "</div>");
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
















