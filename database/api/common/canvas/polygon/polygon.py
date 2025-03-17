from api import comp

polygon = comp('polygon', 'A polygon component')
polygon.fullname('canvas:polygon')

polygon.attr('points', 'The points of the polygon', '[number, number][]')
