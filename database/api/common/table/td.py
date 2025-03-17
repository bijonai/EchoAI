from api import comp


# Td component definition
td = comp('td', 'This is a td component API.')

# Basic style attributes
td.attr(':padding', 'Specifies the padding of the td cell.', 'string', "")
td.attr(':border', 'Specifies the border of the td cell.', 'string', "")
td.attr(':text-align', 'Specifies the horizontal alignment of content in td cell.', 'string', "")
td.attr(':vertical-align', 'Specifies the vertical alignment of content in td cell.', 'string', "")
td.attr(':width', 'Specifies the width of the td cell.', 'string', "")
td.attr(':height', 'Specifies the height of the td cell.', 'string', "")
td.attr(':background-color', 'Specifies the background color of the td cell.', 'string', "")
td.attr(':color', 'Specifies the color of the td cell.', 'string', "")
td.attr(':font-size', 'Specifies the font size of the td cell.', 'string', "")
td.attr(':font-weight', 'Specifies the font weight of the td cell.', 'string', "")
