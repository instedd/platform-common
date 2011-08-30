(function($){	
	$(function(){
		// initialize built-in components.
		$(".ux-datepicker").datepicker();
		$("input[type='text']").addClass("ux-text");
		$("textarea").addClass("ux-text");
		$("input[readonly='readonly'], textarea[readonly='readonly']").addClass("readonly");
		$(".ux-dropdown select").addClass("styled");
		$("input[type='radio']").addClass("styled");
		$("input[type='checkbox']").addClass("styled");
		$("button[disabled]").addClass("disabled");
		
		$(".ux-nstep").each(function(){
			var nstep = $(this);
			var source = $("input[type='text']", nstep);
			var kdown = $("<input>").attr('type','button').addClass('kdown').val('');
			var kup = $("<input>").attr('type','button').addClass('kup').val('');
			nstep.append(kdown).append(kup);
			var current = function(){
				var res = parseInt(source.val());
				return isNaN(res) ? 0 : res;
			};
			kdown.click(function(){ source.val(current()-1); });
			kup.click(function(){ source.val(current()+1); });
		});
	});
})(jQuery);