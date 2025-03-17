from api import comp


# Thead component definition
thead = comp('thead', 'This is a thead component API.')

# Basic style attributes
thead.attr(':text-align', 'Specifies the horizontal alignment of content in cells.', 'string', "")
thead.attr(':vertical-align', 'Specifies the vertical alignment of content in cells.', 'string', "")
thead.attr(':background-color', 'Specifies the background color of the table.', 'string', "")