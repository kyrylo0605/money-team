'use strict';

svg4everybody();

(function() {
	var iterate = function iterate(items, callback) {
		items.forEach(function(item) {
			var key = void 0;
			var value = void 0;

			if (typeof item === 'string') {
				key = item;
				value = item;
			} else {
				key = item[0];
				value = item[1];
			}

			callback(key, value);
		});
	};

	var check = function check(category, items) {
		iterate(items, function(key, value) {
			if (bowser[key]) {
				document.documentElement.classList.add('is-' + category + '-' + value);
			}
		});
	};

	check('engine', ['blink', 'gecko', ['msedge', 'edge'],
		['msie', 'ie'], 'webkit'
	]);

	check('device', ['mobile', 'tablet']);

	check('browser', ['android', 'bada', 'blackberry', 'chrome', 'firefox', 'ios', 'kMeleon', ['msedge', 'edge'],
		['msie', 'ie'], 'opera', 'phantom', 'qupzilla', 'safari', 'sailfish', ['samsungBrowser', 'samsung'], 'seamonkey', 'silk', 'sleipnir', 'tizen', 'ucbrowser', 'vivaldi', 'webos', ['yandexbrowser', 'yandex']
	]);

	check('os', ['android', 'bada', 'blackberry', 'chromeos', 'firefoxos', 'ipad', 'iphone', 'ipod', 'ios', 'linux', 'mac', 'windows', 'windowsphone', 'sailfish', 'tizen', 'webos']);
})();

var $window = $(window);
var $document = $(document);
var $html = $(document.documentElement);
var $body = $(document.body);

var windowWidth = $(window).width();

$(document).ready(function() {
	// шапка
	/* hamburger */
	$('body').on('click', '.js-top-hamburger', function(e) {
		if ($('.js-top-hamburger').is('.is-active:not(.is-back)')) {

			$('.js-top-hamburger').addClass('is-back');
		} else if ($('.js-top-hamburger').is('.is-back')) {

			$('.js-top-hamburger').removeClass('is-back');
		} else {
			$('.js-top-hamburger').addClass('is-active');
		}

		$('body').toggleClass('is-blur');
		$('.js-tpl-menu').toggleClass('is-open');

		return false;
	}).keydown(function(event) {
		if (event.keyCode == 27) {

			if ($('.js-top-hamburger').hasClass('is-active')) {
				$('.js-top-hamburger')[0].click();
			}
		}
	});

	fixedPositionHeader();
	$(window).scroll(function() {
		fixedPositionHeader();
	});

	function fixedPositionHeader() {
		var blockHeader = $(".js-fixed-header");
		var headerHeight = blockHeader.outerHeight();
		var top = $(window).scrollTop();

		if (top < blockHeader.height()) {

			if ($('.js-fullpage-section').length > 0) {
				$('.js-fullpage-section .fp-tableCell').css('paddingTop', 0);
			} else {
				$('.all-wrap').css('paddingTop', 0);
			}

			blockHeader.removeClass('is-fixed');
		} else if (!blockHeader.hasClass('is-fixed')) {
			blockHeader.addClass('is-fixed');
			headerHeight = 74;

			if ($('.js-fullpage-section').length > 0 && $(window).height() >= 768 && $(window).height() <= 1100) {
				$('.js-fullpage-section .fp-tableCell').css('paddingTop', headerHeight);
			} else {
				$('.all-wrap').css('paddingTop', 0);
			}
		}
	}
	// слайдеры
	var timeoutAutoScroll = null;
	var fullpage = void 0;

	if ($('.js-fullpage-slider').length > 0) {
		var fullpageOptions = {
			css3: true,
			scrollingSpeed: 1500,
			scrollBar: true,
			navigation: false,
			slidesNavigation: true,
			slidesNavPosition: 'left',
			controlArrows: false,

			sectionSelector: '.js-fullpage-section',
			slideSelector: '.js-fullpage-slide',

			normalScrollElements: '.js-fullpage-normal-scroll',

			onLeave: function onLeave(index, nextIndex, direction) {
				if ($('.js-home-slider video').length > 0) {
					$('.js-home-slider video')[0].play();
				}
			},

			afterLoad: function afterLoad(origin, destination, direction) {
				$('.js-fullpage-section').each(function() {
					if ($(this).find('.fp-tableCell').outerHeight() > $(window).height()) {
						$(this).addClass('js-fullpage-normal-scroll');
					} else {
						$(this).removeClass('js-fullpage-normal-scroll');
					}
				});

				// колесо
				var elemsScroll = document.querySelectorAll('.js-fullpage-normal-scroll');
				var i = 0;

				for (; i < elemsScroll.length; i++) {
					var elem = elemsScroll[i];

					if (elem.addEventListener) {
						if ('onwheel' in document) {
							// IE9+, FF17+, Ch31+
							elem.addEventListener("wheel", onWheel);
						} else if ('onmousewheel' in document) {
							// устаревший вариант события
							elem.addEventListener("mousewheel", onWheel);
						} else {
							// Firefox < 17
							elem.addEventListener("MozMousePixelScroll", onWheel);
						}
					} else {
						// IE8-
						elem.attachEvent("onmousewheel", onWheel);
					}
				}
			}
		};

		if ($(window).height() >= 768 && $(window).height() <= 1100) {
			fullpage = $('.js-fullpage-slider').fullpage(fullpageOptions);
		} else {
			$('.js-fullpage-section.home__section_start, .js-fullpage-section.home__section_mission').each(function() {
				$(this).css({
					height: $(window).height()
				});
			});
		}

		if ($('.js-parallax').length > 0) {
			// parallax
			$('.js-parallax').each(function() {
				var $bgobj = $(this);

				$(window).scroll(function() {
					var scrollTop = $(window).scrollTop();

					if ($bgobj.closest('.js-parallax-viewport').length > 0) {
						var viewportTop = $bgobj.closest('.js-parallax-viewport').offset().top;

						if (scrollTop + $(window).height() / 2 < viewportTop) {
							scrollTop = 0;
						} else {
							scrollTop -= viewportTop - $(window).height() / 2;
						}
					}

					var yPos = -scrollTop / $bgobj.data('speed'); // вычисляем коэффициент
					var transform = yPos + 'px';

					if (Math.abs(Math.abs(parseInt(yPos)) - Math.abs(parseInt($bgobj.attr('data-offset')))) < 50) {
						// Создаем эффект Parallax Scrolling
						$bgobj.css({
							transform: 'translateY(' + transform + ')'
						});
					}

					$bgobj.attr('data-offset', parseInt(yPos));
				});
			});
		}

		$(window).resize(function() {
			if (typeof $.fn.fullpage != "undefined" && fullpage) {
				if (windowWidth != $(window).width()) {
					if ($(window).height() < 768 || $(window).height() > 1100) {
						fullpage.destroy('all');
					} else {
						if (!$('.js-fullpage-slider').hasClass('fullpage-wrapper')) {
							fullpage = $('.js-fullpage-slider').fullpage(fullpageOptions);
						}
					}
				}
			}

			windowWidth = $(window).width();
		});
	}

	function onWheel(e) {
		e = e || window.event;

		// wheelDelta не дает возможность узнать количество пикселей
		var delta = e.deltaY || e.detail || e.wheelDelta;

		if (delta != 0) {
			var $section = $(e.target).closest('.js-fullpage-section');

			// down
			if (delta > 0) {
				if ($section.hasClass('active') && $section.offset().top + $section.outerHeight() - 100 <= $(window).scrollTop() + $(window).height()) {
					$.fn.fullpage.moveSectionDown();
				}
				// up
			} else if (delta < 0) {
				if ($section.hasClass('active') && $section.offset().top + 100 >= $(window).scrollTop()) {
					$.fn.fullpage.moveSectionUp();
				}
			}
		}
	}
	// слайдеры

	// fullpage на главной
	if ($('.js-home-slider').length > 0) {
		$('.js-home-slider').append('<div class="slick-arrow slick-prev">' + '<svg><use xlink:href="images/sprites.svg#arrow-left"></use></svg>' + '<svg><use xlink:href="images/sprites.svg#arrow-left"></use></svg>' + '<svg><use xlink:href="images/sprites.svg#arrow-left"></use></svg>' + '</div>');

		$('.js-home-slider').append('<div class="slick-arrow slick-next">' + '<svg><use xlink:href="images/sprites.svg#arrow-right"></use></svg>' + '<svg><use xlink:href="images/sprites.svg#arrow-right"></use></svg>' + '<svg><use xlink:href="images/sprites.svg#arrow-right"></use></svg>' + '</div>');

		$('.js-home-slider').append('<div class="slick-dots"></div>');

		var swiper = new Swiper('.js-home-slider.swiper-container', {
			navigation: {
				nextEl: '.slick-next',
				prevEl: '.slick-prev'
			},
			pagination: {
				el: '.slick-dots',
				clickable: true
			}
			/*autoplay: {
			    delay: 10000,
			    disableOnInteraction: false,
			},*/
		});

		if ($('.home-slider__content').length > 0) {
			setTimeout(function() {
				$('.home-slider__content').addClass('is-visible');
			}, 300);
		}

		if ($('.js-home-slider video').length > 0) {
			$('.js-home-slider video')[0].play();
		}

		$(window).resize(function() {
			if ($('.js-home-slider video').length > 0) {
				$('.js-home-slider video')[0].play();
			}
		});
	}

	// слайдер товаров в каталоге
	if ($('.js-catalog-slider').length > 0) {

		$('.js-catalog-slider').parent().append('<div class="slick-arrow slick-prev">' + '<svg><use xlink:href="images/sprites.svg#arrow-left"></use></svg>' + '<svg><use xlink:href="images/sprites.svg#arrow-left"></use></svg>' + '<svg><use xlink:href="images/sprites.svg#arrow-left"></use></svg>' + '</div>');

		$('.js-catalog-slider').parent().append('<div class="slick-arrow slick-next">' + '<svg><use xlink:href="images/sprites.svg#arrow-right"></use></svg>' + '<svg><use xlink:href="images/sprites.svg#arrow-right"></use></svg>' + '<svg><use xlink:href="images/sprites.svg#arrow-right"></use></svg>' + '</div>');

		var swiper = new Swiper('.js-catalog-slider', {
			navigation: {
				nextEl: '.slick-next',
				prevEl: '.slick-prev'
			},
			slidesPerView: 4,
			slidesPerColumn: 2,
			spaceBetween: 0,

			breakpoints: {
				1300: {
					slidesPerView: 3,
					slidesPerColumn: 2
				},
				768: {
					slidesPerView: 2,
					slidesPerColumn: 2
				},
				640: {
					slidesPerView: 2,
					slidesPerColumn: 1
				},
				480: {
					slidesPerView: 1,
					slidesPerColumn: 1
				}
			}
		});
	}

	// галерея фото - открыть по ссылке
	$('.js-open-mission-gallery').click(function(e) {
		e.preventDefault();

		$('.js-close-mission-gallery').parent().removeClass('is-active');
		$(this).parent().addClass('is-active');

		$('.js-mission-gallery').addClass('is-open');
		$('.js-mission-content').addClass('is-close');

		if ($('.gallery-item').length > 0) {
			$('.gallery-item').css({
				'height': $('.gallery').outerHeight() / 2
			});

			$(window).resize(function() {
				$('.gallery-item').css({
					'height': $('.gallery').outerHeight() / 2
				});
			});
		}

		return false;
	});

	// галерея фото - закрыть по ссылке
	$('.js-close-mission-gallery').click(function(e) {
		e.preventDefault();

		$('.js-open-mission-gallery').parent().removeClass('is-active');
		$(this).parent().addClass('is-active');
		$('.js-mission-gallery').removeClass('is-open');
		$('.js-mission-content').removeClass('is-close');

		return false;
	});

	// галерея фото - Миссия на главной
	if ($('.js-gallery-slider').length > 0) {
		$('.js-gallery-slider').slick({
			slidesToScroll: 1,
			dots: false,
			customPaging: function customPaging(slider, i) {
				return '';
			},
			arrows: true,
			prevArrow: '<div class="slick-arrow slick-prev"><svg><use xlink:href="images/sprites.svg#arrow-left"></use></svg></div>',
			nextArrow: '<div class="slick-arrow slick-next"><svg><use xlink:href="images/sprites.svg#arrow-right"></use></svg></div>',
			infinite: true,
			speed: 300,
			variableWidth: true,
			centerMode: true,
			lazyLoad: 'ondemand'
		});
	}

	// превью фото товара
	if ($('.js-product-images-preview-slider').length > 0) {
		var onPreviewWheel = function onPreviewWheel(e) {
			e = e || window.event;

			// wheelDelta не дает возможность узнать количество пикселей
			var delta = e.deltaY || e.detail || e.wheelDelta;

			if (delta < 0) {
				$('.js-product-images-preview-slider').slick('slickPrev');
			} else if (delta > 0) {
				$('.js-product-images-preview-slider').slick('slickNext');
			}

			e.preventDefault ? e.preventDefault() : e.returnValue = false;
		};

		$('.js-product-images-preview-slider').slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			dots: false,
			customPaging: function customPaging(slider, i) {
				return '';
			},
			arrows: false,
			prevArrow: '<div class="slick-arrow slick-prev"><svg><use xlink:href="images/sprites.svg#arrow-left"></use></svg></div>',
			nextArrow: '<div class="slick-arrow slick-next"><svg><use xlink:href="images/sprites.svg#arrow-right"></use></svg></div>',
			infinite: false,
			speed: 300,
			variableWidth: false,
			vertical: true,
			verticalSwiping: true,
			responsive: [{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					variableWidth: false,
					vertical: false,
					verticalSwiping: false
				}
			}, {
				breakpoint: 820,
				settings: {
					slidesToShow: 2,
					variableWidth: false,
					vertical: true,
					verticalSwiping: true
				}
			}, {
				breakpoint: 640,
				settings: {
					slidesToShow: 2,
					variableWidth: false,
					vertical: false,
					verticalSwiping: false
				}
			}]
		});

		// колесо
		var elem = document.querySelector('.js-product-images-preview-slider');
		if (elem.addEventListener) {
			if ('onwheel' in document) {
				// IE9+, FF17+, Ch31+
				elem.addEventListener("wheel", onPreviewWheel);
			} else if ('onmousewheel' in document) {
				// устаревший вариант события
				elem.addEventListener("mousewheel", onPreviewWheel);
			} else {
				// Firefox < 17
				elem.addEventListener("MozMousePixelScroll", onPreviewWheel);
			}
		} else {
			// IE8-
			elem.attachEvent("onmousewheel", onPreviewWheel);
		}
	}

	new WOW().init();

	if ($("[data-gallery] .magnificGalleryPopup").length > 0) {
		$('[data-gallery]').each(function() {
			$(this).magnificPopup({
				delegate: 'div:not(.slick-cloned) > .magnificGalleryPopup',
				type: 'image',
				image: {
					//titleSrc: function(item) { return ''; },
				},
				gallery: {
					enabled: true,
					tPrev: 'Предудущее',
					tNext: 'Следующее',
					tCounter: '<span class="mfp-counter">%curr% из %total%</span>'
				},
				mainClass: 'mfp-fade'
			});
		});
	}

	if ($(".magnificVideoPopup").length > 0) {
		$('.magnificVideoPopup').magnificPopup({
			type: 'iframe',
			iframe: {
				patterns: {
					youtube: {
						index: '',
						id: function id(url) {
							var indexId = url.lastIndexOf('/');
							return url.substring(indexId);
						},
						src: '//www.youtube.com/embed%id%?autoplay=1'
					}
				}
			}
		});
	}

	if ($('.input-placeholder').length > 0) {
		$('.input-placeholder').each(function() {
			var $placeholder = $(this);

			$placeholder.find('input, textarea, select').change(function() {
				if ($(this).val() != '') {
					$(this).closest('.input-placeholder').addClass('is-value');
				} else {
					$(this).closest('.input-placeholder').removeClass('is-value');
				}
			});

			if ($placeholder.find('input, textarea, select').val() != '') {
				$(this).addClass('is-value');
			} else {
				$(this).removeClass('is-value');
			}
		});
	}

	$('body')
		// открытие информации на десктоп по наведению - по клику на мобильных
		.on('click', '.js-hover-block', function() {
			if ($('html').hasClass('is-device-mobile') || $('html').hasClass('is-device-tablet')) {
				$('.js-hover-block').not(this).removeClass('is-open');
				$(this).toggleClass('is-open');

				return false;
			}
		})
		// пагинация lazy-loader
		.on('click', '.js-pagination-lazy-loader a', function(e) {
			e.preventDefault();
		}).on('click', '.js-pagination-lazy-loader', function(e) {
			e.stopPropagation();

			var $loader = $(this);

			$loader.addClass('is-loader');

			// TO DO - аякс загрузка новых товаров, вместо таймаут
			setTimeout(function() {
				$('.catalog__items-inner').append($('.catalog__items-inner').html());
				$loader.removeClass('is-loader');
			}, 1000);
		});

	$('.js-product-images-preview a').on('click', function(e) {
		e.preventDefault();

		var $selectedPreview = $(this);
		var $bigImage = $('.js-product-images-big');

		if ($bigImage.length < 1) {
			return;
		}

		$selectedPreview.addClass('is-active').siblings().removeClass('is-active');
		$bigImage.attr('src', $(this).attr('href'));

		return false;
	});

	// размер изображения в товаре
	productImageResize();
	$(window).resize(function() {
		productImageResize();
	});

	if ($('.js-parallax').length > 0) {
		// parallax
		$('.js-parallax').each(function() {
			var $bgobj = $(this);

			$(window).scroll(function() {
				var scrollTop = $(window).scrollTop();

				if ($bgobj.closest('.js-parallax-viewport').length > 0) {
					var viewportTop = $bgobj.closest('.js-parallax-viewport').offset().top;

					if (scrollTop + $(window).height() / 2 < viewportTop) {
						scrollTop = 0;
					} else {
						scrollTop -= viewportTop - $(window).height() / 2;
					}
				}

				var yPos = -scrollTop / $bgobj.data('speed'); // вычисляем коэффициент
				var transform = yPos + 'px';
				// Создаем эффект Parallax Scrolling
				$bgobj.css({
					transform: 'translateY(' + transform + ')'
				});
			});
		});
	}

	// карта в подвале

	/* map */
	var markers = [];

	if ($('#footer-map').length > 0) {
		var map = void 0;

		if (google !== undefined) {
			var initMap = function initMap() {
				map = new google.maps.Map(document.getElementById('footer-map'), {
					center: {
						lat: 37.118944,
						lng: -128.142917
					},
					zoom: 2,
					disableDefaultUI: false,
					disableDoubleClickZoom: false,
					draggable: true,
					fullscreenControl: false,
					keyboardShortcuts: false,
					panControl: false,
					scrollwheel: false
				});

				/*marker = new google.maps.Marker({
				    position: coordinates,
				    map: map
				});*/
				var iconBase = '/images/sprites/';
				var icons = {
					info: {
						icon: iconBase + 'marker.svg'
					}
				};

				var features = [{
					position: new google.maps.LatLng(57.573117, 49.770054),
					content: '<div class="map-baloon__title">TMT RUSSIA</div>' + '<div class="map-baloon__content">' + '<a class="map-baloon__instagram" href="https://www.instagram.com/themoneyteamshop/" target="_blank"><svg><use xlink:href="images/sprites.svg#instagram"></use></svg>OPEN INSTAGRAM</a>' + '</div>',
					type: 'info'
				}, {
					position: new google.maps.LatLng(24.248561, 49.277894),
					content: '<div class="map-baloon__title">TMT</div>' + '<div class="map-baloon__content">' + '<a class="map-baloon__instagram" href="https://www.instagram.com/themoneyteamshop/" target="_blank"><svg><use xlink:href="images/sprites.svg#instagram"></use></svg>OPEN INSTAGRAM</a>' + '</div>',
					type: 'info'
				}, {
					position: new google.maps.LatLng(-33.91747, 151.22912),
					content: '<div class="map-baloon__title">TMT</div>' + '<div class="map-baloon__content">' + '<a class="map-baloon__instagram" href="https://www.instagram.com/themoneyteamshop/" target="_blank"><svg><use xlink:href="images/sprites.svg#instagram"></use></svg>OPEN INSTAGRAM</a>' + '</div>',
					type: 'info'
				}];

				var _loop = function _loop(i) {
					var marker = new google.maps.Marker({
						position: features[i].position,
						icon: icons[features[i].type].icon,
						map: map,
						content: features[i].content
					});

					markers.push(marker);

					google.maps.event.addListener(markers[i], "click", function(e) {
						this.setMap(null);

						var infoBox = new InfoBox({
							latlng: this.position,
							map: map,
							content: this.content,
							marker: i
						});
					});
				};

				for (var i = 0; i < features.length; i++) {
					_loop(i);
				}

				$.getJSON('/js/googleMapStyle.json', function(data) {
					map.setOptions({
						styles: data
					});
				});
			};

			initMap();
		}
	}

	/* An InfoBox is like an info window, but it displays
	 * under the marker, opens quicker, and has flexible styling.
	 * @param {GLatLng} latlng Point to place bar at
	 * @param {Map} map The map on which to display this InfoBox.
	 * @param {Object} opts Passes configuration options - content,
	 * offsetVertical, offsetHorizontal, className, height, width
	 */

	function InfoBox(opts) {
		google.maps.OverlayView.call(this);
		this.latlng_ = opts.latlng;
		this.map_ = opts.map;
		this.marker_ = opts.marker;
		this.content = opts.content;
		this.offsetVertical_ = 0;
		this.offsetHorizontal_ = -85;
		this.height_ = 'auto';
		this.width_ = 170;
		var me = this;
		this.boundsChangedListener_ = google.maps.event.addListener(this.map_, "bounds_changed", function() {
			return me.panMap.apply(me);
		});
		// Once the properties of this OverlayView are initialized, set its map so
		// that we can display it. This will trigger calls to panes_changed and
		// draw.
		this.setMap(this.map_);
	}
	/* InfoBox extends GOverlay class from the Google Maps API
	 */
	InfoBox.prototype = new google.maps.OverlayView();
	/* Creates the DIV representing this InfoBox
	 */
	InfoBox.prototype.remove = function() {
		if (this.div_) {
			this.div_.parentNode.removeChild(this.div_);
			this.div_ = null;
		}
	};
	/* Redraw the Bar based on the current projection and zoom level
	 */
	InfoBox.prototype.draw = function() {
		// Creates the element if it doesn't exist already.
		this.createElement();
		if (!this.div_) return;
		// Calculate the DIV coordinates of two opposite corners of our bounds to
		// get the size and position of our Bar
		var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
		if (!pixPosition) return;
		// Now position our DIV based on the DIV coordinates of our bounds
		this.div_.style.width = this.width_ + "px";
		this.div_.style.left = pixPosition.x + this.offsetHorizontal_ + "px";
		this.div_.style.height = this.height_ + "px";
		this.div_.style.top = pixPosition.y + this.offsetVertical_ + "px";
		this.div_.style.display = 'block';
	};
	/* Creates the DIV representing this InfoBox in the floatPane. If the panes
	 * object, retrieved by calling getPanes, is null, remove the element from the
	 * DOM. If the div exists, but its parent is not the floatPane, move the div
	 * to the new pane.
	 * Called from within draw. Alternatively, this can be called specifically on
	 * a panes_changed event.
	 */
	InfoBox.prototype.createElement = function() {
		var panes = this.getPanes();
		var div = this.div_;

		if (!div) {
			var removeInfoBox = function removeInfoBox(ib) {
				return function() {
					markers[ib.marker_].setMap(ib.map);
					ib.setMap(null);
				};
			};

			// This does not handle changing panes. You can set the map to be null and
			// then reset the map to move the div.
			div = this.div_ = document.createElement("div");
			div.className = "map-baloon";
			var contentDiv = document.createElement("div");
			contentDiv.className = "map-baloon__block";
			contentDiv.innerHTML = this.content;
			var closeBox = document.createElement("div");
			closeBox.className = "map-baloon__close";
			closeBox.innerHTML = "&times;";
			contentDiv.appendChild(closeBox);

			google.maps.event.addDomListener(closeBox, 'click', removeInfoBox(this));
			div.appendChild(contentDiv);
			div.style.display = 'none';
			panes.floatPane.appendChild(div);
			this.panMap();
		} else if (div.parentNode != panes.floatPane) {
			// The panes have changed. Move the div.
			div.parentNode.removeChild(div);
			panes.floatPane.appendChild(div);
		} else {
			// The panes have not changed, so no need to create or move the div.
		}
	};
	/* Pan the map to fit the InfoBox.
	 */
	InfoBox.prototype.panMap = function() {
		// if we go beyond map, pan map
		var map = this.map_;
		var bounds = map.getBounds();
		if (!bounds) return;
		// The position of the infowindow
		var position = this.latlng_;
		// The dimension of the infowindow
		var iwWidth = this.width_;
		var iwHeight = this.height_;
		// The offset position of the infowindow
		var iwOffsetX = this.offsetHorizontal_;
		var iwOffsetY = this.offsetVertical_;
		// Padding on the infowindow
		var padX = 0;
		var padY = 0;
		// The degrees per pixel
		var mapDiv = map.getDiv();
		var mapWidth = mapDiv.offsetWidth;
		var mapHeight = mapDiv.offsetHeight;
		var boundsSpan = bounds.toSpan();
		var longSpan = boundsSpan.lng();
		var latSpan = boundsSpan.lat();
		var degPixelX = longSpan / mapWidth;
		var degPixelY = latSpan / mapHeight;
		// The bounds of the map
		var mapWestLng = bounds.getSouthWest().lng();
		var mapEastLng = bounds.getNorthEast().lng();
		var mapNorthLat = bounds.getNorthEast().lat();
		var mapSouthLat = bounds.getSouthWest().lat();
		// The bounds of the infowindow
		var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
		var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
		var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
		var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;
		// calculate center shift
		var shiftLng = (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) + (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
		var shiftLat = (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) + (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);
		// The center of the map
		var center = map.getCenter();
		// The new map center
		var centerX = center.lng() - shiftLng;
		var centerY = center.lat() - shiftLat;
		// center the map to the new shifted center
		map.setCenter(new google.maps.LatLng(centerY, centerX));
		// Remove the listener after panning is complete.
		google.maps.event.removeListener(this.boundsChangedListener_);
		this.boundsChangedListener_ = null;
	};
});

function productImageResize() {
	if ($('.js-product-images').length > 0) {
		var $imagesWrap = $('.js-product-images');
		var height = $imagesWrap.outerHeight();

		if ($(window).width() <= 640) {
			height = height > $(window).height() * 0.4 ? $(window).height() * 0.4 : height;
		} else if ($(window).width() >= 821 && $(window).width() <= 1024) {
			height = height > $(window).height() * 0.5 ? $(window).height() * 0.5 : height;
		}

		$imagesWrap.css({
			height: height
		});

		$imagesWrap.find('.product-images__big').css({
			height: height
		});
		$imagesWrap.find('.product-images__big img').css({
			maxHeight: height
		});
	}
}
