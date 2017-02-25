{
    var ast = require('ast-types').builders; // only used in Hyperglot ide ... comment out elsewhere
    function _arrayToObject(props) {return Object.assign.apply(Object, [{}].concat(props))};
}


start
  = WS* namespace:(Nspace)? WS* use:(Use)* WS* schema:(Type/Service/Enum/App)* WS*
    { return {namespace, use,schema}; }

// ----- root nodes

Nspace
    = "namespace" SPACE nspace:NamespaceKeyword WS {
        return {namespace: nspace, nodeType: "namespace"};
    }

Use
    = "use" SPACE name:NamespaceKeyword version:(SPACE "version" SPACE vers:VersionKeyword {return vers})? alias:(SPACE "as" SPACE as:Keyword {return as})?  from:(SPACE "from" SPACE frm:FromKeyword {return frm})? WS {
        return {name, nodeType: "use",  version, alias, from };
    }

Type
    = description:Comment* "type" SPACE name:Keyword extendType:(SPACE "extends" SPACE keyw:Keyword {return keyw})? SPACE BEGIN_BODY properties:(PropertyList) CLOSE_BODY {
        return {name, nodeType: "type",  extendType, description, properties};
    }

Enum
    = description:Comment* "enum" SPACE name:Keyword BEGIN_BODY enums:(EnumList) CLOSE_BODY {
        return {name, nodeType: "enum", description, enums};
    }

Service
    = description:Comment* "service" SPACE name:Keyword extendType:(SPACE "extends" SPACE keyw:Keyword {return keyw})?  SPACE BEGIN_BODY elements:(Action)* CLOSE_BODY {
        return {name, nodeType: "service", extendType, description, elements};
    }

App
    = description:Comment* "app" SPACE name:Keyword extendType:(SPACE "extends" SPACE keyw:Keyword {return keyw})?  SPACE BEGIN_BODY elements:(Services)* CLOSE_BODY {
        return {name, nodeType: "app", extendType, description, elements};
    }

// ----- sub nodes

Services
    = description:Comment* accessType:(Plus / Minus)? "services" SPACE BEGIN_BODY services:(ServicesList) CLOSE_BODY {
        return {name, nodeType: "services", accessType, description, services};
    }

Action
    = description:Comment* accessType:(Plus / Minus)? "action" SPACE name:Keyword SPACE BEGIN_BODY properties:(ActionList) CLOSE_BODY {
        return {name, nodeType: "action", accessType, description, properties};
    }

EnumList
  = first:EnumProperty props:(EOL_SEPARATOR* property:EnumProperty { return property; })*
    {

        return [first, ...props];
    }

EnumProperty
    = Keyword

ActionList
  = props:(EOL_SEPARATOR* property:ActionProperty { return property; })*
    {

        return _arrayToObject(props);
    }

ServicesList
  = props:(EOL_SEPARATOR* property:ServiceProperty { return property; })*
    {

        return _arrayToObject(props);
    }

ServiceProperty
    = name:(Keyword) COLON type:Keyword ExtendedPropertyType? {
      var returned  = {};
      returned[name] = type;
      return returned;
    }

ActionProperty
    = name:("request" / "response") COLON type:PropertyType {
      var returned  = {};
      returned[name] = type;
      return returned;
    }

Property
    = accessType:(Plus / Minus)? name:PropertyName COLON type:PropertyType SPACE* comment:PropertyComment? {
      var returned  = {};
      type["accessType"] = accessType;
      type["description"] = comment;
      returned[name] = type;
      return returned;
    }

PropertyName
    = MemberKeyword

PropertyType
  =  "[" SPACE? type:Keyword SPACE? "]" required:"!"?
    { return { type, required, list: true }; }
    /
    type:Keyword required:"!"?
    { return { type, required, list: false}; }
    /
    BEGIN_BODY properties:(PropertyList) CLOSE_BODY required:"!"?
    {

        return { required, list: false, type: "object" ,properties };
    }

ExtendedPropertyType
  = BEGIN_BODY properties:(PropertyList) CLOSE_BODY required:"!"?
    {

        return { required, list: false, type: "object" ,properties };
    }

PropertyList
  = props:(EOL_SEPARATOR* property:Property { return property; })*
    {

        return _arrayToObject(props);
    }

PropertyComment
    = LINE_COMMENT comment:(!EOL character:CHAR { return character; })* EOL_SEPARATOR
    {
        return comment.join("").trim();
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
    = $([A-Za-z0-9_]+)

NamespaceKeyword
    = $([A-Za-z0-9_\.]*)

NumberKeyword
    = $([.+-]?[0-9]+([.][0-9]+)?)

FromKeyword
    = StringLiteral / NamespaceKeyword

MemberKeyword
    = (StringLiteral / Keyword)

VersionKeyword
    = $(([0-9]+[.])?([0-9]+[.])?[0-9]+)

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

StringKeyword "string"
  = Quotation_mark chars:Char* Quotation_mark { return chars.join(""); }

Char
  = Unescaped
  / Escape
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

Escape
  = "\\"

Quotation_mark
  = '"'

Minus
    = "-"

Plus
    = "+"

Zero
    = "0"

Unescaped
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
