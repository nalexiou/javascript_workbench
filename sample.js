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









