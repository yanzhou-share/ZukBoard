/**
 *  ttevents.js
 * 	author: fugang 
 * 	date: 2014-04-02
 */



;(function () {
	
	var eventSplitter = /\s+/;

	var Events = {

		// Bind one or more space separated events, `events`, to a `callback`
		// function. Passing `"all"` will bind the callback to all events fired.
		on: function(events, callback, context) {
		  var calls, event, list;
		  if (!callback) return this;

		  events = events.split(eventSplitter);
		  calls = this._callbacks || (this._callbacks = {});

		  while (event = events.shift()) {
		    list = calls[event] || (calls[event] = []);
		    list.push(callback, context);
		  }

		  return this;
		},

		// Remove one or many callbacks. If `context` is null, removes all callbacks
		// with that function. If `callback` is null, removes all callbacks for the
		// event. If `events` is null, removes all bound callbacks for all events.
		off: function(events, callback, context) {
		  var event, calls, list, i;

		  // No events, or removing *all* events.
		  if (!(calls = this._callbacks)) return this;
		  if (!(events || callback || context)) {
		    delete this._callbacks;
		    return this;
		  }

		  events = events ? events.split(eventSplitter) : _.keys(calls);

		  // Loop through the callback list, splicing where appropriate.
		  while (event = events.shift()) {
		    if (!(list = calls[event]) || !(callback || context)) {
		      delete calls[event];
		      continue;
		    }

		    for (i = list.length - 2; i >= 0; i -= 2) {
		      if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
		        list.splice(i, 2);
		      }
		    }
		  }

		  return this;
		},

		// Trigger one or many events, firing all bound callbacks. Callbacks are
		// passed the same arguments as `trigger` is, apart from the event name
		// (unless you're listening on `"all"`, which will cause your callback to
		// receive the true name of the event as the first argument).
		trigger: function(events) {
		  var event, calls, list, i, length, args, all, rest;
		  if (!(calls = this._callbacks)) return this;

		  rest = [];
		  events = events.split(eventSplitter);

		  // Fill up `rest` with the callback arguments.  Since we're only copying
		  // the tail of `arguments`, a loop is much faster than Array#slice.
		  for (i = 1, length = arguments.length; i < length; i++) {
		    rest[i - 1] = arguments[i];
		  }

		  // For each event, walk through the list of callbacks twice, first to
		  // trigger the event, then to trigger any `"all"` callbacks.
		  while (event = events.shift()) {
		    // Copy callback lists to prevent modification.
		    if (all = calls.all) all = all.slice();
		    if (list = calls[event]) list = list.slice();

		    // Execute event callbacks.
		    if (list) {
		      for (i = 0, length = list.length; i < length; i += 2) {
		        list[i].apply(list[i + 1] || this, rest);
		      }
		    }

		    // Execute "all" callbacks.
		    if (all) {
		      args = [event].concat(rest);
		      for (i = 0, length = all.length; i < length; i += 2) {
		        all[i].apply(all[i + 1] || this, args);
		      }
		    }
		  }

		  return this;
		}

	};

	// Aliases for backwards compatibility.
	Events.bind   = Events.on;
	Events.unbind = Events.off;

	

	var delegateEventSplitter = /^(\S+)\s*(.*)$/;
	var tt = {
		/**
         * Returns the type of the given variable in string format. List of possible values are:
         *
         * - `undefined`: If the given value is `undefined`
         * - `null`: If the given value is `null`
         * - `string`: If the given value is a string
         * - `number`: If the given value is a number
         * - `boolean`: If the given value is a boolean value
         * - `date`: If the given value is a `Date` object
         * - `function`: If the given value is a function reference
         * - `object`: If the given value is an object
         * - `array`: If the given value is an array
         * - `regexp`: If the given value is a regular expression
         * - `element`: If the given value is a DOM Element
         * - `textnode`: If the given value is a DOM text node and contains something other than whitespace
         * - `whitespace`: If the given value is a DOM text node and contains only whitespace
         *
         * @param {Object} value
         * @return {String}
         * @markdown
         */
        typeOf: function(value) {
            if (value === null) {
                return 'null';
            }

            var type = typeof value;

            if (type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean') {
                return type;
            }

            var typeToString = toString.call(value);

            switch(typeToString) {
                case '[object Array]':
                    return 'array';
                case '[object Date]':
                    return 'date';
                case '[object Boolean]':
                    return 'boolean';
                case '[object Number]':
                    return 'number';
                case '[object RegExp]':
                    return 'regexp';
            }

            if (type === 'function') {
                return 'function';
            }

            if (type === 'object') {
                if (value.nodeType !== undefined) {
                    if (value.nodeType === 3) {
                        return (/\S/).test(value.nodeValue) ? 'textnode' : 'whitespace';
                    }
                    else {
                        return 'element';
                    }
                }

                return 'object';
            }

            throw new Error('Failed to determine the type of the specified value "' + value + '". This is most likely a bug.');
        },
        /**
         * Returns true if the passed value is a JavaScript Function, false otherwise.
         * @param {Object} value The value to test
         * @return {Boolean}
         * @method
         */
        isFunction:
	        // Safari 3.x and 4.x returns 'function' for typeof <NodeList>, hence we need to fall back to using
	        // Object.prorotype.toString (slower)
	        (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function(value) {
	            return toString.call(value) === '[object Function]';
	        } : function(value) {
	            return typeof value === 'function';
        },
		//
	    // *{"event selector": "callback"}*
	    //
	    //     {
	    //       'mousedown .title':  'edit',
	    //       'click .button':     'save'
	    //       'click .open':       function(e) { ... }
	    //     }
	    //
	    // This only works for delegate-able events: not `focus`, `blur`, and
	    // not `change`, `submit`, and `reset` in Internet Explorer.
	    delegateEvents: function(oparent) {
	    	events = oparent.events;
	    	if (!(events || (events = TT.result(this, 'events')))) return;
	    	this.$el = oparent.$el;
	    	this.undelegateEvents();

	    	var _this = oparent;
	    	for (var key in events) {
	    		var method = events[key];
	    		if (TT.typeOf(method) !== 'function') method = oparent[events[key]];
	    		if (!method) throw new Error('Method "' + events[key] + '" does not exist');

	    		var match = key.match(delegateEventSplitter);
	    		var eventName = match[1], selector = match[2];
	    		//method = this[method];
	    		eventName += '.delegateEvents' + this.cid;
	    		if (selector === '') {
	    			this.$el.bind(eventName, (function (method) {
	    				return function (event) {
	    					method.apply(_this,arguments);
		    				// method.call(_this, event);
		    			}
	    			})(method));
	    		} else {
	    			this.$el.delegate(selector, eventName, (function (method) {
	    				return function (event) {
	    					method.apply(_this,arguments);
		    				//method.call(_this, event);
		    			}
	    			})(method));
	    		}
	    	}
	    },

	    undelegateEvents: function() {
	    	this.$el.unbind('.delegateEvents' + this.cid);
	    },
	    getStrLen: function (i) {
	        return Math.ceil(String(i).replace(/[^\x00-\xff]/g, "ci").length / 2)
	    },
	    resizeImg: function (i, n, t, o) {
	        if (!i) return "";
	        var e, a, r = t || 80,
	            s = o || 60,
	            l = 0,
	            h = 0;
	        i / n > r / s ? (e = s / n * i, a = s, l = (r - e) / 2) : (e = r, a = r / i * n, h = (s - a) / 2);
	        var c = "width:" + e + "px;height:" + a + "px;left:" + l + "px;top:" + h + "px";
	        return c
	    },
	    scrollTo: function (i, n) {
	        var t = i.offset().top - ("undefined" == typeof n ? 60 : n);
	        $("html,body").animate({
	            scrollTop: t
	        }, 300)
	    }
	};
	
	TT = tt || {};
	TT.Events = Events;

	/**
     * 继承
     * @param  {class} childClass 子类
     * @param  {class} superClass 父类
     * @return {class} 
     */
    TT.extend = function (childClass, superClass) {
        var F = function(){};   
        var spp = F.prototype = superClass.prototype;
        childClass.prototype = new F();

        childClass.prototype.constructor = childClass;
        childClass.prototype.superclass = spp;
        childClass.superclass = spp;

        return childClass;
    };
	/**
     * 获取一个对象中的属性值
     * @param  {object} object  
     * @param  {string} property
     * @return {value}
     */
    TT.result = function(object, property) {
        if (object == null) return null;
        var value = object[property];
        return TT.typeOf(value) === 'function' ? value.call(object) : value;
    };
    TT.ttapost = function(_url,_data,_callback,_scope){
        $.ajax({
                url    : _url,
                type   : 'POST',
                data   :  _data,
                dataType : 'json',
                success  : function (res) {
                    if (TT.isFunction(_callback)) {
                        _callback.apply(_scope, arguments);
                    };
                },
                error:function(){
                    if (!navigator.onLine){
                      // ttapp.messageBox_tip('网络异常');
                      return;
                    }
                    if (TT.isFunction(_callback)) {
                        _callback.apply(_scope, {code:0,msg:'error'});
                    };
                }
        });
    };
    var _ttapp = function (){
		this.init();
	};
	
	_ttapp.prototype ={
		init : function(){},
		refresh : function(){}
	};
	window.ttapp = new _ttapp();
	window.TT_CONFIG = {
		//关于图片链接url 		临时图片转正式图片传临时rid以逗号分隔，isicontype=false为普通图像，否则为用户图像			
		URL_CONSTANTS : {
			
			DEFAULTICON : '/assets/img/default-photo.png',
			DEFAULTPOSTICON : '/assets/img/404.png',
			DEFAULTCOLLICON : '/assets/img/failedLoad.png',
			RC_UPYUN_URL : 'https://v0.api.upyun.com/',
			RC_UPYUN_DIR : 'hoozha',
			RC_UPYUN_HTTP: 'https://hoozha.b0.upaiyun.com',
		}
	};
    
	
})();