from .common.canvas.canvas import canvas
from .common.canvas.angle import angle_set
# from .common.canvas.axis import axis_set
from .common.canvas.circle import circle_set
from .common.canvas.dot import dot_set
from .common.canvas.figure import figure_set
from .common.canvas.function import function_set
# from .common.canvas.graphs import graphs_set
from .common.canvas.line import line_set
from .common.canvas.parametric import parametric_set
from .common.canvas.plane import plane_set
from .common.canvas.polygon import polygon_set
# from .common.canvas.vector import vector_set
from .common.layout import layout_set
from .common.text import text_set


components = [
    canvas,
    *angle_set,
    *circle_set,
    *dot_set,
    *figure_set,
    *function_set,
    *line_set,
    *plane_set,
    *parametric_set,
    *polygon_set,
    # *layout_set,
    # *text_set,
]

animations = []

examples = []

index = {
    "components": components,
    "animations": animations,
    "examples": examples
}