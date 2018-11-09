/**
 * Created by fengge on 16/8/16.
 */
;(function (name, context, definition) {
    "use strict";
    if (typeof module !== "undefined" && module.exports) { module.exports = definition(); }
    else if (typeof define === "function" && define.amd) { define(definition); }
    else { context[name] = definition(); }
})("Store", this, function() {
    "use strict";
    var Store = function(options){
        var defaultOptions = {};
        this.options = $.extend(options, defaultOptions);
    };
    Store.prototype = {
        setStore : function(name, value){
            if(!!name && !!value){
                this.setCookie(name, value) && this.setSessionStorage(name, value) && this.setLocalStorage(name, value);
            }
        },

        getStore : function(name){
            if(!!name){
               return !this.getCookie(name) ? (!this.getLocalStorage(name) ? this.getSessionStorage(name) : this.getLocalStorage(name)) : this.getCookie(name);
            }
        },
        
        clearStore : function(name){
            if(!!name){
                this.clearCookie(name) && this.clearSessionStorage(name) && this.clearLocalStorage(name); 
            }
        },

        //设置SessionStorage
        setSessionStorage : function(name, value){
            try{
                if(sessionStorage && !!name && !!value){
                    sessionStorage.setItem(name, value);
                }
            }catch (e){
                console.log("setSessionStorage失败");
            }
        },

        //getLocalStorage
        getSessionStorage : function(name){
            try{
                if(sessionStorage && !!name){
                    return sessionStorage.getItem(name);
                }
                return false;
            }catch (e){
                console.log("getSessionStorage失败");
                return false;
            }
        },

        clearSessionStorage : function(name){
            try{
                if(sessionStorage){
                    !!name ? sessionStorage.removeItem(name) : sessionStorage.clear();
                }
            }catch (e){
                console.log("clearSessionStorage失败");
            }
        },

        //设置localstStorage
        setLocalStorage : function(name, value){
            try{
                if(localStorage && !!name && !!value){
                    localStorage.setItem(name, value);
                }
            }catch (e){
                console.log("setLocalStorage失败");
            }
        },
        //getLocalStorage
        getLocalStorage : function(name){
            try{
                if(localStorage && !!name){
                    return localStorage.getItem(name);
                }
                return false;
            }catch (e){
                console.log("getLocalStorage失败");
                return false;
            }
        },

        clearLocalStorage : function(name){
            try{
                if(localStorage){
                    !!name ? localStorage.removeItem(name) : localStorage.clear();
                }
            }catch (e){
                console.log("clearLocalStorage失败");
            }
        },

        //设置cookie
        setCookie : function(name, value, exdays){
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = name + "=" + value + "; " + expires +"; path=/";
        },

        //getCookie
        getCookie : function(name){
            var name = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
            }
            return "";
        },
        clearCookie : function(name){
            this.setCookie(name, "", -1);
        }
    };
    Store.VERSION = "1.0.0";
    return Store;
});