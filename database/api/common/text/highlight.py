from api import comp

highlight = comp('highlight', 'This api is used to highlight the text.')

highlight.attr('fill', 'The color of the highlight', 'string', "'yellow'")
highlight.attr('stroke', 'The stroke color of the highlight', 'string')
highlight.attr('stroke-width', 'The stroke width of the highlight', 'number', '1')
highlight.attr('radius', 'The radius of the highlight', 'number', '0')

highlight.rule('`fill` and `stroke` must be colors.')
highlight.rule('`stroke-width` must be a number.')
highlight.rule('`radius` must be a number.')
