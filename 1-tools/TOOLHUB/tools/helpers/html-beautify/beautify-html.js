( function () {
  var legacy_beautify_html = ( function ( modules ) {
      var installedModules = {};

      function __webpack_require__( moduleId ) {
        if ( installedModules[ moduleId ] ) {
          return installedModules[ moduleId ].exports;
        }
        var module = installedModules[ moduleId ] = {
          i: moduleId,
          l: false,
          exports: {}
        };
        modules[ moduleId ].call( module.exports, module, module.exports, __webpack_require__ );
        module.l = true;
        return module.exports;
      }
      __webpack_require__.m = modules;
      __webpack_require__.c = installedModules;
      __webpack_require__.d = function ( exports, name, getter ) {
        if ( !__webpack_require__.o( exports, name ) ) {
          Object.defineProperty( exports, name, {
            enumerable: true,
            get: getter
          } );
        }
      };
      __webpack_require__.r = function ( exports ) {
        if ( typeof Symbol !== 'undefined' && Symbol.toStringTag ) {
          Object.defineProperty( exports, Symbol.toStringTag, {
            value: 'Module'
          } );
        }
        Object.defineProperty( exports, '__esModule', {
          value: true
        } );
      };
      __webpack_require__.t = function ( value, mode ) {
        if ( mode & 1 ) value = __webpack_require__( value );
        if ( mode & 8 ) return value;
        if ( ( mode & 4 ) && typeof value === 'object' && value && value.__esModule ) return value;
        var ns = Object.create( null );
        __webpack_require__.r( ns );
        Object.defineProperty( ns, 'default', {
          enumerable: true,
          value: value
        } );
        if ( mode & 2 && typeof value != 'string' )
          for ( var key in value ) __webpack_require__.d( ns, key, function ( key ) {
            return value[ key ];
          }.bind( null, key ) );
        return ns;
      };
      __webpack_require__.n = function ( module ) {
        var getter = module && module.__esModule ? function getDefault() {
          return module[ 'default' ];
        } : function getModuleExports() {
          return module;
        };
        __webpack_require__.d( getter, 'a', getter );
        return getter;
      };
      __webpack_require__.o = function ( object, property ) {
        return Object.prototype.hasOwnProperty.call( object, property );
      };
      __webpack_require__.p = "";
      return __webpack_require__( __webpack_require__.s = 15 );
    } )
    ( [ , , ( function ( module, exports, __webpack_require__ ) {
      "use strict";

      function OutputLine( parent ) {
        this.__parent = parent;
        this.__character_count = 0;
        this.__indent_count = -1;
        this.__alignment_count = 0;
        this.__items = [];
      }
      OutputLine.prototype.item = function ( index ) {
        if ( index < 0 ) {
          return this.__items[ this.__items.length + index ];
        } else {
          return this.__items[ index ];
        }
      };
      OutputLine.prototype.has_match = function ( pattern ) {
        for ( var lastCheckedOutput = this.__items.length - 1; lastCheckedOutput >= 0; lastCheckedOutput-- ) {
          if ( this.__items[ lastCheckedOutput ].match( pattern ) ) {
            return true;
          }
        }
        return false;
      };
      OutputLine.prototype.set_indent = function ( indent, alignment ) {
        this.__indent_count = indent || 0;
        this.__alignment_count = alignment || 0;
        this.__character_count = this.__parent.get_indent_size( this.__indent_count, this.__alignment_count );
      };
      OutputLine.prototype.get_character_count = function () {
        return this.__character_count;
      };
      OutputLine.prototype.is_empty = function () {
        return this.__items.length === 0;
      };
      OutputLine.prototype.last = function () {
        if ( !this.is_empty() ) {
          return this.__items[ this.__items.length - 1 ];
        } else {
          return null;
        }
      };
      OutputLine.prototype.push = function ( item ) {
        this.__items.push( item );
        this.__character_count += item.length;
      };
      OutputLine.prototype.push_raw = function ( item ) {
        this.push( item );
        var last_newline_index = item.lastIndexOf( '\n' );
        if ( last_newline_index !== -1 ) {
          this.__character_count = item.length - last_newline_index;
        }
      };
      OutputLine.prototype.pop = function () {
        var item = null;
        if ( !this.is_empty() ) {
          item = this.__items.pop();
          this.__character_count -= item.length;
        }
        return item;
      };
      OutputLine.prototype.remove_indent = function () {
        if ( this.__indent_count > 0 ) {
          this.__indent_count -= 1;
          this.__character_count -= this.__parent.indent_size;
        }
      };
      OutputLine.prototype.trim = function () {
        while ( this.last() === ' ' ) {
          this.__items.pop();
          this.__character_count -= 1;
        }
      };
      OutputLine.prototype.toString = function () {
        var result = '';
        if ( !this.is_empty() ) {
          result = this.__parent.get_indent_string( this.__indent_count, this.__alignment_count );
          result += this.__items.join( '' );
        }
        return result;
      };

      function IndentStringCache( options, baseIndentString ) {
        this.__cache = [ '' ];
        this.__indent_size = options.indent_size;
        this.__indent_string = options.indent_char;
        if ( !options.indent_with_tabs ) {
          this.__indent_string = new Array( options.indent_size + 1 ).join( options.indent_char );
        }
        baseIndentString = baseIndentString || '';
        if ( options.indent_level > 0 ) {
          baseIndentString = new Array( options.indent_level + 1 ).join( this.__indent_string );
        }
        this.__base_string = baseIndentString;
        this.__base_string_length = baseIndentString.length;
      }
      IndentStringCache.prototype.get_indent_size = function ( indent, column ) {
        var result = this.__base_string_length;
        column = column || 0;
        if ( indent < 0 ) {
          result = 0;
        }
        result += indent * this.__indent_size;
        result += column;
        return result;
      };
      IndentStringCache.prototype.get_indent_string = function ( indent_level, column ) {
        var result = this.__base_string;
        column = column || 0;
        if ( indent_level < 0 ) {
          indent_level = 0;
          result = '';
        }
        column += indent_level * this.__indent_size;
        this.__ensure_cache( column );
        result += this.__cache[ column ];
        return result;
      };
      IndentStringCache.prototype.__ensure_cache = function ( column ) {
        while ( column >= this.__cache.length ) {
          this.__add_column();
        }
      };
      IndentStringCache.prototype.__add_column = function () {
        var column = this.__cache.length;
        var indent = 0;
        var result = '';
        if ( this.__indent_size && column >= this.__indent_size ) {
          indent = Math.floor( column / this.__indent_size );
          column -= indent * this.__indent_size;
          result = new Array( indent + 1 ).join( this.__indent_string );
        }
        if ( column ) {
          result += new Array( column + 1 ).join( ' ' );
        }
        this.__cache.push( result );
      };

      function Output( options, baseIndentString ) {
        this.__indent_cache = new IndentStringCache( options, baseIndentString );
        this.raw = false;
        this._end_with_newline = options.end_with_newline;
        this.indent_size = options.indent_size;
        this.__lines = [];
        this.previous_line = null;
        this.current_line = null;
        this.space_before_token = false;
        this.__add_outputline();
      }
      Output.prototype.__add_outputline = function () {
        this.previous_line = this.current_line;
        this.current_line = new OutputLine( this );
        this.__lines.push( this.current_line );
      };
      Output.prototype.get_line_number = function () {
        return this.__lines.length;
      };
      Output.prototype.get_indent_string = function ( indent, column ) {
        return this.__indent_cache.get_indent_string( indent, column );
      };
      Output.prototype.get_indent_size = function ( indent, column ) {
        return this.__indent_cache.get_indent_size( indent, column );
      };
      Output.prototype.is_empty = function () {
        return !this.previous_line && this.current_line.is_empty();
      };
      Output.prototype.add_new_line = function ( force_newline ) {
        if ( this.is_empty() || ( !force_newline && this.just_added_newline() ) ) {
          return false;
        }
        if ( !this.raw ) {
          this.__add_outputline();
        }
        return true;
      };
      Output.prototype.get_code = function ( eol ) {
        var sweet_code = this.__lines.join( '\n' ).replace( /[\r\n\t ]+$/, '' );
        if ( this._end_with_newline ) {
          sweet_code += '\n';
        }
        if ( eol !== '\n' ) {
          sweet_code = sweet_code.replace( /[\n]/g, eol );
        }
        return sweet_code;
      };
      Output.prototype.set_indent = function ( indent, alignment ) {
        indent = indent || 0;
        alignment = alignment || 0;
        if ( this.__lines.length > 1 ) {
          this.current_line.set_indent( indent, alignment );
          return true;
        }
        this.current_line.set_indent();
        return false;
      };
      Output.prototype.add_raw_token = function ( token ) {
        for ( var x = 0; x < token.newlines; x++ ) {
          this.__add_outputline();
        }
        this.current_line.push( token.whitespace_before );
        this.current_line.push_raw( token.text );
        this.space_before_token = false;
      };
      Output.prototype.add_token = function ( printable_token ) {
        this.add_space_before_token();
        this.current_line.push( printable_token );
      };
      Output.prototype.add_space_before_token = function () {
        if ( this.space_before_token && !this.just_added_newline() ) {
          this.current_line.push( ' ' );
        }
        this.space_before_token = false;
      };
      Output.prototype.remove_indent = function ( index ) {
        var output_length = this.__lines.length;
        while ( index < output_length ) {
          this.__lines[ index ].remove_indent();
          index++;
        }
      };
      Output.prototype.trim = function ( eat_newlines ) {
        eat_newlines = ( eat_newlines === undefined ) ? false : eat_newlines;
        this.current_line.trim( this.indent_string, this.baseIndentString );
        while ( eat_newlines && this.__lines.length > 1 && this.current_line.is_empty() ) {
          this.__lines.pop();
          this.current_line = this.__lines[ this.__lines.length - 1 ];
          this.current_line.trim();
        }
        this.previous_line = this.__lines.length > 1 ? this.__lines[ this.__lines.length - 2 ] : null;
      };
      Output.prototype.just_added_newline = function () {
        return this.current_line.is_empty();
      };
      Output.prototype.just_added_blankline = function () {
        return this.is_empty() || ( this.current_line.is_empty() && this.previous_line.is_empty() );
      };
      Output.prototype.ensure_empty_line_above = function ( starts_with, ends_with ) {
        var index = this.__lines.length - 2;
        while ( index >= 0 ) {
          var potentialEmptyLine = this.__lines[ index ];
          if ( potentialEmptyLine.is_empty() ) {
            break;
          } else if ( potentialEmptyLine.item( 0 ).indexOf( starts_with ) !== 0 && potentialEmptyLine.item( -1 ) !== ends_with ) {
            this.__lines.splice( index + 1, 0, new OutputLine( this ) );
            this.previous_line = this.__lines[ this.__lines.length - 2 ];
            break;
          }
          index--;
        }
      };
      module.exports.Output = Output;
    } ), ( function ( module, exports, __webpack_require__ ) {
      "use strict";

      function Token( type, text, newlines, whitespace_before ) {
        this.type = type;
        this.text = text;
        this.comments_before = null;
        this.newlines = newlines || 0;
        this.whitespace_before = whitespace_before || '';
        this.parent = null;
        this.next = null;
        this.previous = null;
        this.opened = null;
        this.closed = null;
        this.directives = null;
      }
      module.exports.Token = Token;
    } ), , , ( function ( module, exports, __webpack_require__ ) {
      "use strict";

      function Options( options, merge_child_field ) {
        this.raw_options = _mergeOpts( options, merge_child_field );
        this.disabled = this._get_boolean( 'disabled' );
        this.eol = this._get_characters( 'eol', 'auto' );
        this.end_with_newline = this._get_boolean( 'end_with_newline' );
        this.indent_size = this._get_number( 'indent_size', 4 );
        this.indent_char = this._get_characters( 'indent_char', ' ' );
        this.indent_level = this._get_number( 'indent_level' );
        this.preserve_newlines = this._get_boolean( 'preserve_newlines', true );
        this.max_preserve_newlines = this._get_number( 'max_preserve_newlines', 32786 );
        if ( !this.preserve_newlines ) {
          this.max_preserve_newlines = 0;
        }
        this.indent_with_tabs = this._get_boolean( 'indent_with_tabs', this.indent_char === '\t' );
        if ( this.indent_with_tabs ) {
          this.indent_char = '\t';
          if ( this.indent_size === 1 ) {
            this.indent_size = 4;
          }
        }
        this.wrap_line_length = this._get_number( 'wrap_line_length', this._get_number( 'max_char' ) );
      }
      Options.prototype._get_array = function ( name, default_value ) {
        var option_value = this.raw_options[ name ];
        var result = default_value || [];
        if ( typeof option_value === 'object' ) {
          if ( option_value !== null && typeof option_value.concat === 'function' ) {
            result = option_value.concat();
          }
        } else if ( typeof option_value === 'string' ) {
          result = option_value.split( /[^a-zA-Z0-9_\/\-]+/ );
        }
        return result;
      };
      Options.prototype._get_boolean = function ( name, default_value ) {
        var option_value = this.raw_options[ name ];
        var result = option_value === undefined ? !!default_value : !!option_value;
        return result;
      };
      Options.prototype._get_characters = function ( name, default_value ) {
        var option_value = this.raw_options[ name ];
        var result = default_value || '';
        if ( typeof option_value === 'string' ) {
          result = option_value.replace( /\\r/, '\r' ).replace( /\\n/, '\n' ).replace( /\\t/, '\t' );
        }
        return result;
      };
      Options.prototype._get_number = function ( name, default_value ) {
        var option_value = this.raw_options[ name ];
        default_value = parseInt( default_value, 10 );
        if ( isNaN( default_value ) ) {
          default_value = 0;
        }
        var result = parseInt( option_value, 10 );
        if ( isNaN( result ) ) {
          result = default_value;
        }
        return result;
      };
      Options.prototype._get_selection = function ( name, selection_list, default_value ) {
        var result = this._get_selection_list( name, selection_list, default_value );
        if ( result.length !== 1 ) {
          throw new Error( "Invalid Option Value: The option '" + name + "' can only be one of the following values:\n" +
            selection_list + "\nYou passed in: '" + this.raw_options[ name ] + "'" );
        }
        return result[ 0 ];
      };
      Options.prototype._get_selection_list = function ( name, selection_list, default_value ) {
        if ( !selection_list || selection_list.length === 0 ) {
          throw new Error( "Selection list cannot be empty." );
        }
        default_value = default_value || [ selection_list[ 0 ] ];
        if ( !this._is_valid_selection( default_value, selection_list ) ) {
          throw new Error( "Invalid Default Value!" );
        }
        var result = this._get_array( name, default_value );
        if ( !this._is_valid_selection( result, selection_list ) ) {
          throw new Error( "Invalid Option Value: The option '" + name + "' can contain only the following values:\n" +
            selection_list + "\nYou passed in: '" + this.raw_options[ name ] + "'" );
        }
        return result;
      };
      Options.prototype._is_valid_selection = function ( result, selection_list ) {
        return result.length && selection_list.length && !result.some( function ( item ) {
          return selection_list.indexOf( item ) === -1;
        } );
      };

      function _mergeOpts( allOptions, childFieldName ) {
        var finalOpts = {};
        allOptions = _normalizeOpts( allOptions );
        var name;
        for ( name in allOptions ) {
          if ( name !== childFieldName ) {
            finalOpts[ name ] = allOptions[ name ];
          }
        }
        if ( childFieldName && allOptions[ childFieldName ] ) {
          for ( name in allOptions[ childFieldName ] ) {
            finalOpts[ name ] = allOptions[ childFieldName ][ name ];
          }
        }
        return finalOpts;
      }

      function _normalizeOpts( options ) {
        var convertedOpts = {};
        var key;
        for ( key in options ) {
          var newKey = key.replace( /-/g, "_" );
          convertedOpts[ newKey ] = options[ key ];
        }
        return convertedOpts;
      }
      module.exports.Options = Options;
      module.exports.normalizeOpts = _normalizeOpts;
      module.exports.mergeOpts = _mergeOpts;
    } ), , ( function ( module, exports, __webpack_require__ ) {
      "use strict";

      function InputScanner( input_string ) {
        this.__input = input_string || '';
        this.__input_length = this.__input.length;
        this.__position = 0;
      }
      InputScanner.prototype.restart = function () {
        this.__position = 0;
      };
      InputScanner.prototype.back = function () {
        if ( this.__position > 0 ) {
          this.__position -= 1;
        }
      };
      InputScanner.prototype.hasNext = function () {
        return this.__position < this.__input_length;
      };
      InputScanner.prototype.next = function () {
        var val = null;
        if ( this.hasNext() ) {
          val = this.__input.charAt( this.__position );
          this.__position += 1;
        }
        return val;
      };
      InputScanner.prototype.peek = function ( index ) {
        var val = null;
        index = index || 0;
        index += this.__position;
        if ( index >= 0 && index < this.__input_length ) {
          val = this.__input.charAt( index );
        }
        return val;
      };
      InputScanner.prototype.test = function ( pattern, index ) {
        index = index || 0;
        index += this.__position;
        pattern.lastIndex = index;
        if ( index >= 0 && index < this.__input_length ) {
          var pattern_match = pattern.exec( this.__input );
          return pattern_match && pattern_match.index === index;
        } else {
          return false;
        }
      };
      InputScanner.prototype.testChar = function ( pattern, index ) {
        var val = this.peek( index );
        return val !== null && pattern.test( val );
      };
      InputScanner.prototype.match = function ( pattern ) {
        pattern.lastIndex = this.__position;
        var pattern_match = pattern.exec( this.__input );
        if ( pattern_match && pattern_match.index === this.__position ) {
          this.__position += pattern_match[ 0 ].length;
        } else {
          pattern_match = null;
        }
        return pattern_match;
      };
      InputScanner.prototype.read = function ( pattern ) {
        var val = '';
        var match = this.match( pattern );
        if ( match ) {
          val = match[ 0 ];
        }
        return val;
      };
      InputScanner.prototype.readUntil = function ( pattern, include_match ) {
        var val = '';
        var match_index = this.__position;
        pattern.lastIndex = this.__position;
        var pattern_match = pattern.exec( this.__input );
        if ( pattern_match ) {
          if ( include_match ) {
            match_index = pattern_match.index + pattern_match[ 0 ].length;
          } else {
            match_index = pattern_match.index;
          }
        } else {
          match_index = this.__input_length;
        }
        val = this.__input.substring( this.__position, match_index );
        this.__position = match_index;
        return val;
      };
      InputScanner.prototype.readUntilAfter = function ( pattern ) {
        return this.readUntil( pattern, true );
      };
      InputScanner.prototype.peekUntilAfter = function ( pattern ) {
        var start = this.__position;
        var val = this.readUntilAfter( pattern );
        this.__position = start;
        return val;
      };
      InputScanner.prototype.lookBack = function ( testVal ) {
        var start = this.__position - 1;
        return start >= testVal.length && this.__input.substring( start - testVal.length, start ).toLowerCase() === testVal;
      };
      module.exports.InputScanner = InputScanner;
    } ), ( function ( module, exports, __webpack_require__ ) {
      "use strict";
      var InputScanner = __webpack_require__( 8 ).InputScanner;
      var Token = __webpack_require__( 3 ).Token;
      var TokenStream = __webpack_require__( 10 ).TokenStream;
      var TOKEN = {
        START: 'TK_START',
        RAW: 'TK_RAW',
        EOF: 'TK_EOF'
      };
      var Tokenizer = function ( input_string, options ) {
        this._input = new InputScanner( input_string );
        this._options = options || {};
        this.__tokens = null;
        this.__newline_count = 0;
        this.__whitespace_before_token = '';
        this._whitespace_pattern = /[\n\r\t ]+/g;
        this._newline_pattern = /([^\n\r]*)(\r\n|[\n\r])?/g;
      };
      Tokenizer.prototype.tokenize = function () {
        this._input.restart();
        this.__tokens = new TokenStream();
        this._reset();
        var current;
        var previous = new Token( TOKEN.START, '' );
        var open_token = null;
        var open_stack = [];
        var comments = new TokenStream();
        while ( previous.type !== TOKEN.EOF ) {
          current = this._get_next_token( previous, open_token );
          while ( this._is_comment( current ) ) {
            comments.add( current );
            current = this._get_next_token( previous, open_token );
          }
          if ( !comments.isEmpty() ) {
            current.comments_before = comments;
            comments = new TokenStream();
          }
          current.parent = open_token;
          if ( this._is_opening( current ) ) {
            open_stack.push( open_token );
            open_token = current;
          } else if ( open_token && this._is_closing( current, open_token ) ) {
            current.opened = open_token;
            open_token.closed = current;
            open_token = open_stack.pop();
            current.parent = open_token;
          }
          current.previous = previous;
          previous.next = current;
          this.__tokens.add( current );
          previous = current;
        }
        return this.__tokens;
      };
      Tokenizer.prototype._is_first_token = function () {
        return this.__tokens.isEmpty();
      };
      Tokenizer.prototype._reset = function () {};
      Tokenizer.prototype._get_next_token = function ( previous_token, open_token ) {
        this._readWhitespace();
        var resulting_string = this._input.read( /.+/g );
        if ( resulting_string ) {
          return this._create_token( TOKEN.RAW, resulting_string );
        } else {
          return this._create_token( TOKEN.EOF, '' );
        }
      };
      Tokenizer.prototype._is_comment = function ( current_token ) {
        return false;
      };
      Tokenizer.prototype._is_opening = function ( current_token ) {
        return false;
      };
      Tokenizer.prototype._is_closing = function ( current_token, open_token ) {
        return false;
      };
      Tokenizer.prototype._create_token = function ( type, text ) {
        var token = new Token( type, text, this.__newline_count, this.__whitespace_before_token );
        this.__newline_count = 0;
        this.__whitespace_before_token = '';
        return token;
      };
      Tokenizer.prototype._readWhitespace = function () {
        var resulting_string = this._input.read( this._whitespace_pattern );
        if ( resulting_string === ' ' ) {
          this.__whitespace_before_token = resulting_string;
        } else if ( resulting_string !== '' ) {
          this._newline_pattern.lastIndex = 0;
          var nextMatch = this._newline_pattern.exec( resulting_string );
          while ( nextMatch[ 2 ] ) {
            this.__newline_count += 1;
            nextMatch = this._newline_pattern.exec( resulting_string );
          }
          this.__whitespace_before_token = nextMatch[ 1 ];
        }
      };
      module.exports.Tokenizer = Tokenizer;
      module.exports.TOKEN = TOKEN;
    } ), ( function ( module, exports, __webpack_require__ ) {
      "use strict";

      function TokenStream( parent_token ) {
        this.__tokens = [];
        this.__tokens_length = this.__tokens.length;
        this.__position = 0;
        this.__parent_token = parent_token;
      }
      TokenStream.prototype.restart = function () {
        this.__position = 0;
      };
      TokenStream.prototype.isEmpty = function () {
        return this.__tokens_length === 0;
      };
      TokenStream.prototype.hasNext = function () {
        return this.__position < this.__tokens_length;
      };
      TokenStream.prototype.next = function () {
        var val = null;
        if ( this.hasNext() ) {
          val = this.__tokens[ this.__position ];
          this.__position += 1;
        }
        return val;
      };
      TokenStream.prototype.peek = function ( index ) {
        var val = null;
        index = index || 0;
        index += this.__position;
        if ( index >= 0 && index < this.__tokens_length ) {
          val = this.__tokens[ index ];
        }
        return val;
      };
      TokenStream.prototype.add = function ( token ) {
        if ( this.__parent_token ) {
          token.parent = this.__parent_token;
        }
        this.__tokens.push( token );
        this.__tokens_length += 1;
      };
      module.exports.TokenStream = TokenStream;
    } ), ( function ( module, exports, __webpack_require__ ) {
      "use strict";

      function Directives( start_block_pattern, end_block_pattern ) {
        start_block_pattern = typeof start_block_pattern === 'string' ? start_block_pattern : start_block_pattern.source;
        end_block_pattern = typeof end_block_pattern === 'string' ? end_block_pattern : end_block_pattern.source;
        this.__directives_block_pattern = new RegExp( start_block_pattern + / beautify( \w+[:]\w+)+ /.source + end_block_pattern, 'g' );
        this.__directive_pattern = / (\w+)[:](\w+)/g;
        this.__directives_end_ignore_pattern = new RegExp( '(?:[\\s\\S]*?)((?:' + start_block_pattern + /\sbeautify\signore:end\s/.source + end_block_pattern + ')|$)', 'g' );
      }
      Directives.prototype.get_directives = function ( text ) {
        if ( !text.match( this.__directives_block_pattern ) ) {
          return null;
        }
        var directives = {};
        this.__directive_pattern.lastIndex = 0;
        var directive_match = this.__directive_pattern.exec( text );
        while ( directive_match ) {
          directives[ directive_match[ 1 ] ] = directive_match[ 2 ];
          directive_match = this.__directive_pattern.exec( text );
        }
        return directives;
      };
      Directives.prototype.readIgnored = function ( input ) {
        return input.read( this.__directives_end_ignore_pattern );
      };
      module.exports.Directives = Directives;
    } ), , , , ( function ( module, exports, __webpack_require__ ) {
      "use strict";
      var Beautifier = __webpack_require__( 16 ).Beautifier,
        Options = __webpack_require__( 17 ).Options;

      function style_html( html_source, options, js_beautify, css_beautify ) {
        var beautifier = new Beautifier( html_source, options, js_beautify, css_beautify );
        return beautifier.beautify();
      }
      module.exports = style_html;
      module.exports.defaultOptions = function () {
        return new Options();
      };
    } ), ( function ( module, exports, __webpack_require__ ) {
      "use strict";
      var Options = __webpack_require__( 17 ).Options;
      var Output = __webpack_require__( 2 ).Output;
      var Tokenizer = __webpack_require__( 18 ).Tokenizer;
      var TOKEN = __webpack_require__( 18 ).TOKEN;
      var lineBreak = /\r\n|[\r\n]/;
      var allLineBreaks = /\r\n|[\r\n]/g;
      var Printer = function ( options, base_indent_string ) {
        this.indent_level = 0;
        this.alignment_size = 0;
        this.wrap_line_length = options.wrap_line_length;
        this.max_preserve_newlines = options.max_preserve_newlines;
        this.preserve_newlines = options.preserve_newlines;
        this._output = new Output( options, base_indent_string );
      };
      Printer.prototype.current_line_has_match = function ( pattern ) {
        return this._output.current_line.has_match( pattern );
      };
      Printer.prototype.set_space_before_token = function ( value ) {
        this._output.space_before_token = value;
      };
      Printer.prototype.add_raw_token = function ( token ) {
        this._output.add_raw_token( token );
      };
      Printer.prototype.print_preserved_newlines = function ( raw_token ) {
        var newlines = 0;
        if ( raw_token.type !== TOKEN.TEXT && raw_token.previous.type !== TOKEN.TEXT ) {
          newlines = raw_token.newlines ? 1 : 0;
        }
        if ( this.preserve_newlines ) {
          newlines = raw_token.newlines < this.max_preserve_newlines + 1 ? raw_token.newlines : this.max_preserve_newlines + 1;
        }
        for ( var n = 0; n < newlines; n++ ) {
          this.print_newline( n > 0 );
        }
        return newlines !== 0;
      };
      Printer.prototype.traverse_whitespace = function ( raw_token ) {
        if ( raw_token.whitespace_before || raw_token.newlines ) {
          if ( !this.print_preserved_newlines( raw_token ) ) {
            this._output.space_before_token = true;
            this.print_space_or_wrap( raw_token.text );
          }
          return true;
        }
        return false;
      };
      Printer.prototype.print_space_or_wrap = function ( text ) {
        if ( this.wrap_line_length ) {
          if ( this._output.current_line.get_character_count() + text.length + 1 >= this.wrap_line_length ) {
            return this._output.add_new_line();
          }
        }
        return false;
      };
      Printer.prototype.print_newline = function ( force ) {
        this._output.add_new_line( force );
      };
      Printer.prototype.print_token = function ( text ) {
        if ( text ) {
          if ( this._output.current_line.is_empty() ) {
            this._output.set_indent( this.indent_level, this.alignment_size );
          }
          this._output.add_token( text );
        }
      };
      Printer.prototype.print_raw_text = function ( text ) {
        this._output.current_line.push_raw( text );
      };
      Printer.prototype.indent = function () {
        this.indent_level++;
      };
      Printer.prototype.unindent = function () {
        if ( this.indent_level > 0 ) {
          this.indent_level--;
        }
      };
      Printer.prototype.get_full_indent = function ( level ) {
        level = this.indent_level + ( level || 0 );
        if ( level < 1 ) {
          return '';
        }
        return this._output.get_indent_string( level );
      };
      var get_type_attribute = function ( start_token ) {
        var result = null;
        var raw_token = start_token.next;
        while ( raw_token.type !== TOKEN.EOF && start_token.closed !== raw_token ) {
          if ( raw_token.type === TOKEN.ATTRIBUTE && raw_token.text === 'type' ) {
            if ( raw_token.next && raw_token.next.type === TOKEN.EQUALS && raw_token.next.next && raw_token.next.next.type === TOKEN.VALUE ) {
              result = raw_token.next.next.text;
            }
            break;
          }
          raw_token = raw_token.next;
        }
        return result;
      };
      var get_custom_beautifier_name = function ( tag_check, raw_token ) {
        var typeAttribute = null;
        var result = null;
        if ( !raw_token.closed ) {
          return null;
        }
        if ( tag_check === 'script' ) {
          typeAttribute = 'text/javascript';
        } else if ( tag_check === 'style' ) {
          typeAttribute = 'text/css';
        }
        typeAttribute = get_type_attribute( raw_token ) || typeAttribute;
        if ( typeAttribute.search( 'text/css' ) > -1 ) {
          result = 'css';
        } else if ( typeAttribute.search( /(text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect)/ ) > -1 ) {
          result = 'javascript';
        } else if ( typeAttribute.search( /(text|application|dojo)\/(x-)?(html)/ ) > -1 ) {
          result = 'html';
        } else if ( typeAttribute.search( /test\/null/ ) > -1 ) {
          result = 'null';
        }
        return result;
      };

      function in_array( what, arr ) {
        return arr.indexOf( what ) !== -1;
      }

      function TagFrame( parent, parser_token, indent_level ) {
        this.parent = parent || null;
        this.tag = parser_token ? parser_token.tag_name : '';
        this.indent_level = indent_level || 0;
        this.parser_token = parser_token || null;
      }

      function TagStack( printer ) {
        this._printer = printer;
        this._current_frame = null;
      }
      TagStack.prototype.get_parser_token = function () {
        return this._current_frame ? this._current_frame.parser_token : null;
      };
      TagStack.prototype.record_tag = function ( parser_token ) {
        var new_frame = new TagFrame( this._current_frame, parser_token, this._printer.indent_level );
        this._current_frame = new_frame;
      };
      TagStack.prototype._try_pop_frame = function ( frame ) {
        var parser_token = null;
        if ( frame ) {
          parser_token = frame.parser_token;
          this._printer.indent_level = frame.indent_level;
          this._current_frame = frame.parent;
        }
        return parser_token;
      };
      TagStack.prototype._get_frame = function ( tag_list, stop_list ) {
        var frame = this._current_frame;
        while ( frame ) {
          if ( tag_list.indexOf( frame.tag ) !== -1 ) {
            break;
          } else if ( stop_list && stop_list.indexOf( frame.tag ) !== -1 ) {
            frame = null;
            break;
          }
          frame = frame.parent;
        }
        return frame;
      };
      TagStack.prototype.try_pop = function ( tag, stop_list ) {
        var frame = this._get_frame( [ tag ], stop_list );
        return this._try_pop_frame( frame );
      };
      TagStack.prototype.indent_to_tag = function ( tag_list ) {
        var frame = this._get_frame( tag_list );
        if ( frame ) {
          this._printer.indent_level = frame.indent_level;
        }
      };

      function Beautifier( source_text, options, js_beautify, css_beautify ) {
        this._source_text = source_text || '';
        options = options || {};
        this._js_beautify = js_beautify;
        this._css_beautify = css_beautify;
        this._tag_stack = null;
        var optionHtml = new Options( options, 'html' );
        this._options = optionHtml;
        this._is_wrap_attributes_force = this._options.wrap_attributes.substr( 0, 'force'.length ) === 'force';
        this._is_wrap_attributes_force_expand_multiline = ( this._options.wrap_attributes === 'force-expand-multiline' );
        this._is_wrap_attributes_force_aligned = ( this._options.wrap_attributes === 'force-aligned' );
        this._is_wrap_attributes_aligned_multiple = ( this._options.wrap_attributes === 'aligned-multiple' );
        this._is_wrap_attributes_preserve = this._options.wrap_attributes.substr( 0, 'preserve'.length ) === 'preserve';
        this._is_wrap_attributes_preserve_aligned = ( this._options.wrap_attributes === 'preserve-aligned' );
      }
      Beautifier.prototype.beautify = function () {
        if ( this._options.disabled ) {
          return this._source_text;
        }
        var source_text = this._source_text;
        var eol = this._options.eol;
        if ( this._options.eol === 'auto' ) {
          eol = '\n';
          if ( source_text && lineBreak.test( source_text ) ) {
            eol = source_text.match( lineBreak )[ 0 ];
          }
        }
        source_text = source_text.replace( allLineBreaks, '\n' );
        var baseIndentString = source_text.match( /^[\t ]*/ )[ 0 ];
        var last_token = {
          text: '',
          type: ''
        };
        var last_tag_token = new TagOpenParserToken();
        var printer = new Printer( this._options, baseIndentString );
        var tokens = new Tokenizer( source_text, this._options ).tokenize();
        this._tag_stack = new TagStack( printer );
        var parser_token = null;
        var raw_token = tokens.next();
        while ( raw_token.type !== TOKEN.EOF ) {
          if ( raw_token.type === TOKEN.TAG_OPEN || raw_token.type === TOKEN.COMMENT ) {
            parser_token = this._handle_tag_open( printer, raw_token, last_tag_token, last_token );
            last_tag_token = parser_token;
          } else if ( ( raw_token.type === TOKEN.ATTRIBUTE || raw_token.type === TOKEN.EQUALS || raw_token.type === TOKEN.VALUE ) || ( raw_token.type === TOKEN.TEXT && !last_tag_token.tag_complete ) ) {
            parser_token = this._handle_inside_tag( printer, raw_token, last_tag_token, tokens );
          } else if ( raw_token.type === TOKEN.TAG_CLOSE ) {
            parser_token = this._handle_tag_close( printer, raw_token, last_tag_token );
          } else if ( raw_token.type === TOKEN.TEXT ) {
            parser_token = this._handle_text( printer, raw_token, last_tag_token );
          } else {
            printer.add_raw_token( raw_token );
          }
          last_token = parser_token;
          raw_token = tokens.next();
        }
        var sweet_code = printer._output.get_code( eol );
        return sweet_code;
      };
      Beautifier.prototype._handle_tag_close = function ( printer, raw_token, last_tag_token ) {
        var parser_token = {
          text: raw_token.text,
          type: raw_token.type
        };
        printer.alignment_size = 0;
        last_tag_token.tag_complete = true;
        printer.set_space_before_token( raw_token.newlines || raw_token.whitespace_before !== '' );
        if ( last_tag_token.is_unformatted ) {
          printer.add_raw_token( raw_token );
        } else {
          if ( last_tag_token.tag_start_char === '<' ) {
            printer.set_space_before_token( raw_token.text[ 0 ] === '/' );
            if ( this._is_wrap_attributes_force_expand_multiline && last_tag_token.has_wrapped_attrs ) {
              printer.print_newline( false );
            }
          }
          printer.print_token( raw_token.text );
        }
        if ( last_tag_token.indent_content && !( last_tag_token.is_unformatted || last_tag_token.is_content_unformatted ) ) {
          printer.indent();
          last_tag_token.indent_content = false;
        }
        return parser_token;
      };
      Beautifier.prototype._handle_inside_tag = function ( printer, raw_token, last_tag_token, tokens ) {
        var parser_token = {
          text: raw_token.text,
          type: raw_token.type
        };
        printer.set_space_before_token( raw_token.newlines || raw_token.whitespace_before !== '' );
        if ( last_tag_token.is_unformatted ) {
          printer.add_raw_token( raw_token );
        } else if ( last_tag_token.tag_start_char === '{' && raw_token.type === TOKEN.TEXT ) {
          if ( printer.print_preserved_newlines( raw_token ) ) {
            printer.print_raw_text( raw_token.whitespace_before + raw_token.text );
          } else {
            printer.print_token( raw_token.text );
          }
        } else {
          if ( raw_token.type === TOKEN.ATTRIBUTE ) {
            printer.set_space_before_token( true );
            last_tag_token.attr_count += 1;
          } else if ( raw_token.type === TOKEN.EQUALS ) {
            printer.set_space_before_token( false );
          } else if ( raw_token.type === TOKEN.VALUE && raw_token.previous.type === TOKEN.EQUALS ) {
            printer.set_space_before_token( false );
          }
          if ( printer._output.space_before_token && last_tag_token.tag_start_char === '<' ) {
            var wrapped = printer.print_space_or_wrap( raw_token.text );
            if ( raw_token.type === TOKEN.ATTRIBUTE ) {
              if ( this._is_wrap_attributes_preserve || this._is_wrap_attributes_preserve_aligned ) {
                printer.traverse_whitespace( raw_token );
                wrapped = wrapped || raw_token.newlines !== 0;
              }
              last_tag_token.has_wrapped_attrs = last_tag_token.has_wrapped_attrs || wrapped;
              if ( this._is_wrap_attributes_force ) {
                var force_attr_wrap = last_tag_token.attr_count > 1;
                if ( this._is_wrap_attributes_force_expand_multiline && last_tag_token.attr_count === 1 ) {
                  var is_only_attribute = true;
                  var peek_index = 0;
                  var peek_token;
                  do {
                    peek_token = tokens.peek( peek_index );
                    if ( peek_token.type === TOKEN.ATTRIBUTE ) {
                      is_only_attribute = false;
                      break;
                    }
                    peek_index += 1;
                  } while ( peek_index < 4 && peek_token.type !== TOKEN.EOF && peek_token.type !== TOKEN.TAG_CLOSE );
                  force_attr_wrap = !is_only_attribute;
                }
                if ( force_attr_wrap ) {
                  printer.print_newline( false );
                  last_tag_token.has_wrapped_attrs = true;
                }
              }
            }
          }
          printer.print_token( raw_token.text );
        }
        return parser_token;
      };
      Beautifier.prototype._handle_text = function ( printer, raw_token, last_tag_token ) {
        var parser_token = {
          text: raw_token.text,
          type: 'TK_CONTENT'
        };
        if ( last_tag_token.custom_beautifier_name ) {
          this._print_custom_beatifier_text( printer, raw_token, last_tag_token );
        } else if ( last_tag_token.is_unformatted || last_tag_token.is_content_unformatted ) {
          printer.add_raw_token( raw_token );
        } else {
          printer.traverse_whitespace( raw_token );
          printer.print_token( raw_token.text );
        }
        return parser_token;
      };
      Beautifier.prototype._print_custom_beatifier_text = function ( printer, raw_token, last_tag_token ) {
        var local = this;
        if ( raw_token.text !== '' ) {
          printer.print_newline( false );
          var text = raw_token.text,
            _beautifier, script_indent_level = 1;
          if ( last_tag_token.custom_beautifier_name === 'javascript' && typeof this._js_beautify === 'function' ) {
            _beautifier = this._js_beautify;
          } else if ( last_tag_token.custom_beautifier_name === 'css' && typeof this._css_beautify === 'function' ) {
            _beautifier = this._css_beautify;
          } else if ( last_tag_token.custom_beautifier_name === 'html' ) {
            _beautifier = function ( html_source, options ) {
              var beautifier = new Beautifier( html_source, options, local._js_beautify, local._css_beautify );
              return beautifier.beautify();
            };
          }
          if ( this._options.indent_scripts === "keep" ) {
            script_indent_level = 0;
          } else if ( this._options.indent_scripts === "separate" ) {
            script_indent_level = -printer.indent_level;
          }
          var indentation = printer.get_full_indent( script_indent_level );
          text = text.replace( /\n[ \t]*$/, '' );
          if ( _beautifier ) {
            var Child_options = function () {
              this.eol = '\n';
            };
            Child_options.prototype = this._options.raw_options;
            var child_options = new Child_options();
            text = _beautifier( indentation + text, child_options );
          } else {
            var white = raw_token.whitespace_before;
            if ( white ) {
              text = text.replace( new RegExp( '\n(' + white + ')?', 'g' ), '\n' );
            }
            text = indentation + text.replace( /\n/g, '\n' + indentation );
          }
          if ( text ) {
            printer.print_raw_text( text );
            printer.print_newline( true );
          }
        }
      };
      Beautifier.prototype._handle_tag_open = function ( printer, raw_token, last_tag_token, last_token ) {
        var parser_token = this._get_tag_open_token( raw_token );
        if ( ( last_tag_token.is_unformatted || last_tag_token.is_content_unformatted ) && raw_token.type === TOKEN.TAG_OPEN && raw_token.text.indexOf( '</' ) === 0 ) {
          printer.add_raw_token( raw_token );
        } else {
          printer.traverse_whitespace( raw_token );
          this._set_tag_position( printer, raw_token, parser_token, last_tag_token, last_token );
          printer.print_token( raw_token.text );
        }
        if ( this._is_wrap_attributes_force_aligned || this._is_wrap_attributes_aligned_multiple || this._is_wrap_attributes_preserve_aligned ) {
          parser_token.alignment_size = raw_token.text.length + 1;
        }
        if ( !parser_token.tag_complete && !parser_token.is_unformatted ) {
          printer.alignment_size = parser_token.alignment_size;
        }
        return parser_token;
      };
      var TagOpenParserToken = function ( parent, raw_token ) {
        this.parent = parent || null;
        this.text = '';
        this.type = 'TK_TAG_OPEN';
        this.tag_name = '';
        this.is_inline_element = false;
        this.is_unformatted = false;
        this.is_content_unformatted = false;
        this.is_empty_element = false;
        this.is_start_tag = false;
        this.is_end_tag = false;
        this.indent_content = false;
        this.multiline_content = false;
        this.custom_beautifier_name = null;
        this.start_tag_token = null;
        this.attr_count = 0;
        this.has_wrapped_attrs = false;
        this.alignment_size = 0;
        this.tag_complete = false;
        this.tag_start_char = '';
        this.tag_check = '';
        if ( !raw_token ) {
          this.tag_complete = true;
        } else {
          var tag_check_match;
          this.tag_start_char = raw_token.text[ 0 ];
          this.text = raw_token.text;
          if ( this.tag_start_char === '<' ) {
            tag_check_match = raw_token.text.match( /^<([^\s>]*)/ );
            this.tag_check = tag_check_match ? tag_check_match[ 1 ] : '';
          } else {
            tag_check_match = raw_token.text.match( /^{{\#?([^\s}]+)/ );
            this.tag_check = tag_check_match ? tag_check_match[ 1 ] : '';
          }
          this.tag_check = this.tag_check.toLowerCase();
          if ( raw_token.type === TOKEN.COMMENT ) {
            this.tag_complete = true;
          }
          this.is_start_tag = this.tag_check.charAt( 0 ) !== '/';
          this.tag_name = !this.is_start_tag ? this.tag_check.substr( 1 ) : this.tag_check;
          this.is_end_tag = !this.is_start_tag || ( raw_token.closed && raw_token.closed.text === '/>' );
          this.is_end_tag = this.is_end_tag || ( this.tag_start_char === '{' && ( this.text.length < 3 || ( /[^#\^]/.test( this.text.charAt( 2 ) ) ) ) );
        }
      };
      Beautifier.prototype._get_tag_open_token = function ( raw_token ) {
        var parser_token = new TagOpenParserToken( this._tag_stack.get_parser_token(), raw_token );
        parser_token.alignment_size = this._options.wrap_attributes_indent_size;
        parser_token.is_end_tag = parser_token.is_end_tag || in_array( parser_token.tag_check, this._options.void_elements );
        parser_token.is_empty_element = parser_token.tag_complete || ( parser_token.is_start_tag && parser_token.is_end_tag );
        parser_token.is_unformatted = !parser_token.tag_complete && in_array( parser_token.tag_check, this._options.unformatted );
        parser_token.is_content_unformatted = !parser_token.is_empty_element && in_array( parser_token.tag_check, this._options.content_unformatted );
        parser_token.is_inline_element = in_array( parser_token.tag_name, this._options.inline ) || parser_token.tag_start_char === '{';
        return parser_token;
      };
      Beautifier.prototype._set_tag_position = function ( printer, raw_token, parser_token, last_tag_token, last_token ) {
        if ( !parser_token.is_empty_element ) {
          if ( parser_token.is_end_tag ) {
            parser_token.start_tag_token = this._tag_stack.try_pop( parser_token.tag_name );
          } else {
            this._do_optional_end_element( parser_token );
            this._tag_stack.record_tag( parser_token );
            if ( ( parser_token.tag_name === 'script' || parser_token.tag_name === 'style' ) && !( parser_token.is_unformatted || parser_token.is_content_unformatted ) ) {
              parser_token.custom_beautifier_name = get_custom_beautifier_name( parser_token.tag_check, raw_token );
            }
          }
        }
        if ( in_array( parser_token.tag_check, this._options.extra_liners ) ) {
          printer.print_newline( false );
          if ( !printer._output.just_added_blankline() ) {
            printer.print_newline( true );
          }
        }
        if ( parser_token.is_empty_element ) {
          if ( parser_token.tag_start_char === '{' && parser_token.tag_check === 'else' ) {
            this._tag_stack.indent_to_tag( [ 'if', 'unless', 'each' ] );
            parser_token.indent_content = true;
            var foundIfOnCurrentLine = printer.current_line_has_match( /{{#if/ );
            if ( !foundIfOnCurrentLine ) {
              printer.print_newline( false );
            }
          }
          if ( parser_token.tag_name === '!--' && last_token.type === TOKEN.TAG_CLOSE && last_tag_token.is_end_tag && parser_token.text.indexOf( '\n' ) === -1 ) {} else if ( !parser_token.is_inline_element && !parser_token.is_unformatted ) {
            printer.print_newline( false );
          }
        } else if ( parser_token.is_unformatted || parser_token.is_content_unformatted ) {
          if ( !parser_token.is_inline_element && !parser_token.is_unformatted ) {
            printer.print_newline( false );
          }
        } else if ( parser_token.is_end_tag ) {
          if ( ( parser_token.start_tag_token && parser_token.start_tag_token.multiline_content ) || !( parser_token.is_inline_element || ( last_tag_token.is_inline_element ) || ( last_token.type === TOKEN.TAG_CLOSE && parser_token.start_tag_token === last_tag_token ) || ( last_token.type === 'TK_CONTENT' ) ) ) {
            printer.print_newline( false );
          }
        } else {
          parser_token.indent_content = !parser_token.custom_beautifier_name;
          if ( parser_token.tag_start_char === '<' ) {
            if ( parser_token.tag_name === 'html' ) {
              parser_token.indent_content = this._options.indent_inner_html;
            } else if ( parser_token.tag_name === 'head' ) {
              parser_token.indent_content = this._options.indent_head_inner_html;
            } else if ( parser_token.tag_name === 'body' ) {
              parser_token.indent_content = this._options.indent_body_inner_html;
            }
          }
          if ( !parser_token.is_inline_element && last_token.type !== 'TK_CONTENT' ) {
            if ( parser_token.parent ) {
              parser_token.parent.multiline_content = true;
            }
            printer.print_newline( false );
          }
        }
      };
      Beautifier.prototype._do_optional_end_element = function ( parser_token ) {
        if ( parser_token.is_empty_element || !parser_token.is_start_tag || !parser_token.parent ) {
          return;
        } else if ( parser_token.tag_name === 'body' ) {
          this._tag_stack.try_pop( 'head' );
        } else if ( parser_token.tag_name === 'li' ) {
          this._tag_stack.try_pop( 'li', [ 'ol', 'ul' ] );
        } else if ( parser_token.tag_name === 'dd' || parser_token.tag_name === 'dt' ) {
          this._tag_stack.try_pop( 'dt', [ 'dl' ] );
          this._tag_stack.try_pop( 'dd', [ 'dl' ] );
        } else if ( parser_token.tag_name === 'rp' || parser_token.tag_name === 'rt' ) {
          this._tag_stack.try_pop( 'rt', [ 'ruby', 'rtc' ] );
          this._tag_stack.try_pop( 'rp', [ 'ruby', 'rtc' ] );
        } else if ( parser_token.tag_name === 'optgroup' ) {
          this._tag_stack.try_pop( 'optgroup', [ 'select' ] );
        } else if ( parser_token.tag_name === 'option' ) {
          this._tag_stack.try_pop( 'option', [ 'select', 'datalist', 'optgroup' ] );
        } else if ( parser_token.tag_name === 'colgroup' ) {
          this._tag_stack.try_pop( 'caption', [ 'table' ] );
        } else if ( parser_token.tag_name === 'thead' ) {
          this._tag_stack.try_pop( 'caption', [ 'table' ] );
          this._tag_stack.try_pop( 'colgroup', [ 'table' ] );
        } else if ( parser_token.tag_name === 'tbody' || parser_token.tag_name === 'tfoot' ) {
          this._tag_stack.try_pop( 'caption', [ 'table' ] );
          this._tag_stack.try_pop( 'colgroup', [ 'table' ] );
          this._tag_stack.try_pop( 'thead', [ 'table' ] );
          this._tag_stack.try_pop( 'tbody', [ 'table' ] );
        } else if ( parser_token.tag_name === 'tr' ) {
          this._tag_stack.try_pop( 'caption', [ 'table' ] );
          this._tag_stack.try_pop( 'colgroup', [ 'table' ] );
          this._tag_stack.try_pop( 'tr', [ 'table', 'thead', 'tbody', 'tfoot' ] );
        } else if ( parser_token.tag_name === 'th' || parser_token.tag_name === 'td' ) {
          this._tag_stack.try_pop( 'td', [ 'tr' ] );
          this._tag_stack.try_pop( 'th', [ 'tr' ] );
        }
        parser_token.parent = this._tag_stack.get_parser_token();
      };
      module.exports.Beautifier = Beautifier;
    } ), ( function ( module, exports, __webpack_require__ ) {
      "use strict";
      var BaseOptions = __webpack_require__( 6 ).Options;

      function Options( options ) {
        BaseOptions.call( this, options, 'html' );
        this.indent_inner_html = this._get_boolean( 'indent_inner_html' );
        this.indent_body_inner_html = this._get_boolean( 'indent_body_inner_html', true );
        this.indent_head_inner_html = this._get_boolean( 'indent_head_inner_html', true );
        this.indent_handlebars = this._get_boolean( 'indent_handlebars', true );
        this.wrap_attributes = this._get_selection( 'wrap_attributes', [ 'auto', 'force', 'force-aligned', 'force-expand-multiline', 'aligned-multiple', 'preserve', 'preserve-aligned' ] );
        this.wrap_attributes_indent_size = this._get_number( 'wrap_attributes_indent_size', this.indent_size );
        this.extra_liners = this._get_array( 'extra_liners', [ 'head', 'body', '/html' ] );
        this.inline = this._get_array( 'inline', [ 'a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript', 'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'var', 'video', 'wbr', 'text', 'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt' ] );
        this.void_elements = this._get_array( 'void_elements', [ 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr', '!doctype', '?xml', '?php', '?=', 'basefont', 'isindex' ] );
        this.unformatted = this._get_array( 'unformatted', [] );
        this.content_unformatted = this._get_array( 'content_unformatted', [ 'pre', 'textarea' ] );
        this.indent_scripts = this._get_selection( 'indent_scripts', [ 'normal', 'keep', 'separate' ] );
      }
      Options.prototype = new BaseOptions();
      module.exports.Options = Options;
    } ), ( function ( module, exports, __webpack_require__ ) {
      "use strict";
      var BaseTokenizer = __webpack_require__( 9 ).Tokenizer;
      var BASETOKEN = __webpack_require__( 9 ).TOKEN;
      var Directives = __webpack_require__( 11 ).Directives;
      var TOKEN = {
        TAG_OPEN: 'TK_TAG_OPEN',
        TAG_CLOSE: 'TK_TAG_CLOSE',
        ATTRIBUTE: 'TK_ATTRIBUTE',
        EQUALS: 'TK_EQUALS',
        VALUE: 'TK_VALUE',
        COMMENT: 'TK_COMMENT',
        TEXT: 'TK_TEXT',
        UNKNOWN: 'TK_UNKNOWN',
        START: BASETOKEN.START,
        RAW: BASETOKEN.RAW,
        EOF: BASETOKEN.EOF
      };
      var directives_core = new Directives( /<\!--/, /-->/ );
      var Tokenizer = function ( input_string, options ) {
        BaseTokenizer.call( this, input_string, options );
        this._current_tag_name = '';
        this._word_pattern = this._options.indent_handlebars ? /[\n\r\t <]|{{/g : /[\n\r\t <]/g;
      };
      Tokenizer.prototype = new BaseTokenizer();
      Tokenizer.prototype._is_comment = function ( current_token ) {
        return false;
      };
      Tokenizer.prototype._is_opening = function ( current_token ) {
        return current_token.type === TOKEN.TAG_OPEN;
      };
      Tokenizer.prototype._is_closing = function ( current_token, open_token ) {
        return current_token.type === TOKEN.TAG_CLOSE && ( open_token && ( ( ( current_token.text === '>' || current_token.text === '/>' ) && open_token.text[ 0 ] === '<' ) || ( current_token.text === '}}' && open_token.text[ 0 ] === '{' && open_token.text[ 1 ] === '{' ) ) );
      };
      Tokenizer.prototype._reset = function () {
        this._current_tag_name = '';
      };
      Tokenizer.prototype._get_next_token = function ( previous_token, open_token ) {
        this._readWhitespace();
        var token = null;
        var c = this._input.peek();
        if ( c === null ) {
          return this._create_token( TOKEN.EOF, '' );
        }
        token = token || this._read_attribute( c, previous_token, open_token );
        token = token || this._read_raw_content( previous_token, open_token );
        token = token || this._read_comment( c );
        token = token || this._read_open( c, open_token );
        token = token || this._read_close( c, open_token );
        token = token || this._read_content_word();
        token = token || this._create_token( TOKEN.UNKNOWN, this._input.next() );
        return token;
      };
      Tokenizer.prototype._read_comment = function ( c ) {
        var token = null;
        if ( c === '<' || c === '{' ) {
          var peek1 = this._input.peek( 1 );
          var peek2 = this._input.peek( 2 );
          if ( ( c === '<' && ( peek1 === '!' || peek1 === '?' || peek1 === '%' ) ) || this._options.indent_handlebars && c === '{' && peek1 === '{' && peek2 === '!' ) {
            var comment = '',
              delimiter = '>',
              matched = false;
            var input_char = this._input.next();
            while ( input_char ) {
              comment += input_char;
              if ( comment.charAt( comment.length - 1 ) === delimiter.charAt( delimiter.length - 1 ) && comment.indexOf( delimiter ) !== -1 ) {
                break;
              }
              if ( !matched ) {
                matched = comment.length > 10;
                if ( comment.indexOf( '<![if' ) === 0 ) {
                  delimiter = '<![endif]>';
                  matched = true;
                } else if ( comment.indexOf( '<![cdata[' ) === 0 ) {
                  delimiter = ']]>';
                  matched = true;
                } else if ( comment.indexOf( '<![' ) === 0 ) {
                  delimiter = ']>';
                  matched = true;
                } else if ( comment.indexOf( '<!--' ) === 0 ) {
                  delimiter = '-->';
                  matched = true;
                } else if ( comment.indexOf( '{{!--' ) === 0 ) {
                  delimiter = '--}}';
                  matched = true;
                } else if ( comment.indexOf( '{{!' ) === 0 ) {
                  if ( comment.length === 5 && comment.indexOf( '{{!--' ) === -1 ) {
                    delimiter = '}}';
                    matched = true;
                  }
                } else if ( comment.indexOf( '<?' ) === 0 ) {
                  delimiter = '?>';
                  matched = true;
                } else if ( comment.indexOf( '<%' ) === 0 ) {
                  delimiter = '%>';
                  matched = true;
                }
              }
              input_char = this._input.next();
            }
            var directives = directives_core.get_directives( comment );
            if ( directives && directives.ignore === 'start' ) {
              comment += directives_core.readIgnored( this._input );
            }
            token = this._create_token( TOKEN.COMMENT, comment );
            token.directives = directives;
          }
        }
        return token;
      };
      Tokenizer.prototype._read_open = function ( c, open_token ) {
        var resulting_string = null;
        var token = null;
        if ( !open_token ) {
          if ( c === '<' ) {
            resulting_string = this._input.read( /<(?:[^\n\r\t >{][^\n\r\t >{/]*)?/g );
            token = this._create_token( TOKEN.TAG_OPEN, resulting_string );
          } else if ( this._options.indent_handlebars && c === '{' && this._input.peek( 1 ) === '{' ) {
            resulting_string = this._input.readUntil( /[\n\r\t }]/g );
            token = this._create_token( TOKEN.TAG_OPEN, resulting_string );
          }
        }
        return token;
      };
      Tokenizer.prototype._read_close = function ( c, open_token ) {
        var resulting_string = null;
        var token = null;
        if ( open_token ) {
          if ( open_token.text[ 0 ] === '<' && ( c === '>' || ( c === '/' && this._input.peek( 1 ) === '>' ) ) ) {
            resulting_string = this._input.next();
            if ( c === '/' ) {
              resulting_string += this._input.next();
            }
            token = this._create_token( TOKEN.TAG_CLOSE, resulting_string );
          } else if ( open_token.text[ 0 ] === '{' && c === '}' && this._input.peek( 1 ) === '}' ) {
            this._input.next();
            this._input.next();
            token = this._create_token( TOKEN.TAG_CLOSE, '}}' );
          }
        }
        return token;
      };
      Tokenizer.prototype._read_attribute = function ( c, previous_token, open_token ) {
        var token = null;
        var resulting_string = '';
        if ( open_token && open_token.text[ 0 ] === '<' ) {
          if ( c === '=' ) {
            token = this._create_token( TOKEN.EQUALS, this._input.next() );
          } else if ( c === '"' || c === "'" ) {
            var content = this._input.next();
            var input_string = '';
            var string_pattern = new RegExp( c + '|{{', 'g' );
            while ( this._input.hasNext() ) {
              input_string = this._input.readUntilAfter( string_pattern );
              content += input_string;
              if ( input_string[ input_string.length - 1 ] === '"' || input_string[ input_string.length - 1 ] === "'" ) {
                break;
              } else if ( this._input.hasNext() ) {
                content += this._input.readUntilAfter( /}}/g );
              }
            }
            token = this._create_token( TOKEN.VALUE, content );
          } else {
            if ( c === '{' && this._input.peek( 1 ) === '{' ) {
              resulting_string = this._input.readUntilAfter( /}}/g );
            } else {
              resulting_string = this._input.readUntil( /[\n\r\t =\/>]/g );
            }
            if ( resulting_string ) {
              if ( previous_token.type === TOKEN.EQUALS ) {
                token = this._create_token( TOKEN.VALUE, resulting_string );
              } else {
                token = this._create_token( TOKEN.ATTRIBUTE, resulting_string );
              }
            }
          }
        }
        return token;
      };
      Tokenizer.prototype._is_content_unformatted = function ( tag_name ) {
        return this._options.void_elements.indexOf( tag_name ) === -1 && ( tag_name === 'script' || tag_name === 'style' || this._options.content_unformatted.indexOf( tag_name ) !== -1 || this._options.unformatted.indexOf( tag_name ) !== -1 );
      };
      Tokenizer.prototype._read_raw_content = function ( previous_token, open_token ) {
        var resulting_string = '';
        if ( open_token && open_token.text[ 0 ] === '{' ) {
          resulting_string = this._input.readUntil( /}}/g );
        } else if ( previous_token.type === TOKEN.TAG_CLOSE && ( previous_token.opened.text[ 0 ] === '<' ) ) {
          var tag_name = previous_token.opened.text.substr( 1 ).toLowerCase();
          if ( this._is_content_unformatted( tag_name ) ) {
            resulting_string = this._input.readUntil( new RegExp( '</' + tag_name + '[\\n\\r\\t ]*?>', 'ig' ) );
          }
        }
        if ( resulting_string ) {
          return this._create_token( TOKEN.TEXT, resulting_string );
        }
        return null;
      };
      Tokenizer.prototype._read_content_word = function () {
        var resulting_string = this._input.readUntil( this._word_pattern );
        if ( resulting_string ) {
          return this._create_token( TOKEN.TEXT, resulting_string );
        }
      };
      module.exports.Tokenizer = Tokenizer;
      module.exports.TOKEN = TOKEN;
    } ) ] );
  var style_html = legacy_beautify_html;
  if ( typeof define === "function" && define.amd ) {
    define( [ "require", "./beautify", "./beautify-css" ], function ( requireamd ) {
      var js_beautify = requireamd( "./beautify" );
      var css_beautify = requireamd( "./beautify-css" );
      return {
        html_beautify: function ( html_source, options ) {
          return style_html( html_source, options, js_beautify.js_beautify, css_beautify.css_beautify );
        }
      };
    } );
  } else if ( typeof exports !== "undefined" ) {
    var js_beautify = require( './beautify.js' );
    var css_beautify = require( './beautify-css.js' );
    exports.html_beautify = function ( html_source, options ) {
      return style_html( html_source, options, js_beautify.js_beautify, css_beautify.css_beautify );
    };
  } else if ( typeof window !== "undefined" ) {
    window.html_beautify = function ( html_source, options ) {
      return style_html( html_source, options, window.js_beautify, window.css_beautify );
    };
  } else if ( typeof global !== "undefined" ) {
    global.html_beautify = function ( html_source, options ) {
      return style_html( html_source, options, global.js_beautify, global.css_beautify );
    };
  }
}() );
