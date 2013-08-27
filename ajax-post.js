window.$post = function(data) {
    var xmlhttp;

    var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
        rsubmittable = /^(?:input|select|textarea|keygen)/i,
        class2type = {},
        toString = class2type.toString;

    $each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase()
    });

    function type(obj) {
        return obj == null ? String(obj) :
            class2type[toString.call(obj)] || "object"
    }

    function isFunction(value) { return type(value) == "function" }
    function isWindow(obj)     { return obj != null && obj == obj.window }
    function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
    function isObject(obj)     { return type(obj) == "object" }
    function isPlainObject(obj) { return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype }
    function isArray(value) { return value instanceof Array }
    function likeArray(obj) { return typeof obj.length == 'number' }

    function $each(elements, callback){
        var i, key;

        if (likeArray(elements)) {
            for (i = 0; i < elements.length; i++)
                if (callback.call(elements[i], i, elements[i]) === false)
                    return elements;
        } else {
            for (key in elements)
                if (callback.call(elements[key], key, elements[key]) === false)
                    return elements;
        }

        return elements;
    }

    function buildParams( prefix, obj, traditional, add ) {
        var name;

        if ( isArray( obj ) ) {
            // Serialize array item.
            $each( obj, function( i, v ) {
                if ( traditional || rbracket.test( prefix ) ) {
                    // Treat each array item as a scalar.
                    add( prefix, v );

                } else {
                    // Item is non-scalar (array or object), encode its numeric index.
                    buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
                }
            });

        } else if (!traditional && type( obj ) === 'object') {
            // Serialize object item.
            for ( name in obj ) {
                buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
            }

        } else {
            // Serialize scalar item.
            add( prefix, obj );
        }
    }

    function postEncode( a, traditional ) {
        var prefix,
            s = [],
            add = function( key, value ) {
                // If value is a function, invoke it and return its value
                value = isFunction( value ) ? value() : ( value == null ? "" : value );
                s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
            };

        // Set traditional to true for jQuery <= 1.3.2 behavior.
        if ( traditional === undefined ) {
            traditional = false;
        }

        // If an array was passed in, assume that it is an array of form elements.
        if ( isArray( a ) || ( a.jquery && !isPlainObject( a ) ) ) {
            // Serialize the form elements
            $each( a, function() {
                add( this.name, this.value );
            });

        } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for ( prefix in a ) {
                buildParams( prefix, a[ prefix ], traditional, add );
            }
        }

        // Return the resulting serialization
        return s.join( "&" ).replace( r20, "+" );
    }

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
            //document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
            console.log('AJAX response:', xmlhttp.responseText);
        }
    };

    var url = window.location.toString().replace(/play$/i, 'save_result');

    xmlhttp.open('POST', url, true);

    data = postEncode(data);

    var baseHeaders = {};

    baseHeaders['X-Requested-With'] = 'XMLHttpRequest';
    baseHeaders['Content-Type'] = 'application/x-www-form-urlencoded';

    for (var name in baseHeaders) xmlhttp.setRequestHeader(name, baseHeaders[name]);

    xmlhttp.send(data);
};