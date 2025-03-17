from api import comp


# Th component definition
th = comp('th', 'This is a th component API.')

# Basic style attributes
th.attr(':padding', 'Specifies the padding of the th cell.', 'string', "")
th.attr(':border', 'Specifies the border of the th cell.', 'string', "")
th.attr(':text-align', 'Specifies the horizontal alignment of content in th cell.', 'string', "")
th.attr(':vertical-align', 'Specifies the vertical alignment of content in th cell.', 'string', "")
th.attr(':width', 'Specifies the width of the th cell.', 'string', "")
th.attr(':height', 'Specifies the height of the th cell.', 'string', "")
th.attr(':background-color', 'Specifies the background color of the th cell.', 'string', "")
th.attr(':color', 'Specifies the color of the th cell.', 'string', "")
th.attr(':font-size', 'Specifies the font size of the th cell.', 'string', "")
th.attr(':font-weight', 'Specifies the font weight of the th cell.', 'string', "")
th.attr('$scope', 'Specifies the scope of the th cell.', 'string', "")
