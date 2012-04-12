/**
 * Clickcyclist
 * AJAX-based jquery slideshow plugin
 *
 * Expects a JSON RESTish API where we can call the following:
 *
 * 		BASEURL/fetch?count=10&start=0 // Per-page and item offset.
 * 		Eg, count=10&offset=1 would give up to 10 items (less if end is reached), starting on the second item (item 1)
 * 			=> [ { field: value, field: value} ]
 * 		BASEURL/count
 * 			=> 123 // TOTAL ITEMS AVAILABLE
 *
 * The results returned from the RESTish /fetch command will be used to create HTML using a template.
 * By default a Mustache template with the ID of #slide is used.  This can be altered by passing the template variable into options.
 *
 * Your template should look something like the following:  (see index.html for an example)
 *
 *	 <script type="text/html" id="slide">
 *	 	<h2>{{ title }}</h2>
 *	 	<p><img src="{{ bannerImage }}" /><br/>
 *		 	{{ content }}
 *	 	</p>
 *	 </script>
 *
 * Usage:
 *
 * 		$('mydiv').cyclist({
 * 			perPage: 12,
 * 			template: 'mydiv_template',
 * 			baseURL: 'http://mysite.example.com/slideshowapi/'	
 * 		});
 *
 * 		$('mydiv').cyclist('next'); // manually show next slide
 * 		$('mydiv').cyclist('prev'); // manually show previous slide
 *
 * External code:
 *   Uses ICanHazJS for templating: http://icanhazjs.com/
 */
(function($) {
	$.fn.cyclist = function(options) {
		// Default options
		var defaults = {
			perPage:		10,		// How many items to request from AJAX at once
			baseURL:		null,	// AJAX baseURL, must be set in options or provided in data-baseurl attribute
			start:			0,		// Offset for start of paging queries.
			template:		'slide',// Template identifier for use with Mustache templates.
		};
	
		function initialize(T, data) {
			T.addClass('cyclist');
			T.css({position: 'relative', overflow: 'hidden'});
			var baseURL = options.baseURL || T.data('baseurl');
			data = {
				items:		null,
				baseURL:	baseURL,
				index:		0,
				nItems:		0,
				root:		T[0],
				pane:		null
			};
			// use localstorage if jStorage found
			if ($.jStorage) {
				tdata = $.jStorage.get('clickcyclist.data');
				if (tdata) {
					data = tdata;
				}
			}
			T.data('cyclist', data);
			T.html('<div class="A" style="position: absolute; left: 0; top: 0; z-index: 10"></div><div class="B" style="position: absolute; left: 0; top: 0; z-index:0;"></div>');
			data.pane = $('div.A', T);
			if (data.items && data.items.length) {
				loadNew(T, data, ich[options.template](data.items[data.index]), {enabled: false});
				return;
			}
			$.getJSON(baseURL + '/count', function(count, status, xhr) {
				T.data('cyclist').nItems = count;
				$.getJSON(baseURL + '/fetch?limit=' + options.perPage + '&start=' + options.start , function(items, status, xhr) {
					data.items = items;
					if (data.items && data.items.length) {
						loadNew(T, data, ich[options.template](data.items[data.index]), {enabled: false});
					}
				});
			});
		}

		function loadNew(T, data, htmlData, anim) {
			var elts = getAnimPair(data, T);
			elts[0].stop(true, true);
			elts[1].stop(true, true);
			var ht = T.width();
			var defaults = {
				prop: 'left',
				margin: 10,
				direction: 1,
				enabled: true
			};
			if (typeof(anim) == 'undefined') {
				anim = defaults;
			} else {
				anim = $.extend(defaults, anim);
			}
			var prop = anim.prop || 'left';
			var newd = {init: anim.direction * (ht+anim.margin), final: 0},
				oldd = {final: -anim.direction * (ht+anim.margin)};
			elts[0].html(htmlData);
			elts[0].css(prop, newd.init);
			var newcm = {}; newcm[prop] = newd.final;
			var oldcm = {}; oldcm[prop] = oldd.final;
			data.pane = elts[0][0].className;
			if (anim.enabled) {
				elts[1].animate(oldcm, {duration: 1000, queue: false});
				elts[0].animate(newcm, {duration: 1000, queue: false});
			} else {
				elts[1].css(oldcm);
				elts[0].css(newcm);
			}
			// use localstorage if jStorage found
			if ($.jStorage) {
				console.log(data);
				$.jStorage.set('clickcyclist.data', data);
			}
		}

		function getAnimPair(data, T) {
			var A = $('div.A', T);
			var B = $('div.B', T);
			if (data.pane == 'A') {
				return [B,A];
			} else {
				return [A,B];
			}
		}

		function addPagerButtons(T) {
			T.append('<a href="#" id="cyclist-prev" title="Previous" class="cyclist pager">&lt;</a>');
			T.append('<a href="#" id="cyclist-next" title="Next" class="cyclist pager">&gt;</a>');
			$('a.cyclist.pager', T).click( function(e) {
				e.preventDefault();
				var T=$(this);
				var C = T.parents('div.cyclist:first');
				var cmdID = T.attr('id').replace(/^cyclist-/, '');
				C.cyclist(cmdID);
			});
		}

		function method_prev(data) {
			var i = data.index;
			// TODO: Option for cycle to start, or stop at end?
			if (--i < 0) {
				i = data.nItems - 1;
			}
			if (i >= data.items.length) {
				//console.error('index >= loaded length', "This shouldn't happen with pre-loading!", data);
				return;
			}
			data.index = i;
			loadNew( T, data, ich[options.template](data.items[i]), {
				direction: -1
			});
		}

		function method_next(data) {
			var i = data.index;
			// TODO: Option for cycle to start, or stop at end?
			if (++i >= data.nItems) {
				i = 0;
			}
			if (i >= data.items.length) {
				//console.error('index >= loaded length', "This shouldn't happen with pre-loading!", data);
				return;
			}
			data.index = i;
			loadNew( T, data, ich[options.template](data.items[i]) );
		}
		// END OF METHODS
		// BEGIN main logic

		var func = null;
		var methods = {
			'prev':		method_prev,
			'next':		method_next,
		};

		if (typeof(options) == 'string') {
			// treat this as a function call instead
			func = options;
			if (func in methods) {
				func = methods[func];
			} else {
				func = null;
			}
			options = {};
		}

		options = $.extend(defaults, options);
		var T = $(this);

		return this.each(function() {
			var data = T.data('cyclist');
			if (!data) {
				initialize.apply(this, [T]);
				addPagerButtons(T);
			}
			if (func) {
				func.apply(T, [data]);
			}
		});
	};
})(jQuery);
