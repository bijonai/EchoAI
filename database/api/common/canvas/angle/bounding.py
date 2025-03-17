from api import comp

bounding = comp('bounding', 'Bounding arc for an angle, must be used under an <angle> component.')
bounding.fullname('canvas:angle:bounding')

bounding.attr('color', 'The color of the bounding arc', 'string', 'black')
bounding.attr('type', 'The type of the bounding arc', 'string', "'solid' | 'dashed' | 'dotted'")
bounding.attr('width', 'The width of the bounding arc', 'number', '1')
bounding.attr('value', 'The display latex', 'string')
