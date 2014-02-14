
(function ($) {
  var defaultOptions, UXperience, fields = [];

  UXperience = (function(){
    function UXperience(handler, options) {
      this.start_time = Date.now();

      $.extend(true, this, defaultOptions, options);

      elements = handler.children('input:not([type=submit], [type=radio]), select, textarea'); // TODO: whitelist option maybe

      elements.each(function(i, el) {
        fields.push(el);
      });

      results = {}

      _this = this;
      handler.bind('submit', function() {
        $.each(fields, function(i, el) {
          return results[el.data('name')] = el.data('time');
        });
        if(typeof options.submit === 'function') {
          results.overall_time = Date.now() - _this.start_time;
          options.submit(results);
        }
      });
    };

    return UXperience;
  })();

  $.fn.uxperience = function(options) {
    return new UXperience(this, options || {});
  };

})(jQuery);
