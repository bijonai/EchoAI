from api import comp

tex = comp('tex', 'Render a latex formula.')
tex.attr('color', 'The color of the tex formula.')

tex.example('''
```eich
<flexbox>
  <column>
    <canvas :width="300" :height="200" :origin="[150, 0]">
      <let :division="50"/>
      <polygon :points="[
        [-3 * division, 3 * division, 'B', '45'],
        [3 * division, 3 * division, 'C', '\\theta'],
        [0, division, 'A', '90']
      ]"></polygon>
    </canvas>
  </column>
  <column>
    <tex>
      \\theta = 180^\circ - \\angle ABC - \\angle BAC \\
      = 180^\circ - 45^\circ - 90^\circ \\
      = 45^\circ
    </tex>
  </column>
</flexbox>
```
''', 'Triangle ABC is a right-angled triangle with BAC = 90 ABC = 45 and BCA = theta. Draw and solve for theta.')
