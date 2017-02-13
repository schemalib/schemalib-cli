{
    var ast = require('ast-types').builders; // only used in Hyperglot ide ... comment out elsewhere
    function _arrayToObject(arr) {return Object.assign.apply(Object, [{}].concat(props))};
}


start
  = WS* schema:(Type/Service)* WS*
    { return schema; }

// ----- root nodes

Type
    = description:Comment? "type" SPACE name:Keyword SPACE BEGIN_BODY  CLOSE_BODY {
        return {name, nodeType: "type", description, };
    }

Service
    = description:Comment? "service" SPACE name:Keyword SPACE BEGIN_BODY elements:(Action)* CLOSE_BODY {
        return {name, nodeType: "service", description, elements};
    }

Action
    = description:Comment? "action" SPACE name:Keyword SPACE BEGIN_BODY elements:(PropertyList) CLOSE_BODY {
        return {name, nodeType: "action", description, elements};
    }

Property
    = name:PropertyName COLON type:PropertyType {
      var returned  = {};
      returned[name] = type;
      return returned;
    }

PropertyName
    = Keyword / string

PropertyType
  = type:Keyword required:"!"?
    { return { type, }; }
  / "[" type:Keyword "]"
    { return { type, list: true }; }

PropertyList
  = props:(EOL_SEPARATOR? property:Property { return property; })*
    {

        return _arrayToObject(props);
    }


Comment
    = LINE_COMMENT comment:(!EOL character:CHAR { return character; })* EOL_SEPARATOR
    {
        return comment.join("").trim();
    }
  / "/*" comment:(!"*/" character:CHAR { return character; })* "*/" EOL_SEPARATOR
    {
        return comment.join("").replace(/\n\s*[*]?\s*/g, " ").replace(/\s+/, " ").trim();
    }


// ----- keywords

Keyword
    = $(([A-Za-z0-9_])*)


NumberKeyword = $([.+-]?[0-9]+([.][0-9]+)?)

// ----- literals

Literal
    = StringLiteral / BooleanLiteral / NumberLiteral

StringLiteral
    = '"' characters:StringCharacter* '"' { return characters.join(""); }

StringCharacter
  = !('"' / "\\" / EOL) . { return text(); }

BooleanLiteral
  = "true"  { return true }
  / "false"  { return false }

NumberLiteral
  = value:NumberKeyword { return Number(value.replace(/^[.]/, '0.')); }

string "string"
  = quotation_mark chars:char* quotation_mark { return chars.join(""); }

char
  = unescaped
  / escape
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    )
    { return sequence; }

escape
  = "\\"

quotation_mark
  = '"'

unescaped
  = [^\0-\x1F\x22\x5C]

// ----- General

LINE_COMMENT = "#" / "//"

BEGIN_BODY = WS* "{" WS*
CLOSE_BODY = WS* "}" WS*

CHAR = .

WS = (SPACE / EOL)+

COLON = WS* ":" WS*
EQUAL = WS* "=" WS*

COMMA_SEPARATOR = WS* "," WS*
EOL_SEPARATOR = SPACE* EOL SPACE*

SPACE = [ \t]+
EOL = "\n" / "\r\n" / "\r" / "\u2028" / "\u2029"

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i
