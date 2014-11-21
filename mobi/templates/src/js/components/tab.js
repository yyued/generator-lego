/*! Project: LegoMobile
 *  Version: 3.0.0
 */
define("tab",["zepto","MO","swipe"],function(a,b,c){var d=a("zepto"),e=(a("MO"),a("swipe")),f=function(a,b){var c=d(a).get(0),f=d(a).find("nav").children(),g={callback:function(a){for(var b=f.length;b--;)f.eq(b).removeClass("current");f.eq(a).addClass("current")}};g=d.extend({},b,g);var h=function(){f.each(function(a){d(this).attr("data-index",a)}),d(a).find("nav").on("touchstart","*",function(){i.slide(parseInt(d(this).attr("data-index")))})};h();var i=e(c,g);return e(c,g)};c.exports=f});