from api import comp


# Table component definition
table = comp('table', 'This is a table component API. The styles include table layout, borders, spacing, and appearance attributes, which are applied reactively using the effect function')

# Basic style attributes
table.attr(':border', 'Specifies the border of the table.', 'string', "")
table.attr(':width', 'Specifies the width of the table.', 'string', "")
table.attr(':height', 'Specifies the height of the table.', 'string', "")
table.attr(':border-width', 'Specifies the width of the table border.', 'string', "")
table.attr(':border-style', 'Specifies the style of the table border.', 'string', "")
table.attr(':border-color', 'Specifies the color of the table border.', 'string', "")

# Table layout attributes
table.attr(':border-collapse', 'Specifies whether table borders should collapse into a single border or be separated.', 'string', "")
table.attr(':border-spacing', 'Specifies the distance between the borders of adjacent cells.', 'string', "")
table.attr(':caption-side', 'Specifies the placement of a table caption.', 'string', "")
table.attr(':empty-cells', 'Specifies whether or not to display borders and background on empty cells.', 'string', "")
table.attr(':table-layout', 'Specifies the algorithm used to lay out table cells, rows, and columns.', 'string', "")

# Alignment and text attributes
table.attr(':vertical-align', 'Specifies the vertical alignment of content in cells.', 'string', "")
table.attr(':text-align', 'Specifies the horizontal alignment of content in cells.', 'string', "")

# Color and appearance attributes
table.attr(':background-color', 'Specifies the background color of the table.', 'string', "")
table.attr(':color', 'Specifies the text color of the table.', 'string', "")
table.attr(':padding', 'Specifies the padding within table cells.', 'string', "")
table.attr(':border-radius', 'Specifies the border radius of the table.', 'string', "")
table.attr(':box-shadow', 'Specifies the box shadow effect of the table.', 'string', "")

table.example('''
```eich
<let :width="'100%'" :height="'1000px'" :border-width="'2px'" :align="'center'" :border-style="'dashed'" :border-color="'red'" :background-color="'#eef'" />
<table
  :width="width"
  :height="height"
  :border-width="borderWidth"
  :align="align"
  :border-style="borderStyle"
  :border-color="borderColor"
  :background-color="backgroundColor"
>
  <thead>
    <tr>
      <th scope="col">Person</th>
      <th scope="col">Most interest in</th>
      <th scope="col">Age</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Chris</th>
      <td>HTML tables</td>
      <td>22</td>
    </tr>
    <tr>
      <th scope="row">Dennis</th>
      <td>Web accessibility</td>
      <td>45</td>
    </tr>
    <tr>
      <th scope="row">Sarah</th>
      <td>JavaScript frameworks</td>
      <td>29</td>
    </tr>
    <tr>
      <th scope="row">Karen</th>
      <td>Web performance</td>
      <td>36</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row" colspan="2">Average age</th>
      <td>33</td>
    </tr>
  </tfoot>
</table>
```
''', 'Create a table with 100% width, 1000px height, 2px border width, center alignment, dashed border style, red border color, #eef background color')
