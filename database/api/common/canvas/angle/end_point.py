from api import comp

end_point = comp('end-point', 'The latex label of the end side of the angle, must be used under an <angle> component.')
end_point.fullname('canvas:angle:end-point')

end_point.attr('as', 'The variable name of the position of the point, you can use the variable in following context, [x, y] will be the value of the variable', 'string')

