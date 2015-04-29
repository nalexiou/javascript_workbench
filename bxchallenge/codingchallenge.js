//The javascript snippet below requires the jQuery library ("1.11.2")

//declare snippet variables

var cartPage, cartItemCount, cartTotal, cartImageList, cartURL = 'http://www.rachelcomey.com/checkout/cart/';

//ajax request of cart page
jQuery.get( cartURL, function() {
  console.log( 'Cart page request initiated.' );
})
  .done(function(data) {
    cartPage = data;
    extractData();
    buildModal();
    setupListeners();
  })
  .fail(function() {
    console.log( 'Cart page request error.' );
  })
    .always(function() {
    console.log( 'Cart page request finished.' );

  });


function extractData() {

	var shoppingBagText = jQuery('a.top-link-cart', cartPage).text();
	var cartRegexp = /shopping bag.*\((\d+)\)/i;
	var match;

	//set cartItemCount if match is found
	if ((match = cartRegexp.exec(shoppingBagText)) !== null) {
		cartItemCount = match[1];
	}
	//locate cart totals table and extract total price
	cartTotal = jQuery('#shopping-cart-totals-table td:contains("Total")', cartPage).next().text().strip();
	//collect image elements in shopping cart table
	cartImageList = jQuery('#shopping-cart-table img', cartPage);
}

function buildModal() {
	//Use divs to build Modal
	jQuery('body').append( '<div id="myContainer"></div>' );
	jQuery('#myContainer').append( '<div id="myModal"></div>' );
	jQuery('#myContainer').append( '<div id="myLightbox"></div>');
	jQuery('#myContainer').hide();

	if (cartItemCount > 0) {
		jQuery('#myModal').append('<br><p>Total items in shopping bag: ' + cartItemCount+'<p><br>');
		jQuery('#myModal').append('<p>Shopping Total: ' + cartTotal+'<p><br>');
		jQuery('#myModal').append('<div id="myImages"></div>');
		jQuery.each(cartImageList, function(i, val) {
			var paddedimage = jQuery(val).css('padding', '10px');
			jQuery('#myImages').append(paddedimage);
		});
		jQuery('#myImages').css(
			{'height': '300px',
		    'overflow-y': 'scroll',
		    'overflow-x': 'hidden'
			});
	}
	else {
			jQuery('#myModal').append('<br><br><p>You have no items in your shopping bag.<p>');
	}

	jQuery('#myModal').append('<br><button id="myclosebutton" type="button" title="CLOSE" class="button"><span><span>CLOSE</span></span></button>');
	jQuery('#myModal').append( '<button id="mycartbutton" type="button" title="VIEW CART" class="button" onclick="setLocation(&quot;' + cartURL + '&quot;)"><span><span>VIEW CART</span></span></button>');

	//modal box with fixed size
	jQuery('#myModal').css(

		{'width': '400px',
	    'height': '400px',
	    'position': 'fixed',
	    'top': '50%',
	    'left': '50%',
	    'margin-left': '-200px',
	    'margin-top': '-200px',
	    'background-color': 'white',
	    'z-index': '9999'
		});
	//transparent overlay background
	jQuery('#myLightbox').css(

		{
		'position': 'fixed',
	    'top': '0',
	    'left': '0',
	    'height': '100%',
	    'width': '100%',
	    'background-color': 'black',
	    'z-index': '9998',
	    'opacity': '.8'
		});

	jQuery('#myclosebutton').css(	
		{
	    'position': 'absolute',
	    'bottom': '5px',
	    'left': '5px'
		});

	jQuery('#mycartbutton').css(	
		{
	    'position': 'absolute',
	    'bottom': '5px',
	    'right': '5px'
		});
}

function setupListeners(){

	if (jQuery('#header-account').length){ //check if user is logged in

		jQuery('#myclosebutton').on('click', function(){
			jQuery('#myContainer').hide();
			window.scrollTo(0, 0);
		});

		jQuery(window).on('scroll', function(){
			//check if user has scrolled to 10% of the bottom of the page
			   if (jQuery(window).scrollTop() >= (jQuery(document).height() - jQuery(window).height() - (jQuery(document).height() * 0.1))) {
						if (!jQuery('#myContainer').is('visible')){
							jQuery('#myContainer').show();
						}
		   		}
		});
	}
}