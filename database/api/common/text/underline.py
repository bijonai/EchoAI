from api import comp

underline = comp('underline', 'This api is used to draw a underline on the text.')

underline.attr('stroke', 'The stroke color of the line', 'string', "'black'")
underline.attr('stroke-width', 'The stroke width of the line', 'string', '1')
underline.attr('offset', 'The offset of the line', 'string', '0')
