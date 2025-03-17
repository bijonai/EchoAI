from api import comp


dot = comp('dot', 'A dot on the canvas.')
dot.fullname('canvas:dot')

dot.attr('x', 'The x coordinate of the dot', 'number')
dot.attr('y', 'The y coordinate of the dot', 'number')
dot.attr('label', 'The label of the dot', 'string')
dot.attr('as', 'The variable name of the dot, you can use the variable in following context, [x, y] will be the value of the variable', 'string')