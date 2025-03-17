def comp(name: str, description: str):
  class Comp:
    def __init__(self):
      self.attrs = {}
      self.events = {}
      self.animations = {}
      self.usables = []
      self.examples = []
      self.rules = []
      self.name = name
      self.namespace = ''
      self.description = description
    def attr(self, name: str, description: str, type: str, default: str = ''):
      self.attrs[name] = {
        'description': description,
        'type': type,
        'default': default
      }
      return self
    def event(self, name: str, description: str, params: dict = {}):
      self.events[name] = {
        'description': description,
        'params': params
      }
      return self
    def animation(self, name: str, description: str, params: dict = {}):
      self.animations[name] = {
        'description': description,
        'params': params
      }
      return self
    def example(self, code: str, description: str = ''):
      self.examples.append({
        'code': code,
        'description': description
      })
      return self
    def rule(self, rule: str):
      self.rules.append(rule)
      return self
    def use(self, *comps: list[str]):
      self.usables.extend(comps)
      return self
    def fullname(self, namespace: str):
      self.namespace = namespace
      return self
  return Comp()

def anim(name: str, description: str):
  class Anim:
    def __init__(self):
      self.name = name
      self.description = description
      self.attrs = {}
      self.usables = []
    def attr(self, name: str, description: str, type: str, default: str = ''):
      self.attrs[name] = {
        'description': description,
        'type': type,
        'default': default
      }
      return self
    def usable(self, comp: str):
      self.usables.append(comp)
      return self
  return Anim()

def util(name: str, description: str = ''):
  class Util:
    def __init__(self):
      self.name = name
      self.description = description
      self.attrs = []

    def add_param(self, name: str, description: str, type: str, default: str = ''):
      self.attrs.append({
        'name': name,
        'description': description,
        'type': type,
        'default': default
      })
      return self
      
  return Util()
