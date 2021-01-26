! function () {
  var t = function ( i ) {
    var n = {};

    function s( t ) {
      if ( n[ t ] ) return n[ t ].exports;
      var e = n[ t ] = {
        i: t,
        l: !1,
        exports: {}
      };
      return i[ t ].call( e.exports, e, e.exports, s ), e.l = !0, e.exports
    }
    return s.m = i, s.c = n, s.d = function ( t, e, i ) {
      s.o( t, e ) || Object.defineProperty( t, e, {
        enumerable: !0,
        get: i
      } )
    }, s.r = function ( t ) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty( t, Symbol.toStringTag, {
        value: "Module"
      } ), Object.defineProperty( t, "__esModule", {
        value: !0
      } )
    }, s.t = function ( e, t ) {
      if ( 1 & t && ( e = s( e ) ), 8 & t ) return e;
      if ( 4 & t && "object" == typeof e && e && e.__esModule ) return e;
      var i = Object.create( null );
      if ( s.r( i ), Object.defineProperty( i, "default", {
          enumerable: !0,
          value: e
        } ), 2 & t && "string" != typeof e )
        for ( var n in e ) s.d( i, n, function ( t ) {
          return e[ t ]
        }.bind( null, n ) );
      return i
    }, s.n = function ( t ) {
      var e = t && t.__esModule ? function () {
        return t.default
      } : function () {
        return t
      };
      return s.d( e, "a", e ), e
    }, s.o = function ( t, e ) {
      return Object.prototype.hasOwnProperty.call( t, e )
    }, s.p = "", s( s.s = 12 )
  }( [ , , function ( t, e, i ) {
    "use strict";

    function s( t ) {
      this.__parent = t, this.__character_count = 0, this.__indent_count = -1, this.__alignment_count = 0, this.__items = []
    }

    function n( t, e ) {
      this.__cache = [ "" ], this.__indent_size = t.indent_size, this.__indent_string = t.indent_char, t.indent_with_tabs || ( this.__indent_string = new Array( t.indent_size + 1 ).join( t.indent_char ) ), e = e || "", 0 < t.indent_level && ( e = new Array( t.indent_level + 1 ).join( this.__indent_string ) ), this.__base_string = e, this.__base_string_length = e.length
    }

    function _( t, e ) {
      this.__indent_cache = new n( t, e ), this.raw = !1, this._end_with_newline = t.end_with_newline, this.indent_size = t.indent_size, this.__lines = [], this.previous_line = null, this.current_line = null, this.space_before_token = !1, this.__add_outputline()
    }
    s.prototype.item = function ( t ) {
      return t < 0 ? this.__items[ this.__items.length + t ] : this.__items[ t ]
    }, s.prototype.has_match = function ( t ) {
      for ( var e = this.__items.length - 1; 0 <= e; e-- )
        if ( this.__items[ e ].match( t ) ) return !0;
      return !1
    }, s.prototype.set_indent = function ( t, e ) {
      this.__indent_count = t || 0, this.__alignment_count = e || 0, this.__character_count = this.__parent.get_indent_size( this.__indent_count, this.__alignment_count )
    }, s.prototype.get_character_count = function () {
      return this.__character_count
    }, s.prototype.is_empty = function () {
      return 0 === this.__items.length
    }, s.prototype.last = function () {
      return this.is_empty() ? null : this.__items[ this.__items.length - 1 ]
    }, s.prototype.push = function ( t ) {
      this.__items.push( t ), this.__character_count += t.length
    }, s.prototype.push_raw = function ( t ) {
      this.push( t );
      var e = t.lastIndexOf( "\n" ); - 1 !== e && ( this.__character_count = t.length - e )
    }, s.prototype.pop = function () {
      var t = null;
      return this.is_empty() || ( t = this.__items.pop(), this.__character_count -= t.length ), t
    }, s.prototype.remove_indent = function () {
      0 < this.__indent_count && ( this.__indent_count -= 1, this.__character_count -= this.__parent.indent_size )
    }, s.prototype.trim = function () {
      for ( ;
        " " === this.last(); ) this.__items.pop(), this.__character_count -= 1
    }, s.prototype.toString = function () {
      var t = "";
      return this.is_empty() || ( t = this.__parent.get_indent_string( this.__indent_count, this.__alignment_count ), t += this.__items.join( "" ) ), t
    }, n.prototype.get_indent_size = function ( t, e ) {
      var i = this.__base_string_length;
      return e = e || 0, t < 0 && ( i = 0 ), i += t * this.__indent_size, i += e
    }, n.prototype.get_indent_string = function ( t, e ) {
      var i = this.__base_string;
      return e = e || 0, t < 0 && ( t = 0, i = "" ), e += t * this.__indent_size, this.__ensure_cache( e ), i += this.__cache[ e ]
    }, n.prototype.__ensure_cache = function ( t ) {
      for ( ; t >= this.__cache.length; ) this.__add_column()
    }, n.prototype.__add_column = function () {
      var t = this.__cache.length,
        e = 0,
        i = "";
      this.__indent_size && t >= this.__indent_size && ( t -= ( e = Math.floor( t / this.__indent_size ) ) * this.__indent_size, i = new Array( e + 1 ).join( this.__indent_string ) ), t && ( i += new Array( t + 1 ).join( " " ) ), this.__cache.push( i )
    }, _.prototype.__add_outputline = function () {
      this.previous_line = this.current_line, this.current_line = new s( this ), this.__lines.push( this.current_line )
    }, _.prototype.get_line_number = function () {
      return this.__lines.length
    }, _.prototype.get_indent_string = function ( t, e ) {
      return this.__indent_cache.get_indent_string( t, e )
    }, _.prototype.get_indent_size = function ( t, e ) {
      return this.__indent_cache.get_indent_size( t, e )
    }, _.prototype.is_empty = function () {
      return !this.previous_line && this.current_line.is_empty()
    }, _.prototype.add_new_line = function ( t ) {
      return !( this.is_empty() || !t && this.just_added_newline() ) && ( this.raw || this.__add_outputline(), !0 )
    }, _.prototype.get_code = function ( t ) {
      var e = this.__lines.join( "\n" ).replace( /[\r\n\t ]+$/, "" );
      return this._end_with_newline && ( e += "\n" ), "\n" !== t && ( e = e.replace( /[\n]/g, t ) ), e
    }, _.prototype.set_indent = function ( t, e ) {
      return t = t || 0, e = e || 0, 1 < this.__lines.length ? ( this.current_line.set_indent( t, e ), !0 ) : ( this.current_line.set_indent(), !1 )
    }, _.prototype.add_raw_token = function ( t ) {
      for ( var e = 0; e < t.newlines; e++ ) this.__add_outputline();
      this.current_line.push( t.whitespace_before ), this.current_line.push_raw( t.text ), this.space_before_token = !1
    }, _.prototype.add_token = function ( t ) {
      this.add_space_before_token(), this.current_line.push( t )
    }, _.prototype.add_space_before_token = function () {
      this.space_before_token && !this.just_added_newline() && this.current_line.push( " " ), this.space_before_token = !1
    }, _.prototype.remove_indent = function ( t ) {
      for ( var e = this.__lines.length; t < e; ) this.__lines[ t ].remove_indent(), t++
    }, _.prototype.trim = function ( t ) {
      for ( t = void 0 !== t && t, this.current_line.trim( this.indent_string, this.baseIndentString ); t && 1 < this.__lines.length && this.current_line.is_empty(); ) this.__lines.pop(), this.current_line = this.__lines[ this.__lines.length - 1 ], this.current_line.trim();
      this.previous_line = 1 < this.__lines.length ? this.__lines[ this.__lines.length - 2 ] : null
    }, _.prototype.just_added_newline = function () {
      return this.current_line.is_empty()
    }, _.prototype.just_added_blankline = function () {
      return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty()
    }, _.prototype.ensure_empty_line_above = function ( t, e ) {
      for ( var i = this.__lines.length - 2; 0 <= i; ) {
        var n = this.__lines[ i ];
        if ( n.is_empty() ) break;
        if ( 0 !== n.item( 0 ).indexOf( t ) && n.item( -1 ) !== e ) {
          this.__lines.splice( i + 1, 0, new s( this ) ), this.previous_line = this.__lines[ this.__lines.length - 2 ];
          break
        }
        i--
      }
    }, t.exports.Output = _
  }, , , , function ( t, e, i ) {
    "use strict";

    function n( t, e ) {
      this.raw_options = s( t, e ), this.disabled = this._get_boolean( "disabled" ), this.eol = this._get_characters( "eol", "auto" ), this.end_with_newline = this._get_boolean( "end_with_newline" ), this.indent_size = this._get_number( "indent_size", 4 ), this.indent_char = this._get_characters( "indent_char", " " ), this.indent_level = this._get_number( "indent_level" ), this.preserve_newlines = this._get_boolean( "preserve_newlines", !0 ), this.max_preserve_newlines = this._get_number( "max_preserve_newlines", 32786 ), this.preserve_newlines || ( this.max_preserve_newlines = 0 ), this.indent_with_tabs = this._get_boolean( "indent_with_tabs", "\t" === this.indent_char ), this.indent_with_tabs && ( this.indent_char = "\t", 1 === this.indent_size && ( this.indent_size = 4 ) ), this.wrap_line_length = this._get_number( "wrap_line_length", this._get_number( "max_char" ) )
    }

    function s( t, e ) {
      var i, n = {};
      for ( i in t = _( t ) ) i !== e && ( n[ i ] = t[ i ] );
      if ( e && t[ e ] )
        for ( i in t[ e ] ) n[ i ] = t[ e ][ i ];
      return n
    }

    function _( t ) {
      var e, i = {};
      for ( e in t ) {
        i[ e.replace( /-/g, "_" ) ] = t[ e ]
      }
      return i
    }
    n.prototype._get_array = function ( t, e ) {
      var i = this.raw_options[ t ],
        n = e || [];
      return "object" == typeof i ? null !== i && "function" == typeof i.concat && ( n = i.concat() ) : "string" == typeof i && ( n = i.split( /[^a-zA-Z0-9_\/\-]+/ ) ), n
    }, n.prototype._get_boolean = function ( t, e ) {
      var i = this.raw_options[ t ];
      return void 0 === i ? !!e : !!i
    }, n.prototype._get_characters = function ( t, e ) {
      var i = this.raw_options[ t ],
        n = e || "";
      return "string" == typeof i && ( n = i.replace( /\\r/, "\r" ).replace( /\\n/, "\n" ).replace( /\\t/, "\t" ) ), n
    }, n.prototype._get_number = function ( t, e ) {
      var i = this.raw_options[ t ];
      e = parseInt( e, 10 ), isNaN( e ) && ( e = 0 );
      var n = parseInt( i, 10 );
      return isNaN( n ) && ( n = e ), n
    }, n.prototype._get_selection = function ( t, e, i ) {
      var n = this._get_selection_list( t, e, i );
      if ( 1 !== n.length ) throw new Error( "Invalid Option Value: The option '" + t + "' can only be one of the following values:\n" + e + "\nYou passed in: '" + this.raw_options[ t ] + "'" );
      return n[ 0 ]
    }, n.prototype._get_selection_list = function ( t, e, i ) {
      if ( !e || 0 === e.length ) throw new Error( "Selection list cannot be empty." );
      if ( i = i || [ e[ 0 ] ], !this._is_valid_selection( i, e ) ) throw new Error( "Invalid Default Value!" );
      var n = this._get_array( t, i );
      if ( !this._is_valid_selection( n, e ) ) throw new Error( "Invalid Option Value: The option '" + t + "' can contain only the following values:\n" + e + "\nYou passed in: '" + this.raw_options[ t ] + "'" );
      return n
    }, n.prototype._is_valid_selection = function ( t, e ) {
      return t.length && e.length && !t.some( function ( t ) {
        return -1 === e.indexOf( t )
      } )
    }, t.exports.Options = n, t.exports.normalizeOpts = _, t.exports.mergeOpts = s
  }, , function ( t, e, i ) {
    "use strict";

    function n( t ) {
      this.__input = t || "", this.__input_length = this.__input.length, this.__position = 0
    }
    n.prototype.restart = function () {
      this.__position = 0
    }, n.prototype.back = function () {
      0 < this.__position && ( this.__position -= 1 )
    }, n.prototype.hasNext = function () {
      return this.__position < this.__input_length
    }, n.prototype.next = function () {
      var t = null;
      return this.hasNext() && ( t = this.__input.charAt( this.__position ), this.__position += 1 ), t
    }, n.prototype.peek = function ( t ) {
      var e = null;
      return t = t || 0, 0 <= ( t += this.__position ) && t < this.__input_length && ( e = this.__input.charAt( t ) ), e
    }, n.prototype.test = function ( t, e ) {
      if ( e = e || 0, e += this.__position, 0 <= ( t.lastIndex = e ) && e < this.__input_length ) {
        var i = t.exec( this.__input );
        return i && i.index === e
      }
      return !1
    }, n.prototype.testChar = function ( t, e ) {
      var i = this.peek( e );
      return null !== i && t.test( i )
    }, n.prototype.match = function ( t ) {
      t.lastIndex = this.__position;
      var e = t.exec( this.__input );
      return e && e.index === this.__position ? this.__position += e[ 0 ].length : e = null, e
    }, n.prototype.read = function ( t ) {
      var e = "",
        i = this.match( t );
      return i && ( e = i[ 0 ] ), e
    }, n.prototype.readUntil = function ( t, e ) {
      var i, n = this.__position;
      t.lastIndex = this.__position;
      var s = t.exec( this.__input );
      return n = s ? e ? s.index + s[ 0 ].length : s.index : this.__input_length, i = this.__input.substring( this.__position, n ), this.__position = n, i
    }, n.prototype.readUntilAfter = function ( t ) {
      return this.readUntil( t, !0 )
    }, n.prototype.peekUntilAfter = function ( t ) {
      var e = this.__position,
        i = this.readUntilAfter( t );
      return this.__position = e, i
    }, n.prototype.lookBack = function ( t ) {
      var e = this.__position - 1;
      return e >= t.length && this.__input.substring( e - t.length, e ).toLowerCase() === t
    }, t.exports.InputScanner = n
  }, , , , function ( t, e, i ) {
    "use strict";
    var n = i( 13 ).Beautifier,
      s = i( 14 ).Options;
    t.exports = function ( t, e ) {
      return new n( t, e ).beautify()
    }, t.exports.defaultOptions = function () {
      return new s
    }
  }, function ( t, e, i ) {
    "use strict";
    var n = i( 14 ).Options,
      l = i( 2 ).Output,
      d = i( 8 ).InputScanner,
      f = /\r\n|[\r\n]/,
      g = /\r\n|[\r\n]/g,
      y = /\s/,
      v = /(?:\s|\n)+/g,
      w = /\/\*(?:[\s\S]*?)((?:\*\/)|$)/g,
      b = /\/\/(?:[^\n\r\u2028\u2029]*)/g;

    function s( t, e ) {
      this._source_text = t || "", this._options = new n( e ), this._ch = null, this._input = null, this.NESTED_AT_RULE = {
        "@page": !0,
        "@font-face": !0,
        "@keyframes": !0,
        "@media": !0,
        "@supports": !0,
        "@document": !0
      }, this.CONDITIONAL_GROUP_RULE = {
        "@media": !0,
        "@supports": !0,
        "@document": !0
      }
    }
    s.prototype.eatString = function ( t ) {
      var e = "";
      for ( this._ch = this._input.next(); this._ch; ) {
        if ( e += this._ch, "\\" === this._ch ) e += this._input.next();
        else if ( -1 !== t.indexOf( this._ch ) || "\n" === this._ch ) break;
        this._ch = this._input.next()
      }
      return e
    }, s.prototype.eatWhitespace = function ( t ) {
      for ( var e = y.test( this._input.peek() ), i = !0; y.test( this._input.peek() ); ) this._ch = this._input.next(), t && "\n" === this._ch && ( this._options.preserve_newlines || i ) && ( i = !1, this._output.add_new_line( !0 ) );
      return e
    }, s.prototype.foundNestedPseudoClass = function () {
      for ( var t = 0, e = 1, i = this._input.peek( e ); i; ) {
        if ( "{" === i ) return !0;
        if ( "(" === i ) t += 1;
        else if ( ")" === i ) {
          if ( 0 === t ) return !1;
          t -= 1
        } else if ( ";" === i || "}" === i ) return !1;
        e++, i = this._input.peek( e )
      }
      return !1
    }, s.prototype.print_string = function ( t ) {
      this._output.just_added_newline() && this._output.set_indent( this._indentLevel ), this._output.add_token( t )
    }, s.prototype.preserveSingleSpace = function ( t ) {
      t && ( this._output.space_before_token = !0 )
    }, s.prototype.indent = function () {
      this._indentLevel++
    }, s.prototype.outdent = function () {
      0 < this._indentLevel && this._indentLevel--
    }, s.prototype.beautify = function () {
      if ( this._options.disabled ) return this._source_text;
      var t = this._source_text,
        e = this._options.eol;
      "auto" === e && ( e = "\n", t && f.test( t || "" ) && ( e = t.match( f )[ 0 ] ) );
      var i = ( t = t.replace( g, "\n" ) ).match( /^[\t ]*/ )[ 0 ];
      this._output = new l( this._options, i ), this._input = new d( t ), this._indentLevel = 0, this._nestedLevel = 0, this._ch = null;
      for ( var n = 0, s = !1, _ = !1, r = !1, h = !1, o = !1, p = this._ch;; ) {
        var u = "" !== this._input.read( v ),
          c = p;
        if ( this._ch = this._input.next(), p = this._ch, !this._ch ) break;
        if ( "/" === this._ch && "*" === this._input.peek() ) this._output.add_new_line(), this._input.back(), this.print_string( this._input.read( w ) ), this.eatWhitespace( !0 ), this._output.add_new_line();
        else if ( "/" === this._ch && "/" === this._input.peek() ) this._output.space_before_token = !0, this._input.back(), this.print_string( this._input.read( b ) ), this.eatWhitespace( !0 );
        else if ( "@" === this._ch )
          if ( this.preserveSingleSpace( u ), "{" === this._input.peek() ) this.print_string( this._ch + this.eatString( "}" ) );
          else {
            this.print_string( this._ch );
            var a = this._input.peekUntilAfter( /[: ,;{}()[\]\/='"]/g );
            a.match( /[ :]$/ ) && ( a = this.eatString( ": " ).replace( /\s$/, "" ), this.print_string( a ), this._output.space_before_token = !0 ), "extend" === ( a = a.replace( /\s$/, "" ) ) ? h = !0 : "import" === a && ( o = !0 ), a in this.NESTED_AT_RULE ? ( this._nestedLevel += 1, a in this.CONDITIONAL_GROUP_RULE && ( r = !0 ) ) : s || 0 !== n || -1 === a.indexOf( ":" ) || ( _ = !0, this.indent() )
          }
        else "#" === this._ch && "{" === this._input.peek() ? ( this.preserveSingleSpace( u ), this.print_string( this._ch + this.eatString( "}" ) ) ) : "{" === this._ch ? ( _ && ( _ = !1, this.outdent() ), this.indent(), this._output.space_before_token = !0, this.print_string( this._ch ), s = r ? ( r = !1, this._indentLevel > this._nestedLevel ) : this._indentLevel >= this._nestedLevel, this._options.newline_between_rules && s && this._output.previous_line && "{" !== this._output.previous_line.item( -1 ) && this._output.ensure_empty_line_above( "/", "," ), this.eatWhitespace( !0 ), this._output.add_new_line() ) : "}" === this._ch ? ( this.outdent(), this._output.add_new_line(), "{" === c && this._output.trim( !0 ), h = o = !1, _ && ( this.outdent(), _ = !1 ), this.print_string( this._ch ), s = !1, this._nestedLevel && this._nestedLevel--, this.eatWhitespace( !0 ), this._output.add_new_line(), this._options.newline_between_rules && !this._output.just_added_blankline() && "}" !== this._input.peek() && this._output.add_new_line( !0 ) ) : ":" === this._ch ? !s && !r || this._input.lookBack( "&" ) || this.foundNestedPseudoClass() || this._input.lookBack( "(" ) || h ? ( this._input.lookBack( " " ) && ( this._output.space_before_token = !0 ), ":" === this._input.peek() ? ( this._ch = this._input.next(), this.print_string( "::" ) ) : this.print_string( ":" ) ) : ( this.print_string( ":" ), _ || ( _ = !0, this._output.space_before_token = !0, this.eatWhitespace( !0 ), this.indent() ) ) : '"' === this._ch || "'" === this._ch ? ( this.preserveSingleSpace( u ), this.print_string( this._ch + this.eatString( this._ch ) ), this.eatWhitespace( !0 ) ) : ";" === this._ch ? ( _ && ( this.outdent(), _ = !1 ), o = h = !1, this.print_string( this._ch ), this.eatWhitespace( !0 ), "/" !== this._input.peek() && this._output.add_new_line() ) : "(" === this._ch ? this._input.lookBack( "url" ) ? ( this.print_string( this._ch ), this.eatWhitespace(), this._ch = this._input.next(), ")" === this._ch || '"' === this._ch || "'" === this._ch ? ( this._input.back(), n++ ) : this._ch && this.print_string( this._ch + this.eatString( ")" ) ) ) : ( n++, this.preserveSingleSpace( u ), this.print_string( this._ch ), this.eatWhitespace() ) : ")" === this._ch ? ( this.print_string( this._ch ), n-- ) : "," === this._ch ? ( this.print_string( this._ch ), this.eatWhitespace( !0 ), this._options.selector_separator_newline && !_ && n < 1 && !o ? this._output.add_new_line() : this._output.space_before_token = !0 ) : ( ">" === this._ch || "+" === this._ch || "~" === this._ch ) && !_ && n < 1 ? this._options.space_around_combinator ? ( this._output.space_before_token = !0, this.print_string( this._ch ), this._output.space_before_token = !0 ) : ( this.print_string( this._ch ), this.eatWhitespace(), this._ch && y.test( this._ch ) && ( this._ch = "" ) ) : "]" === this._ch ? this.print_string( this._ch ) : "[" === this._ch ? ( this.preserveSingleSpace( u ), this.print_string( this._ch ) ) : "=" === this._ch ? ( this.eatWhitespace(), this.print_string( "=" ), y.test( this._ch ) && ( this._ch = "" ) ) : ( "!" === this._ch ? this.print_string( " " ) : this.preserveSingleSpace( u ), this.print_string( this._ch ) )
      }
      return this._output.get_code( e )
    }, t.exports.Beautifier = s
  }, function ( t, e, i ) {
    "use strict";
    var n = i( 6 ).Options;

    function s( t ) {
      n.call( this, t, "css" ), this.selector_separator_newline = this._get_boolean( "selector_separator_newline", !0 ), this.newline_between_rules = this._get_boolean( "newline_between_rules", !0 );
      var e = this._get_boolean( "space_around_selector_separator" );
      this.space_around_combinator = this._get_boolean( "space_around_combinator" ) || e
    }
    s.prototype = new n, t.exports.Options = s
  } ] );
  "function" == typeof define && define.amd ? define( [], function () {
    return {
      css_beautify: t
    }
  } ) : "undefined" != typeof exports ? exports.css_beautify = t : "undefined" != typeof window ? window.css_beautify = t : "undefined" != typeof global && ( global.css_beautify = t )
}();
