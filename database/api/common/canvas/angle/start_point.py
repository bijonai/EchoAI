from api import comp

start_point = comp('start-point', 'The latex label of the start side of the angle, must be used under an <angle> component.')
start_point.fullname('canvas:angle:start-point')

start_point.attr('as', 'The variable name of the position of the point, you can use the variable in following context, [x, y] will be the value of the variable', 'string')