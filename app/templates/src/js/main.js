(function(){
    'use strict';
    
    var main = {
        method1 : function(){
            alert('a');
        },
        _method : function(){

        },
        init : function(){
            this.method1();
            //this._method();
        }
    };

    if(typeof window.main === 'undefined') window.main = main

})();