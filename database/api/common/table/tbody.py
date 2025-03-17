from api import comp


# Tbody component definition
tbody = comp('tbody', 'This is a tbody component API.')

# Basic style attributes
tbody.attr(':text-align', 'Specifies the horizontal alignment of content in cells.', 'string', "")
tbody.attr(':vertical-align', 'Specifies the vertical alignment of content in cells.', 'string', "")
tbody.attr(':background-color', 'Specifies the background color of the table.', 'string', "")