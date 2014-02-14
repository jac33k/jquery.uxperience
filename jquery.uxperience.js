
(function ($) {
  var defaultOptions, UXperience, Field, fields = [];

  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Field = (function() {
    function Field(el) {
      this.focusCallback = __bind(this.focusCallback, this);
      this.blurCallback = __bind(this.blurCallback, this);

      this.time = 0;
      this.el = $(el);
      this.name = this.el.attr('name');

      this.el.bind('focus', this.focusCallback);
      this.el.bind('blur', this.blurCallback);
    };

    Field.prototype.focusCallback = function() {
      return this.start_time = Date.now();
    };

    Field.prototype.blurCallback = function() {
      var diff = Date.now() - this.start_time;
      return this.time += diff;
    };

    return Field;
  })();

  UXperience = (function(){
    function UXperience(handler, options) {
      this.start_time = Date.now();

      $.extend(true, this, defaultOptions, options);

      elements = handler.children('input:not([type=submit], [type=radio]), select, textarea'); // TODO: whitelist option maybe

      elements.each(function(i, el) {
        fields.push(new Field(el));
      });

      results = {}

      _this = this;
      handler.bind('submit', function() {
        $.each(fields, function(i, el) {
          return results[el.name] = el.time;
        });
        if(typeof options.submit === 'function') {
          results.overall_time = Date.now() - _this.start_time;
          options.submit(results);
        }
      });

      // focused input - sending form by pressing Return key
      $('input:not([type=submit])', handler).bind('keypress', function(e) {
        if(e.which == 13) {
          this.blur();
        }
      });
    };

    return UXperience;
  })();

  $.fn.uxperience = function(options) {
    return new UXperience(this, options || {});
  };

})(jQuery);
