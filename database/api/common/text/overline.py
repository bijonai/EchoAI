from api import comp

overline = comp('overline', 'This api is used to draw a line on the text.')

overline.attr('stroke', 'The stroke color of the line', 'string', "'black'")
overline.attr('stroke-width', 'The stroke width of the line', 'string', '1')
overline.attr('offset', 'The offset of the line', 'string', '0')
