(function($){
	
	$(function(){
		// onhover behavior
	  var set_onhover_class = function (elem, cssClass) {
	      if (!$(elem).hasClass('onhover')) {
	          $(elem).addClass('onhover');
	      }
	      $(elem).removeClass('hover').removeClass('active');
	      if (cssClass != null) {
	          $(elem).addClass(cssClass);
	      }
	  };
	  $('.onhover').live('mouseover mouseout mousedown mouseup', function (event) {
	      if (event.type == 'mouseover')
	          set_onhover_class(this, 'hover');
	      else if (event.type == 'mouseout')
	          set_onhover_class(this, null);
	      else if (event.type == 'mousedown')
	          set_onhover_class(this, 'active');
	      else if (event.type == 'mouseup')
	          set_onhover_class(this, 'hover');
	  });
	  //
	
	});
})(jQuery);