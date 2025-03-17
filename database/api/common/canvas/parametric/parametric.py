from api import comp

parametric = comp('parametri  c', 'A parametric graph')
parametric.fullname('canvas:parametric')

parametric.attr('expr', 'The expression of the parametric graph', '(t: number) => [number, number]')
parametric.attr('domain', 'The domain of the parametric graph', '[number, number]', '[-Math.Infinity, Math.Infinity]')
parametric.attr('range', 'The range of the parametric graph', '[number, number]', '[-Math.Infinity, Math.Infinity]')
