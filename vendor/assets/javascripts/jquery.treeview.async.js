/*
* Async Treeview 0.1 - Lazy-loading extension for Treeview
*
* http://bassistance.de/jquery-plugins/jquery-plugin-treeview/
*
* Copyright (c) 2007 JÃ¶rn Zaefferer
*
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* Revision: $Id$
*
*/

;
(function($) {

  function load(settings, root, child, container) {
    function createNode(parent) {
      var current = $("<li/>").attr("id", this.id || "").html("<a href=\"" + this.url + "\" class=\"" + (this.classes || "") + "\">" + this.text + "</a>" + (this.additionalText ? this.additionalText : "")).appendTo(parent);
      if (this.classes) {
        current.children("span").addClass(this.classes);
      }
      if (this.expanded) {
        current.addClass("open");
      }
      if (this.hasChildren || this.children && this.children.length) {
        var branch = $("<ul/>").appendTo(current);
        if (this.hasChildren) {
          current.addClass("hasChildren");
          createNode.call({
            classes: "placeholder",
            text: "&nbsp;",
            children:[]
          }, branch);
        }
        if (this.children && this.children.length) {
          $.each(this.children, createNode, [branch])
        }
      }
    }
    $.ajax($.extend(true, {
      url: settings.url,
      dataType: "json",
      data: {
        root: root
      },
      success: function(response) {
        child.empty();
        $.each(response, createNode, [child]);
        $(container).treeview({add: child});
      }
    }, settings.ajax));
  }

  $.fn.treeviewLoad = load;

  var proxied = $.fn.treeview;
  $.fn.treeview = function(settings) {
    if (!settings.url) {
      return proxied.apply(this, arguments);
    }
    var container = this;
    if (!container.children().size())
      load(settings, (settings.root || "source"), this, container);
    var userToggle = settings.toggle;
    return proxied.call(this, $.extend({}, settings, {
      collapsed: true,
      toggle: function() {
        var $this = $(this);
        if ($this.hasClass("hasChildren")) {
          var childList = $this.removeClass("hasChildren").find("ul");
          load(settings, this.id, childList, container);
        }
        if (userToggle) {
          userToggle.apply(this, arguments);
        }
      }
    }));
  };
})(jQuery);