from index import index
import os, json

def main():
  body = {}
  for comp in index["components"]:
    body[comp.name] = {
      'description': comp.description,
      'attrs': comp.attrs,
      'events': comp.events,
      'animations': comp.animations,
      'examples': comp.examples
    }
  if not os.path.exists('output'):
    os.makedirs('output')
  with open('output/api.json', 'w') as f:
    json.dump(body, f, indent=2)

if __name__ == '__main__':
  main()
