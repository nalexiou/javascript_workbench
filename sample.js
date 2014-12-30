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
