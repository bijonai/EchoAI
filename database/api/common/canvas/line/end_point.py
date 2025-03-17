from api import comp


end_point = comp('end-point', 'The end point of the line.')
end_point.fullname('canvas:line:end-point')

end_point.attr('as', 'The variable name of the end point, you can use the variable in following context, [x, y] will be the value of the variable', 'string')
