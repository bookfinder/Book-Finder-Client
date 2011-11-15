//------------------------------------------------
// Internationalization
//------------------------------------------------
$.tr.dictionary(dictionnary);

// TODO: Manage language selection
var lg = 'fr';

// 2. Language selection.
$.tr.language(lg, false);

// 3. Use.
var tr = $.tr.translator();

// Stuff to do when dom ready
$(function()
{console.log($('.row').size());
	// Translate static string
	$('.translate').each(function()
	{console.log('AA');
		var index = $(this).html();console.log(index);
		
		$(this).html(tr(index));
	});
});

//------------------------------------------------
// Search form
//------------------------------------------------
$('#form_search').submit(function(e) {
	
  var keywords = $("#keywords").val();
  
  var url = 'http://hackathonqc.librarieshub.com/api/search?s=' + keywords;
  
  // Geolocalisation
  if($.cookie('coords-latitude')) url += '&lat=' + $.cookie('coords-latitude');
  if($.cookie('coords-longitude')) url += '&long=' + $.cookie('coords-longitude');
  
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
                  
        $('#results-title').text((data.total) ? data.total + ' résultats' : 0 + ' résultat');
		  
        for(item in data.results)
        {
          var result = data.results[item];
          var resultHTML = "";
			  
          var providers = {
            'google':null, 
            'amazon':null, 
            'library':null
          };
			  
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
                    if(Number(location.price) > 0) providers['amazon'] = tr('Best price on Amazon : $&1', Number(location.price).toFixed(2));								  
                    break;
                  case 'Google':
                    providers['google'] = tr('Available on Google Book');								  
                    break;
                  default:
                    if(location.distance) providers["library"] = tr('Available at &1 library (&2 km)', location.name, location.distance);								  
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
          results = "<div class='alert-message warning'>" + tr('No result found') + "</div>";
        }
		  
        $("div#results").html(results);
        $('.provider-icon', $("div#results")).twipsy();
      }
      else
      {
        // Parse error
        $("div#results").html("<div class='alert-message error'>" + tr('Server error') +"</div>");
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
	      $.cookie('coords-latitude', position.coords.latitude, {
	        expires: 1
	      });
	      $.cookie('coords-longitude', position.coords.longitude, {
	        expires: 1
	      });
	    };
	   navigator.geolocation.getCurrentPosition(callbackSuccess, null);
  }
}