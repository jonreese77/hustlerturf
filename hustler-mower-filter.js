<!-- Filter JS by Dennis Erwin -->
<script src="https://npmcdn.com/isotope-layout@3.0/dist/isotope.pkgd.min.js"></script>
<script type="text/javascript">

//Global variable for filtered selection
var filteredSelection = [];

function decodeFromURL() {
  selectionArray = window.location.search.replace('?', '').split('&');
  if(selectionArray[0] != '') {
    selectionArray.forEach(function(item, index) {
      var getItems = item.split('=');
      getItems.shift();
      var selection = getItems[0].split(',');
      selection.forEach(function(selectionName) {
        $('.filter-checkbox-wrapper').each(function() {
          if($(this).attr('data-filtername') == selectionName) {
            $(this).find('.filter-checkbox-fill').toggle();
          }
        });
        filterSelection(selectionName);
      });
    });
  }
}

function encodeToURL() {
	var productLocation = '?';
  var groupArry = {};
  groupArry['productGroup'] = {title:'product=',selection:[]};
  groupArry['priceGroup'] = {title:'price=',selection:[]};
  groupArry['acreageGroup'] = {title:'acreage=',selection:[]};
  groupArry['engineGroup'] = {title:'engine=',selection:[]};
  groupArry['horsePowerGroup'] = {title:'horsepower=',selection:[]};
  groupArry['usageGroup'] = {title:'usage=',selection:[]};
  groupArry['deckGroup'] = {title:'deck=',selection:[]};
  if(filteredSelection.length > 0) {
    filteredSelection.forEach(function(item) {
    	var productItem = item.replace(/[.]/g, '');
      var selectionGroup = $('a[data-filtername="' + productItem + '"').parents('.filter-collection-block').attr('id');
  		switch(selectionGroup) {
      	case 'check-product-type':
        	groupArry['productGroup'].selection.push(productItem);
        break;
        case 'check-price':
        	groupArry['priceGroup'].selection.push(productItem);
        break;
        case 'check-acreage':
        	groupArry['acreageGroup'].selection.push(productItem);
        break;
        case 'check-engine':
        	groupArry['engineGroup'].selection.push(productItem);
        break;
        case 'check-horsepower':
        	groupArry['horsePowerGroup'].selection.push(productItem);
        break;
        case 'check-usage':
        	groupArry['usageGroup'].selection.push(productItem);
        break;
        case 'check-deck':
        	groupArry['deckGroup'].selection.push(productItem);
        break;
      }
    });
    for(var group in groupArry) {
      if(groupArry[group].selection.length > 0) {
      	if(productLocation.length == 1) {
        	productLocation += groupArry[group].title;
        } else {
      		productLocation += ('&' + groupArry[group].title);
        }
        groupArry[group].selection.forEach(function(item, index) {
        	if(index != (groupArry[group].selection.length - 1)) {
          	productLocation += (item += ',');
          } else { productLocation += item; }
        });
      }
    }
    window.history.replaceState('', '', ''+productLocation+'');
  } else { window.history.replaceState('', '', '/zero-turn-mowers'); }
}

function filterSelection(selection) {
	filterType = '.' + selection;
  //First, check for existence of selector, which means we want to remove it
  if(filteredSelection.indexOf(filterType) >= 0) {
  	filteredSelection.splice(filteredSelection.indexOf(filterType), 1);
  } else {
  	filteredSelection.unshift(filterType);
  }
  
  //If we have any filters, process them
  var showResidential = true;
  var showCommercial = true;
  $('#residential-title').show();
  $('#commercial-title').show();
  $('#fg-residential').parent('.filter-grid-wrapper').show();
  if(filteredSelection.length) {
  	//Separate between additive and subtractive
  	var filterLimit = [];
    var filterAdd = [];
    filteredSelection.forEach(function(item, index) {
    	switch(item) {
    	case '.less-than-1-acre':
      case '.1-3-acres':
      case '.3PlusAcres':
      case '.less-than-three':
      case '.residential':
      case '.commercial':
      case '.zero-turn':
      case '.stand-on':
      case '.walk-behind':
      	filterLimit.push(item);
        //Uncheck other boxes
        var choice = item.substr(1);
        var checkbox = $('.filter-wrapper').find('a[data-filtername="' + choice + '"]');
        $(checkbox).siblings('.filter-checkbox-wrapper').each(function() {
        	var otherOption = $(this).find('.filter-checkbox-fill');
          if($(otherOption).is(':visible')) {
          	$(otherOption).toggle();
            var otherSelectedElement = $(otherOption).parents('.filter-checkbox-wrapper').attr('data-filtername');
            filteredSelection.splice(filteredSelection.indexOf('.' + otherSelectedElement), 1);
          }
        });
        if(item == '.residential') { showCommercial = false; }
        if(item == '.commercial') { showResidential = false; }
     	break;
      default:
      	filterAdd.push(item);
      }
    });
    
    //From two lists, create final filter string for isotope
    var filterFinal = '';
    filterLimit = filterLimit.join('');
    if(filterAdd.length) {
    	filterAdd.forEach(function(item, index) {
      	if(index != (filterAdd.length - 1)) { filterFinal += (item + filterLimit + ', ');
        } else { filterFinal += (item + filterLimit); }
      });
    } else { filterFinal = filterLimit; }
  } else { filterFinal = '*'; }
  
  //Filter is done, process
  encodeToURL();
	$gridR.isotope({ filter: filterFinal });
  $gridC.isotope({ filter: filterFinal });
  $('#residential-empty-state').hide();
  $('#commercial-empty-state').hide();
  if($gridR.isotope('getFilteredItemElements').length < 1) {
  	$('#residential-empty-state').show();
    $('#residential-title').hide();
  }
  if($gridC.isotope('getFilteredItemElements').length < 1) {
  	$('#commercial-empty-state').show();
    $('#commercial-title').hide();
  }
  if($gridR.isotope('getFilteredItemElements').length < 1 && $gridC.isotope('getFilteredItemElements').length < 1) {
    $('#commercial-empty-state').hide();
    $('#residential-title').hide();
    $('#commercial-title').hide();
  }
  
  //Final filter if limiting to residential or commercial only
  if(!showResidential) {
  	$('#residential-empty-state').hide();
    $('#residential-title').hide();
    $('#fg-residential').parent('.filter-grid-wrapper').hide();
  }
  if(!showCommercial) {
  	$('#commercial-empty-state').hide();
  	$('#commercial-title').hide();
  }
  
}

function applyClassToItems() {
	//Apply Product Type
  var productType = $('div[data-sort="product-type"]');
  $(productType).each(function() {
  	var productTypeName = $(this).children('div').text();
    productTypeName = productTypeName.replace(/\s/g, '');
    productTypeName = productTypeName.toLowerCase();
    $(this).parents('.filter-item').addClass(productTypeName);
  });
  
  //Apply Price
  var price = $('div[data-sort="price"]');
  $(price).each(function() {
  	var priceWithoutDollar = $(this).text().replace(/[$ ]/g, '');
  	var priceTotal = parseInt(priceWithoutDollar.replace(/[, ]/g, ''), 10);
    if(3000 < priceTotal) {
    	$(this).parents('.filter-item').addClass('greater-than-three');
    } else {
    	$(this).parents('.filter-item').addClass('less-than-three');
    }
  });
  
	//Apply Acreage
  var acreage = $('div[data-sort="acreage"]');
  $(acreage).each(function() {
  	$(this).children('div').each(function() {
  		if($(this).attr('data-acreage')) {
  			var isInvisible = $(this).hasClass('w-condition-invisible');
  			var acreageAmount = $(this).attr('data-acreage');
  			if(!isInvisible) {
  				$(this).parents('.filter-item').addClass(acreageAmount);
  			}
  		}
  	});
  });
  
  //Apply Engine Brand
  var engineBrand = $('div[data-sort="engine-brand"]');
  $(engineBrand).each(function() {
  	var engineBrandName = $(this).children('div').text();
    if(engineBrandName == 'Briggs&Stratton') {
    	engineBrandName = 'BriggsStratton';
    }
    engineBrandName = engineBrandName.replace(/\s/g, '');
    engineBrandName = engineBrandName.toLowerCase();
    $(this).parents('.filter-item').addClass(engineBrandName);
  });
  
  //Apply Horsepower
  var horsePower = $('div[data-sort="horsepower"]');
  $(horsePower).each(function() {
  	$(this).children('div').each(function() {
    	if($(this).attr('data-horsepower')) {
      	var isInvisible = $(this).hasClass('w-condition-invisible');
  			var horsePowerAmount = $(this).attr('data-horsepower');
  			if(!isInvisible) {
        	horsePowerAmount.replace(/\s/g, '');
          horsePowerAmount = horsePowerAmount.toLowerCase();
  				$(this).parents('.filter-item').addClass(horsePowerAmount);
  			}
      }
    });
  });
  
  //Apply usage
  var usage = $('div[data-sort="usage"]');
  $(usage).each(function() {
  	var usageType = $(this).find('div').attr('data-usage');
    $(this).parents('.filter-item').addClass(usageType);
  });
  
  //Apply Deck Size
  var deckSize = $('div[data-sort="deck-size"]');
  $(deckSize).each(function() {
  	$(this).children('div').each(function() {
    	if($(this).attr('data-decksize')) {
      	var isInvisible = $(this).hasClass('w-condition-invisible');
      	var deckSizeValue = $(this).attr('data-decksize').replace(/\s/g, '');
       	deckSizeValue = deckSizeValue.toLowerCase();
        if(!isInvisible) {
        	$(this).parents('.filter-item').addClass(deckSizeValue);
        }
      }
    });
  });
}

$(function() {

	applyClassToItems();
  
  window.$gridR = $('#fg-residential').isotope({
  	itemSelector: '.filter-item',
  	layoutMode: 'masonry',
    masonry: {
    	gutter: 0
    }
  });
  
  window.$gridC = $('#fg-commercial').isotope({
  	itemSelector: '.filter-item',
  	layoutMode: 'masonry',
    masonry: {
    	gutter: 0
    }
  });
  
  decodeFromURL();
	
  $('.filter-checkbox-wrapper').click(function() {
  	$(this).find('.filter-checkbox-fill').toggle();
  	var selection = $(this).attr('data-filtername');
    filterSelection(selection);
  });

});

</script>
<!-- /Filter JS by Dennis Erwin -->
