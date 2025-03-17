from api import comp


origin = comp('origin', 'The origin point of the canvas.')
origin.fullname('canvas:circle:origin')

origin.attr('as', 'The variable name of the origin point, you can use the variable in following context, [x, y] will be the value of the variable', 'string')
