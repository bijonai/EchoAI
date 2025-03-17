from api import comp

arc = comp('arc', 'a arc for tagging the value of an angle, must be used under an <angle> component.')
arc.fullname('canvas:angle:arc')

arc.attr('color', 'The color of the arc', 'string', 'black')
arc.attr('type', 'The type of the arc', 'string', "'solid' | 'dashed' | 'dotted'")
arc.attr('width', 'The width of the arc', 'number', '1')
arc.attr('value', 'The display latex value of the angle', 'string')
