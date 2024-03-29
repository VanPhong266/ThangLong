(function () {
  var $;
  $ = this.jQuery || window.jQuery;
  (win = $(window)), (body = $('body')), (doc = $(document));

  $.fn.hc_accordion = function () {
    var acd = $(this);
    acd.find('ul>li').each(function (index, el) {
      if ($(el).find('ul li').length > 0)
        $(el).prepend('<button type="button" class="acd-drop"></button>');
    });
    acd.on('click', '.acd-drop', function (e) {
      e.preventDefault();
      var ul = $(this).nextAll('ul');
      if (ul.is(':hidden') === true) {
        ul.parent('li').parent('ul').children('li').children('ul').slideUp(180);
        ul.parent('li')
          .parent('ul')
          .children('li')
          .children('.acd-drop')
          .removeClass('active');
        $(this).addClass('active');
        ul.slideDown(180);
      } else {
        $(this).removeClass('active');
        ul.slideUp(180);
      }
    });
  };
  $.fn.hc_menu = function (options) {
    var settings = $.extend(
        {
          open: '.open-mnav',
        },
        options
      ),
      this_ = $(this);
    var m_nav = $(
      '<div class="m-nav"><button class="m-nav-close"><i class="fal fa-times"></i></button><div class="nav-ct"></div></div>'
    );
    body.append(m_nav);

    m_nav.find('.m-nav-close').click(function (e) {
      e.preventDefault();
      mnav_close();
    });
    m_nav.find('.nav-ct').append($('.logo').clone());
    m_nav.find('.nav-ct').append(this_.children().clone());
    if ($('header').hasClass('page')) {
      m_nav.addClass('page');
    }

    var mnav_open = function () {
      m_nav.addClass('active');
      body.append('<div class="m-nav-over"></div>').css('overflow', 'hidden');
    };
    var mnav_close = function () {
      m_nav.removeClass('active');
      body.children('.m-nav-over').remove();
      body.css('overflow', '');
    };

    doc
      .on('click', settings.open, function (e) {
        e.preventDefault();
        if (win.width() <= 1365) mnav_open();
      })
      .on('click', '.m-nav-over', function (e) {
        e.preventDefault();
        mnav_close();
      });

    m_nav.hc_accordion();
  };
  $.fn.hc_countdown = function (options) {
    var settings = $.extend(
        {
          date: new Date().getTime() + 1000 * 60 * 60 * 24,
        },
        options
      ),
      this_ = $(this);

    var countDownDate = new Date(settings.date).getTime();

    var count = setInterval(function () {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      this_.html(
        '<div class="item"><span>' +
          days +
          '</span> ngày</div>' +
          '<div class="item"><span>' +
          hours +
          '</span> giờ</div>' +
          '<div class="item"><span>' +
          minutes +
          '</span> phút </div>' +
          '<div class="item"><span>' +
          seconds +
          '</span> giây </div>'
      );
      if (distance < 0) {
        clearInterval(count);
      }
    }, 1000);
  };
  $.fn.hc_upload = function (options) {
    var settings = $.extend(
        {
          multiple: false,
          result: '.hc-upload-pane',
        },
        options
      ),
      this_ = $(this);

    var input_name = this_.attr('name');
    this_.removeAttr('name');

    this_.change(function (e) {
      if ($(settings.result).length > 0) {
        var files = event.target.files;
        if (settings.multiple) {
          for (var i = 0, files_len = files.length; i < files_len; i++) {
            var path = URL.createObjectURL(files[i]);
            var name = files[i].name;
            var size = Math.round((files[i].size / 1024 / 1024) * 100) / 100;
            var type = files[i].type.slice(files[i].type.indexOf('/') + 1);

            var img = $('<img src="' + path + '">');
            var input = $(
              '<input type="hidden" name="' +
                input_name +
                '[]"' +
                '" value="' +
                path +
                '" data-name="' +
                name +
                '" data-size="' +
                size +
                '" data-type="' +
                type +
                '" data-path="' +
                path +
                '">'
            );
            var elm = $(
              '<div class="hc-upload"><button type="button" class="hc-del smooth">&times;</button></div>'
            )
              .append(img)
              .append(input);
            $(settings.result).append(elm);
          }
        } else {
          var path = URL.createObjectURL(files[0]);
          var img = $('<img src="' + path + '">');
          var elm = $(
            '<div class="hc-upload"><button type="button" class="hc-del smooth">&times;</button></div>'
          ).append(img);
          $(settings.result).html(elm);
        }
      }
    });

    body.on('click', '.hc-upload .hc-del', function (e) {
      e.preventDefault();
      this_.val('');
      $(this).closest('.hc-upload').remove();
    });
  };
  // sticky history
  $('.box-title').stick_in_parent();
}.call(this));

jQuery(function ($) {
  var win = $(window),
    body = $('body'),
    doc = $(document);

  var FU = {
    get_Ytid: function (url) {
      var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
      if (url) var arr = url.match(rx);
      if (arr) return arr[1];
    },
    get_currency: function (str) {
      if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
    animate: function (elems) {
      var animEndEv = 'webkitAnimationEnd animationend';
      elems.each(function () {
        var $this = $(this),
          $animationType = $this.data('animation');
        $this.addClass($animationType).one(animEndEv, function () {
          $this.removeClass($animationType);
        });
      });
    },
  };

  var UI = {
    mMenu: function () {},
    header: function () {
      var elm = $('header'),
        h = elm.innerHeight(),
        offset = 200,
        mOffset = 0;
      var fixed = function () {
        elm.addClass('fixed');
        body.css('margin-top', h);
      };
      var unfixed = function () {
        elm.removeClass('fixed');
        body.css('margin-top', '');
      };
      var Mfixed = function () {
        elm.addClass('m-fixed');
        body.css('margin-top', h);
      };
      var unMfixed = function () {
        elm.removeClass('m-fixed');
        body.css('margin-top', '');
      };
      if (win.width() > 991) {
        win.scrollTop() > offset ? fixed() : unfixed();
      } else {
        win.scrollTop() > mOffset ? Mfixed() : unMfixed();
      }
      win.scroll(function (e) {
        if (win.width() > 991) {
          win.scrollTop() > offset ? fixed() : unfixed();
        } else {
          win.scrollTop() > mOffset ? Mfixed() : unMfixed();
        }
      });
    },
    backTop: function () {
      var back_top = $('.back-to-top'),
        offset = 800;

      back_top.click(function () {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
      });

      if (win.scrollTop() > offset) {
        back_top.fadeIn(200);
      }

      win.scroll(function () {
        if (win.scrollTop() > offset) back_top.fadeIn(200);
        else back_top.fadeOut(200);
      });
    },
    slider: function () {
      var len = $('.cas-home').children().length,
        index = 1;
      $('.cas-home').owlCarousel({
        items: 1,
        loop: true,
        nav: false,
        dots: true,
        dotsClass: 'dots',
        autoplay: false,
        // navClass: ["sl-arrow prev", "sl-arrow next"],
        // navText: ["<i class='fal fa-arrow-left'></i> prev", "next <i class='fal fa-arrow-right'></i>"],
        autoPlaySpeed: 10000,
        autoplayTimeout: 10000,
        smartSpeed: 800,
        onTranslate: slider_change,
        onChanged: slider_change,
      });
      function add0(num) {
        var num = Number(num);
        if (num < 10) num = '0' + num;
        return num;
      }
      $('.cas-home .dots').after(
        '<div class="slider-nums-v2 wow fadeInDown"><strong>' +
          add0(index) +
          '</strong><span> / ' +
          add0(len) +
          '</span></div>'
      );
      $('.cas-home .ct .name').before(
        '<div class="slider-nums wow fadeInDown"><strong>' +
          add0(index) +
          '</strong></div>'
      );

      var owlHome = $('.cas-home');
      // $('.dots-cas-home .owl-dot').click(function () {
      //     owlHome.trigger('to.owl.carousel', [$(this).index(), 300]);
      // });
      function slider_change(e) {
        var aniElm = $('.cas-home .owl-item')
          .eq(e.item['index'])
          .find("[data-animation ^= 'animated']");
        FU.animate(aniElm);
        //dots
        $('.slider-nums')
          .find('strong')
          .text(add0(e.page.index + 1));
        $('.slider-nums-v2')
          .find('strong')
          .text(add0(e.page.index + 1));
      }

      $('.cas-news-home').owlCarousel({
        items: 1,
        loop: true,
        nav: true,
        dots: false,
        dotsClass: 'dots',
        autoplay: true,
        navClass: ['sl-arrow prev', 'sl-arrow next'],
        navText: [
          "<i class='far fa-chevron-left'></i>",
          "<i class='far fa-chevron-right'></i>",
        ],
        autoPlaySpeed: 10000,
        autoplayTimeout: 10000,
        smartSpeed: 800,
      });

      //slide in services
      if ($.fn.slick) {
        var his_imgs = $('.history-imgs').slick({
          swipeToSlide: true,
          asNavFor: '.year-cas, .history-infos',
          speed: 500,
          arrows: true,
          fade: true,
          nextArrow:
            '<span class="smooth his-arrow next"><i class="fal fa-chevron-right"></i></span>',
          prevArrow:
            '<span class="smooth his-arrow prev"><i class="fal fa-chevron-left"></i></span>',
        });
      }

      if ($('.cas-partner').length) {
        $('.cas-partner').slick({
          slidesToShow: 6,
          slidesToScroll: 2,
          //nextArrow: '<i class="cas-arrow smooth next"></i>',
          //prevArrow: '<i class="cas-arrow smooth prev"></i>',
          dots: true,
          arrows: false,
          autoplay: true,
          swipeToSlide: true,
          autoplaySpeed: 4000,
          responsive: [
            {
              breakpoint: 1199,
              settings: {
                slidesToShow: 4,
              },
            },
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 700,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 2,
              },
            },
          ],
        });
      }
      if ($('.cas-product').length) {
        $('.cas-product').slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          nextArrow: '<i class="fal fa-long-arrow-right smooth next"></i>',
          prevArrow: '<i class="fal fa-long-arrow-left smooth prev"></i>',
          infinite: true,
          accessibility: false,
          dots: false,
          arrows: true,
          autoplay: true,
          swipeToSlide: true,
          autoplaySpeed: 4000,
          responsive: [
            {
              breakpoint: 1199,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 575,
              settings: {
                slidesToShow: 1,
              },
            },
          ],
        });
      }
      $('.cas-prd-related').owlCarousel({
        loop: true,
        responsiveClass: true,
        nav: true,
        navClass: ['sl-arrow prev', 'sl-arrow next'],
        navText: [
          "<i class='fal fa-chevron-left'></i>",
          "<i class='fal fa-chevron-right'></i>",
        ],
        dots: false,
        smartSpeed: 500,
        margin: 30,
        autoplay: true,
        autoplayTimeout: 5000,
        responsive: {
          991: {
            items: 4,
          },
          479: {
            items: 3,
          },
          0: {
            items: 2,
          },
        },
      });
      // why-us office
      if ($('.slider-office').length) {
        $('.slider-office').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          nextArrow:
            '<span class="smooth cas-arrow next"><i class="fal fa-long-arrow-right"></i></span>',
          prevArrow:
            '<span class="smooth cas-arrow prev"><i class="fal fa-long-arrow-left"></i></span>',
          dots: false,
          arrows: true,
          autoplay: true,
          swipeToSlide: true,
          autoplaySpeed: 4000,
        });
      }
      // why-partner
      if ($('.why-partner').length) {
        $('.why-partner').slick({
          slidesToShow: 6,
          slidesToScroll: 2,
          nextArrow:
            '<span class="smooth cas-arrow next"><i class="fal fa-long-arrow-right"></i></span>',
          prevArrow:
            '<span class="smooth cas-arrow prev"><i class="fal fa-long-arrow-left"></i></span>',
          dots: false,
          arrows: true,
          autoplay: true,
          swipeToSlide: true,
          autoplaySpeed: 4000,
          responsive: [
            {
              breakpoint: 1199,
              settings: {
                slidesToShow: 4,
              },
            },
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 700,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 2,
              },
            },
          ],
        });
      }

      // more product in product detail screen
      if ($('.js-involve-product').length) {
        $('.js-involve-product').slick({
          slidesToShow: 4,
          slidesToScroll: 4,
          rows: 1,
          accessibility: false,
          nextArrow:
            '<span class="smooth cas-arrow next"><i class="fal fa-long-arrow-right"></i></span>',
          prevArrow:
            '<span class="smooth cas-arrow prev"><i class="fal fa-long-arrow-left"></i></span>',
          dots: false,
          arrows: true,
          autoplay: true,
          autoplaySpeed: 4000,
          responsive: [
            {
              breakpoint: 1250,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
              },
            },
            {
              breakpoint: 997,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                swipeToSlide: true,
              },
            },
            {
              breakpoint: 770,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                swipeToSlide: true,
              },
            },
            {
              breakpoint: 405,
              settings: {
                arrows: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                swipeToSlide: true,
              },
            },
          ],
        });
      }

      // slider vertical for change banner in product detail screen
      if ($('.js-sub-image').length) {
        $('.js-sub-image').slick({
          slidesToShow: 5,
          slidesToScroll: 5,
          rows: 1,
          vertical: true,
          verticalSwiping: true,
          autoplay: true,
          autoplaySpeed: 4000,
          accessibility: false,
          dots: false,
          arrows: false,
          responsive: [
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                swipeToSlide: true,
                vertical: false,
                verticalSwiping: false,
              },
            },
            {
              breakpoint: 770,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                swipeToSlide: true,
                vertical: false,
                verticalSwiping: false,
              },
            },
            {
              breakpoint: 420,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                swipeToSlide: true,
                vertical: false,
                verticalSwiping: false,
              },
            },
          ],
        });
      }
    },

    input_number: function () {
      doc.on('keydown', '.numberic', function (event) {
        if (
          !(
            (!event.shiftKey && !(event.keyCode < 48 || event.keyCode > 57)) ||
            !(event.keyCode < 96 || event.keyCode > 105) ||
            event.keyCode == 46 ||
            event.keyCode == 8 ||
            event.keyCode == 190 ||
            event.keyCode == 9 ||
            event.keyCode == 116 ||
            (event.keyCode >= 35 && event.keyCode <= 39)
          )
        ) {
          event.preventDefault();
        }
      });
      doc.on('click', '.i-number .up', function (e) {
        e.preventDefault();
        var input = $(this).parents('.i-number').children('input');
        var max = Number(input.attr('max')),
          val = Number(input.val());
        if (!isNaN(val)) {
          if (!isNaN(max) && input.attr('max').trim() != '') {
            if (val >= max) {
              return false;
            }
          }
          input.val(val + 1);
          input.trigger('change');
        }
      });
      doc.on('click', '.i-number .down', function (e) {
        e.preventDefault();
        var input = $(this).parents('.i-number').children('input');
        var min = Number(input.attr('min')),
          val = Number(input.val());
        if (!isNaN(val)) {
          if (!isNaN(min) && input.attr('max').trim() != '') {
            if (val <= min) {
              return false;
            }
          }
          input.val(val - 1);
          input.trigger('change');
        }
      });
    },
    yt_play: function () {
      doc.on('click', '.yt-box .play', function (e) {
        var id = FU.get_Ytid($(this).closest('.yt-box').attr('data-url'));
        $(this).closest('.yt-box iframe').remove();
        $(this)
          .closest('.yt-box')
          .append(
            '<iframe src="https://www.youtube.com/embed/' +
              id +
              '?rel=0&amp;autoplay=1&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>'
          );
      });
    },
    psy: function () {
      var btn = '.psy-btn',
        sec = $('.psy-section'),
        pane = '.psy-pane';
      doc.on('click', btn, function (e) {
        e.preventDefault();
        $(this).closest(pane).find(btn).removeClass('active');
        $(this).addClass('active');
        $('html, body').animate(
          { scrollTop: $($(this).attr('href')).offset().top - 40 },
          600
        );
      });

      var section_act = function () {
        sec.each(function (index, el) {
          if (win.scrollTop() + win.height() / 2 >= $(el).offset().top) {
            var id = $(el).attr('id');
            $(pane).find(btn).removeClass('active');
            $(pane)
              .find(btn + '[href="#' + id + '"]')
              .addClass('active');
          }
        });
      };
      section_act();
      win.scroll(function () {
        section_act();
      });
    },
    drop: function () {
      $('.drop').each(function () {
        var this_ = $(this);
        var label = this_.children('.label');
        var ct = this_.children('ul');
        var item = ct.children('li').children('a.drop-item');

        this_.click(function () {
          ct.slideToggle(150);
          label.toggleClass('active');
        });

        /*item.click(function(e) {
                    e.preventDefault();
                    label.html($(this).html());
                });*/

        win.click(function (e) {
          if (this_.has(e.target).length == 0 && !this_.is(e.target)) {
            this_.children('ul').slideUp(150);
            label.removeClass('active');
          }
        });
      });
    },
    toggle: function () {
      var ani = 100;
      $('[data-show]').each(function (index, el) {
        var ct = $($(el).attr('data-show'));
        $(el).click(function (e) {
          e.preventDefault();
          ct.fadeToggle(ani);
        });
      });
      win.click(function (e) {
        $('[data-show]').each(function (index, el) {
          var ct = $($(el).attr('data-show'));
          if (
            ct.has(e.target).length == 0 &&
            !ct.is(e.target) &&
            $(el).has(e.target).length == 0 &&
            !$(el).is(e.target)
          ) {
            ct.fadeOut(ani);
          }
        });
      });
    },
    uiCollapse: function () {
      var ui = $('.hc-collapse');
      ui.find('ul>li').each(function (index, el) {
        if ($(el).find('ul>li').length > 0) {
          var cl = $(el).children('ul').is(':hidden') ? '' : 'active';
          $(el).prepend('<button class="cls-drop"></button>');
        }
      });

      $('.cls-drop,.cls-drop-tag-a').click(function () {
        var ul = $(this).nextAll('ul');
        if (ul.is(':hidden') === true) {
          $('.sb-drop>ul>li').removeClass('active');
          ul.parent('li').addClass('active');
          ul.parent('li').parent().children().children('ul').slideUp(200);
          ul.parent('li')
            .parent()
            .children()
            .children('.cls-drop')
            .removeClass('active');
          $(this).parent().find('> .cls-drop').addClass('active');
          ul.slideDown(200);
        } else {
          ul.slideUp(200);
          $(this).removeClass('active');
          ul.parent('li').removeClass('active');
        }
      });
    },
    uiCounterup: function () {
      var item = $('.hc-couter'),
        flag = true;
      if (item.length > 0) {
        run(item);
        win.scroll(function () {
          if (flag == true) {
            run(item);
          }
        });

        function run(item) {
          if (
            win.scrollTop() + 70 < item.offset().top &&
            item.offset().top + item.innerHeight() <
              win.scrollTop() + win.height()
          ) {
            count(item);
            flag = false;
          }
        }

        function count(item) {
          item.each(function () {
            var this_ = $(this);
            var num = Number(this_.text().replace('.', ''));
            var incre = num / 80;

            function start(counter) {
              if (counter <= num) {
                setTimeout(function () {
                  this_.text(FU.get_currency(Math.ceil(counter)));
                  counter = counter + incre;
                  start(counter);
                }, 20);
              } else {
                this_.text(FU.get_currency(num));
              }
            }
            start(0);
          });
        }
      }
    },
    ready: function () {
      //UI.mMenu();
      //UI.header();
      UI.slider();
      UI.backTop();
      UI.drop();
      UI.toggle();
      UI.uiCollapse();
      //UI.input_number();
      UI.uiCounterup();
      // UI.yt_play();
      // UI.psy();
    },
  };

  UI.ready();

  /*custom here*/
  WOW.prototype.addBox = function (element) {
    this.boxes.push(element);
  };

  var wow = new WOW({
    mobile: false,
  });
  wow.init();
  // disable scroll
  var owl = $('.owl-carousel');
  owl.on('drag.owl.carousel', function (event) {
    document.ontouchmove = function (e) {
      e.preventDefault();
    };
  });
  // enable scroll
  owl.on('dragged.owl.carousel', function (event) {
    document.ontouchmove = function (e) {
      return true;
    };
  });
  $('.d-nav').hc_menu({
    open: '.open-mnav',
  });
  $(win).scroll(function () {
    if ($(win).scrollTop() > 5) {
      $('header').addClass('scroll');
    } else {
      $('header').removeClass('scroll');
    }
  });
  if ($(window).width() > 991) {
    if ($('.stick').length > 0) {
      $('.stick').stick_in_parent({
        offset_top: 80,
      });
    }
  }
  // open menu in mobile case
  if ($('.js-open-menu').length) {
    $('.js-open-menu').click(function (event) {
      $('.sb-product,.overlay,.close-sb').addClass('show');
      $('body').css('overflow', 'hidden');
    });
    $('.overlay,.js-close-menu').click(function (event) {
      $('.sb-product,.overlay,.close-sb').removeClass('show');
      $('body').removeAttr('style');
    });
  }

  // open sub menu in side bar in product screen
  if ($('.sb-item-title').length) {
    // add class .js-open-sub-menu to .sb-item-title
    var item = $('.sb-item-title').find('ul');
    item.each(function () {
      var sib_cat = $(this).siblings('.title-cat');
      if (!sib_cat.hasClass('js-open-sub-menu')) {
        sib_cat.addClass('js-open-sub-menu');
      }
      sib_cat.append('<i class="fal fa-chevron-right"></i>');
      sib_cat.attr('href', 'javascript:;');
    });
    // change status of arrow and collapse content
    $('.sb-sub-menu').each(function () {
      $(this).attr('data-height', $(this).outerHeight());
      $(this).css('max-height', '0px');
    });
    $('.title-cat').click(function () {
      var sub_menu = $(this).parents('.sb-item-title').find('.sb-sub-menu');
      var sub_menu_siblings = $(this)
        .parents('.sb-item-title')
        .siblings('.sb-item-title');
      if ($(this).hasClass('js-open-sub-menu')) {
        $(this).find('i').toggleClass('rotate-90');
        // slide
        if (sub_menu.css('max-height') == '0px') {
          sub_menu.css('max-height', sub_menu.data('height') + 'px');
        } else {
          sub_menu.css('max-height', '0px');
        }
      }

      sub_menu_siblings.find('.sb-sub-menu').css('max-height', '0px');
      // rotate arrow
      sub_menu_siblings.find('i').removeClass('rotate-90');

      // add active
      $(this).toggleClass('active');
      sub_menu_siblings.find('.title-cat').removeClass('active');
    });

    $('.smooth').click(function () {
      $(this).toggleClass('active');
      $(this).siblings('.smooth').removeClass('active');
      var sub_menu_siblings = $(this)
        .parents('.sb-item-title')
        .siblings('.sb-item-title');
      sub_menu_siblings.find('.smooth').removeClass('active');
    });
  }

  if ($('.prd-branch').length) {
    $('.purchase').click(function (event) {
      $('html, body').animate(
        { scrollTop: $('.prd-branch').offset().top - 80 },
        800
      );
    });
  }
  if (win.width() < 991) {
    $('.map-contact .map-item').click(function (event) {
      let poi = $('#map').offset().top - 70;
      $('html, body').animate({ scrollTop: poi }, 800);
    });
  }

  // change banner-detail in product detail when click image
  $('.image-item').click(function () {
    var path = $(this).attr('src');
    $('.banner-detail').attr('src', path);
  });

  //fix height news
  // if($(window).width()>575){
  //     $('.hot-news .img img').height($('.hot-news-relate').height())
  // }
  var pri_width = $('.column:nth-child(1) .item:nth-child(1) img').width();
  $('.column:nth-child(1) .item:nth-child(1) img').height(pri_width);
  $('.column:nth-child(2) .item:nth-child(2) img').height(pri_width);
  $('.column:nth-child(1) .item:nth-child(2) img').height(pri_width * 1.355);
  $('.column:nth-child(2) .item:nth-child(1) img').height(pri_width * 1.355);

  var wContainer = $('.product-home .container').width();
  var wWindow = $(window).width();
  $('.list-item-product').css('margin-right', -((wWindow - wContainer) / 2));
});
