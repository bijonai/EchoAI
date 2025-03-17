from api import comp


# Tfoot component definition
tfoot = comp('tfoot', 'This is a tfoot component API.')

# Basic style attributes
tfoot.attr(':width', 'Specifies the width of the tfoot cell.', 'string', "")
tfoot.attr(':height', 'Specifies the height of the tfoot cell.', 'string', "")
tfoot.attr(':border', 'Specifies the border of the tfoot cell.', 'string', "")
tfoot.attr(':padding', 'Specifies the padding of the tfoot cell.', 'string', "")
tfoot.attr(':margin', 'Specifies the margin of the tfoot cell.', 'string', "")
tfoot.attr(':background-color', 'Specifies the background color of the tfoot cell.', 'string', "")
tfoot.attr(':background-image', 'Specifies the background image of the tfoot cell.', 'string', "")
tfoot.attr(':background-position', 'Specifies the background position of the tfoot cell.', 'string', "")
tfoot.attr(':background-repeat', 'Specifies the background repeat of the tfoot cell.', 'string', "")
tfoot.attr(':color', 'Specifies the color of the tfoot cell.', 'string', "")
tfoot.attr(':font-family', 'Specifies the font family of the tfoot cell.', 'string', "")
tfoot.attr(':font-size', 'Specifies the font size of the tfoot cell.', 'string', "")
tfoot.attr(':font-weight', 'Specifies the font weight of the tfoot cell.', 'string', "")
tfoot.attr(':text-align', 'Specifies the horizontal alignment of content in tfoot cell.', 'string', "")
