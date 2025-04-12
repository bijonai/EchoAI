from api import comp

text = comp('text', 'This api is used to control the font, color, size, and other properties of the text.')

text.attr('font', 'Specifies the font family for the text', 'string | string[]', 'undefined')
text.attr('fallback', 'Enables or disables font fallback', 'boolean', 'true')
text.attr('style', 'Sets the font style (e.g., normal, italic)', 'string', "'normal'")
text.attr('weight', 'Defines the font weight', 'number | string', '400')
text.attr('stretch', 'Specifies the font stretch percentage', 'number', '100')
text.attr('size', 'Sets the font size', 'string | number', "'16px'")
text.attr('fill', 'Defines the text color', 'string', "'#000'")
text.attr('stroke', 'Applies an outline stroke to the text', 'string | { width?: string | number; color?: string; pattern?: string }', 'undefined')
text.attr('tracking', 'Adjusts letter spacing', 'string | number', "'normal'")
text.attr('spacing', 'Adjusts word spacing', 'number', "'normal'")
text.attr('cjk-latin-spacing', 'Controls spacing between CJK and Latin characters', "'none' | 'auto'", 'undefined')
text.attr('baseline', 'Sets the baseline alignment', 'string | number', 'undefined')
text.attr('overhang', 'Enables text overhang', 'boolean', 'false')
text.attr('top-edge', 'Defines the top margin', 'string | number', 'undefined')
text.attr('bottom-edge', 'Defines the bottom margin', 'string | number', 'undefined')
text.attr('lang', 'Specifies the language of the text', 'string', "'en'")
text.attr('region', 'Sets the text region', 'string | null', 'undefined')
text.attr('script', 'Defines the script variant', "string | 'auto'", "'auto'")
text.attr('dir', 'Sets the text direction', "'auto' | 'ltr' | 'rtl'", "'auto'")
text.attr('hyphenate', 'Enables or disables hyphenation', "boolean | 'auto'", "'auto'")
text.attr('costs', 'Defines custom costs for line breaks, wrapping, and hyphenation', 'Record<string, any>', 'undefined')
text.attr('kerning', 'Enables or disables font kerning', 'boolean', 'true')
text.attr('alternates', 'Enables alternate character forms', 'boolean', 'false')
text.attr('stylistic-set', 'Activates specific stylistic sets', 'number[] | null', 'undefined')
text.attr('ligatures', 'Enables or disables standard ligatures', 'boolean', 'true')
text.attr('discretionary-ligatures', 'Enables discretionary ligatures', 'boolean', 'false')
text.attr('historical-ligatures', 'Enables historical ligatures', 'boolean', 'false')
text.attr('number-type', 'Specifies the numeral style', "string | 'auto'", "'auto'")
text.attr('number-width', 'Sets the numeral width variant', "string | 'auto'", "'auto'")
text.attr('slashed-zero', 'Enables the slashed zero variant', 'boolean', 'false')
text.attr('fractions', 'Enables fraction formatting', 'boolean', 'false')
text.attr('features', 'Defines OpenType features', 'Array<Record<string, any>> | Record<string, any>', 'undefined')

text.example('''
```eich
<text font= "Arial" :size="20" fill="#ff0000">Hello World.</text>
```
''', 'Create a text with a font of Arial, a size of 20, and a fill color of #ff0000') 