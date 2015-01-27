//Regex that matches dollar amounts 
var dollarAmount = new Regex(\$\d{0,}\.\d{2,}?)

//jQuery Regex selector - case insensitive.
$.expr[":"].matchRegex = $.expr.createPseudo(function(arg) {
    return function( elem ) {
    	return $(elem).text().match(new RegExp(arg, 'i')) != null;
    };
});


//Simple function that swaps elements using jQuery 
function swapElements(arg1, arg2){
	var itemparent = $(arg1).parent();
	var itemindex = $(arg1).index();
	var temp = arg2.replaceWith(arg1);
	if (itemindex === 0) {
		$(itemparent).prepend(temp);
	}
	else {
		$(itemparent).children().eq(itemindex - 1).after(temp);
	}
}

//SAMPLE FILTERING CODE FOR www.livingrichwithcoupons.com
//Set pricepoint to compare against deals
var pricePoint = 0.50;

//
var itemswithcoupons = $('.plists-item:matchRegex(as low as)');
var pattern1 = new RegExp('as low as.*','i');
var pattern2 = new RegExp('\\d{0,6}\\.\\d{2,}?','i')

$.each(itemswithcoupons, function(index, el) {
	var matchedText = pattern1.exec($(el).text());
	var matchedAmount = Number(pattern2.exec(matchedText));
	if (matchedAmount > x) {
		$(el).hide();
	}
});

var itemswithoutcoupons = $('.plists-item:not(:matchRegex(as.*low.*as))');
var pattern3 = new RegExp('\\d{0,6}\\.\\d{2,}(?!.*\\d{0,6}\\.\\d{2,})');

$.each(itemswithoutcoupons, function(index, el) {
	var matchedAmount = Number(pattern3.exec($(el).text()));
	if (matchedAmount > x) {
		$(el).hide();
	}
});


//function that allows to search for element text excluding children element
	$.fn.justtext = function() {
	    return $(this).clone()
	        .children()
	        .remove()
	        .end()
	        .text();
	};


function locateCommonParent(arg, searchterm){
	//Find closest/nearest common parent for elements that contain specific text
    //select elements that contain 'searchterm' excluding children's text
	var jq = $('*').filter(function() { return ($(this).justtext().search(searchterm) > -1); });

	// get first element of found elements
	var temp = $(arg[0]);
	//loop through each elements and add it's parents. Check whether new set of elements with parents added
	//contains each element in original jq
	jq.each(function () { 
	    temp = temp.parents().add(temp).has(this).last(); 
	});
	return temp;
}

//Alternative function from StackOverflow to find common parent of elements with no children
var matches = $('*').filter(function () {
     return !$(this).children().length && $(this).text() == "Sometext";
});

var commonparent = matches.first().parents().filter(function () {
    return $(this).find(matches).length == matches.length;
}).first();

//jQuery extension of the above functionality for a jQuery object contanining matched elements
$.fn.commonParents = function (){
    var cachedThis = this;
    return cachedThis.first().parents().filter(function () {
        return $(this).find(cachedThis).length === cachedThis.length;
    });
};

$.fn.commonParent = function (){
    return $(this).commonParents().first();
};

function filterDeals(searchtext, lowerlimit, upperlimit, freeflag){
	//setup defaults
	if(typeof(lowerlimit)==='undefined')  lowerlimit = Number.NEGATIVE_INFINITY;
	if(typeof(upperlimit)==='undefined')  upperlimit = Number.POSITIVE_INFINITY;
	if(typeof(freeflag)==='undefined')    freeflag = true; //default includes free items 
	//negative lookahead - find the last amount
	// var amountPattern = new RegExp('\\d{0,6}\\.\\d{2,}(?!.*\\d{0,6}\\.\\d{2,})','g');
	var amountPattern = new RegExp('\\d{0,6}\\.\\d{2,}','g');
	//find all deal elements
	var allDealElements = $('*').filter(function() { return ($(this).justtext().search(searchtext) > -1); });
	//setup array with unwantedDealElements
	var unwantedDealElements = [];
	//check each element and if amount is greater than filter, push to array
	$.each(allDealElements, function(index, el) {

		if 	($(el).text().match(/free/gi) === null) {

			// var matchedAmount = Number(amountPattern.exec($(el).text()));
			var matchedAmountArray = $(el).text().match(amountPattern);
			var matchedAmount = Number(matchedAmountArray[0]);
			if (matchedAmount > upperlimit || matchedAmount < lowerlimit) {
				unwantedDealElements.push(el);
			}
		}
		//add free items in the unwantedDealElements if freeflag is set to false
		else if ($(el).text().match(/\bfree\b/gi) !== null && !freeflag){
			unwantedDealElements.push(el);
		}
	});

	// //setup variable for outerElements - we want to hide the outer layer (element block) that contains complete deal
	var contentWrapper = [];
	$.each(unwantedDealElements, function(index, el){
		if ($(contentWrapper).has(el).length >0) {
			//logic that checks current contentWrapper and selects closest container for each element that needs to be hidden
			var currentWrapper = $(contentWrapper).has(el);
			//search for all inner elements within the current contentWrapper
			var innerElements = $(contentWrapper).has(el).find('*').filter(function() { return ($(this).justtext().search(searchtext) > -1); });
			//if currentWrapper is one of the commonParents and there more than one innerElements, traverse into children
			//This addresses deferent structure of DOM (i.e. subcategories) that would does not always pick the closest container. 
			while ($(currentWrapper).is($(innerElements).commonParents()) && innerElements.length > 1) {
				contentWrapper = $(el).children();
				currentWrapper = $(currentWrapper).children().has(el);
			}
			$(currentWrapper).hide();
		}
		else {
			var outerElements = $(el).parent().addBack().find('*').addBack();
			var outerElement = el;
			var i = 0;
			while ($(outerElements).filter(function() { return ($(this).justtext().search(searchtext) > -1)}).length == 1) {
				outerElement = $(outerElement).parent();
				outerElements = $(outerElements).parent().addBack().find('*').addBack();
			}
			//hide the complete container
			$(outerElement).hide();
			contentWrapper = $(outerElement).siblings();
		}	
	});

}

//This function determines element blocks from top to bottom
function filterDealsAlt(searchtext, lowerlimit, upperlimit, freeflag){
	//setup defaults
	if(typeof(lowerlimit)==='undefined')  lowerlimit = Number.NEGATIVE_INFINITY;
	if(typeof(upperlimit)==='undefined')  upperlimit = Number.POSITIVE_INFINITY;
	if(typeof(freeflag)==='undefined')    freeflag = true; //default includes free items 
	//negative lookahead - find the last amount
	// var amountPattern = new RegExp('\\d{0,6}\\.\\d{2,}(?!.*\\d{0,6}\\.\\d{2,})','g');
	var amountPattern = new RegExp('\\d{0,6}\\.\\d{2,}','g');
	//find all deal elements
	var allDealElements = $('*').filter(function() { return ($(this).justtext().search(searchtext) > -1); });
	//setup array with unwantedDealElements
	var unwantedDealElements = [];
	//check each element and if amount is greater than filter, push to array
	$.each(allDealElements, function(index, el) {

		if 	($(el).text().match(/free/gi) === null) {

			// var matchedAmount = Number(amountPattern.exec($(el).text()));
			var matchedAmountArray = $(el).text().match(amountPattern);
			var matchedAmount = Number(matchedAmountArray[0]);
			if (matchedAmount > upperlimit || matchedAmount < lowerlimit) {
				unwantedDealElements.push(el);
			}
		}
		//add free items in the unwantedDealElements if freeflag is set to false
		else if ($(el).text().match(/\bfree\b/gi) !== null && !freeflag){
			unwantedDealElements.push(el);
		}
	});

	// //setup variable for outerElements - we want to hide the outer layer (element block) that contains complete deal

	var contentWrapper = $(unwantedDealElements).commonParent();
	$.each(unwantedDealElements, function(index, el){
		var currentWrapper = contentWrapper;	
		var innerElementsLength = $(currentWrapper).find('*').filter(function() { return ($(this).justtext().search(searchtext) > -1)}).length;;
		while (innerElementsLength > 1) {
			currentWrapper = $(currentWrapper).children().has(el);
			innerElementsLength = $(currentWrapper).find('*').filter(function() { return ($(this).justtext().search(searchtext) > -1)}).length;
			}
		$(currentWrapper).hide();
		var wrapperClass = $(currentWrapper).attr('class');
		$(currentWrapper).siblings('[class="' + wrapperClass +'"]').filter(':not(:contains(' + searchtext +'))').hide();
	});

}

function filterDealsAlt2(searchtext, lowerlimit, upperlimit, freeflag){
	//setup defaults
	if(typeof(lowerlimit)==='undefined')  lowerlimit = Number.NEGATIVE_INFINITY;
	if(typeof(upperlimit)==='undefined')  upperlimit = Number.POSITIVE_INFINITY;
	if(typeof(freeflag)==='undefined')    freeflag = true; //default includes free items 
	//negative lookahead - find the last amount
	// var amountPattern = new RegExp('\\d{0,6}\\.\\d{2,}(?!.*\\d{0,6}\\.\\d{2,})','g');
	var amountPattern = new RegExp('\\d+(?:\\.\\d*)?|\\.\\d+', 'g')
	//var amountPattern = new RegExp('(\\d{0,6}(\\.\\d{1,2})?)','g');
	//find all deal elements
	var allDealElements = $('*').filter(function() { return ($(this).justtext().search(searchtext) > -1); });
	//setup array with unwantedDealElements
	var unwantedDealElements = [];
	//check each element and if amount is greater than filter, push to array
	$.each(allDealElements, function(index, el) {

		if 	($(el).text().match(/free/gi) === null) {

			// var matchedAmount = Number(amountPattern.exec($(el).text()));
			var matchedAmountArray = $(el).text().match(amountPattern);
			if (matchedAmountArray !== null){
				console.log(matchedAmountArray);
				var matchedAmount = Number(matchedAmountArray[0]);
				if (matchedAmount > upperlimit || matchedAmount < lowerlimit) {
					unwantedDealElements.push(el);
				}
			}
		}
		//add free items in the unwantedDealElements if freeflag is set to false
		else if ($(el).text().match(/\bfree\b/gi) !== null && !freeflag){
			unwantedDealElements.push(el);
		}
	});

	var searchRegex = new RegExp(searchtext, 'g');
	$.each(unwantedDealElements, function(index, el){
		currentwrapper = el
		while ($(currentwrapper).parent().text().match(searchRegex).length == 1){
				currentwrapper = $(currentwrapper).parent();
			}
		$(currentwrapper).hide();
		$(currentwrapper).siblings().not(':contains('+searchtext+')').hide();
	});

	var innerelements = $(allDealElements).commonParent();

	for (innerelements; innerelements.length <  allDealElements.length; innerelements = innerelements.children()){
		$(innerelements).not(':contains('+searchtext+')').hide();
	}
	$(innerelements).not(':contains('+searchtext+')').hide();

}


function resetDeals(searchtext){
	//find all deal elements that contain search text
	var allDealElements = $('*').filter(function() { return ($(this).justtext().search(searchtext) > -1); });
	
		$.each(allDealElements, function(index, el){
		var outerElements = $(el).parent().addBack().find('*').addBack();
		var outerElement = el;
		while ($(outerElements).filter(function() { return ($(this).justtext().search(searchtext) > -1)}).length == 1) {
			outerElement = $(outerElement).parent();
			outerElements = $(outerElements).parent().addBack().find('*').addBack();
		}
		//hide the complete
		$(outerElement).show();
	});
}

//CLIP SHOPRITE COUPONS
function myfunction(){
		var interval = null;

		jQuery(function(){
		  interval = setInterval(callFunc, 3000);
		});

		function callFunc(){
			if ($('input[value="Load To Card"]').length >0){
		  		$('input[value="Load To Card"]').click();

			}
			else {
				clearInterval(interval);
				if ($('a[title="Next Page"] span').length>0) {
					$('a[title="Next Page"] span').first().click();
				}
			}
		}
}


//AJAX Request, Replacing Contents, Callback Function
for (i=9, i<12, i++){
	url = "http://plan.shoprite.com/Coupons/"+i+" #CouponsList"
$.load( "http://plan.shoprite.com/Coupons/"+i+" #CouponsList", myfunction);
}






