from api import comp


# Tr component definition
tr = comp('tr', 'This is a tr component API.')

# Basic style attributes
tr.attr(':padding', 'Specifies the padding of the tr cell.', 'string', "")
tr.attr(':border', 'Specifies the border of the tr cell.', 'string', "")
tr.attr(':text-align', 'Specifies the horizontal alignment of content in tr cell.', 'string', "")
tr.attr(':vertical-align', 'Specifies the vertical alignment of content in tr cell.', 'string', "")
tr.attr(':width', 'Specifies the width of the tr cell.', 'string', "")
tr.attr(':height', 'Specifies the height of the tr cell.', 'string', "")
tr.attr(':background-color', 'Specifies the background color of the tr cell.', 'string', "")
tr.attr(':color', 'Specifies the color of the tr cell.', 'string', "")
tr.attr(':font-size', 'Specifies the font size of the tr cell.', 'string', "")
tr.attr(':font-weight', 'Specifies the font weight of the tr cell.', 'string', "")
