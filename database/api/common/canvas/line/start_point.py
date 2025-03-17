from api import comp


start_point = comp('start-point', 'The start point of the line.')
start_point.fullname('canvas:line:start-point')

start_point.attr('as', 'The variable name of the start point, you can use the variable in following context, [x, y] will be the value of the variable', 'string')
