from api import comp

origin = comp('origin', 'The origin of the angle, must be used under an <angle> component.')
origin.fullname('canvas:angle:origin')

origin.attr('as', 'The variable name of the position of the origin, you can use the variable in following context, [x, y] will be the value of the variable', 'string')
