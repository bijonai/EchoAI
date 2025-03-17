import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from api.index import index
import toml

def generte_api_document(comp: dict):
  content = ''
  content += f"# `<{comp.name}>`\n"
  if comp.namespace:
    content += f"> fullname: {comp.namespace}\n\n"
  content += f"{comp.description}\n\n"
  content += "## Attributes\n\n"
  for key in comp.attrs:
    content += f"- `{key}`: {comp.attrs[key]['description']} ({comp.attrs[key]['type']}){f' [{comp.attrs[key]['default']}]' if comp.attrs[key]['default'] != None else ''}\n"
  content += "\n"
  content += "## Rules\n"
  for rule in comp.rules:
    content += f"- `{rule}`\n"
  content += "\n"
  content += "## Examples\n"
  for i, example in enumerate(comp.examples):
    content += f"- example {str(i + 1)}: {example['description']}\n"
    content += example['code'] + "\n"
  return content

def generate_konwledges(path: str):
  with open(os.path.join(path, 'knowledges.toml'), 'r') as f:
    data = toml.load(f)
    usages = data['usages']
    results = []
    for usage in usages:
      result = ''
      result += f'Task: {usage["description"]}\n'
      result += f'Knowledge About: {data["name"]}\n\n'
      with open(os.path.join(path, usage['usage'].replace('./', '')), 'r') as f:
        result += f.read()
      results.append(result)
    return results


if __name__ == "__main__":
  api_result = ''
  for item in index['components']:
    api_result += generte_api_document(item) + '\n\n======\n\n'
  if not os.path.exists('output/documents'):
    os.makedirs('output/documents')

  with open('output/documents/references.md', 'w') as f:
    f.write(api_result)
  
  knowledges_result = ''
  for item in os.listdir('database'):
    if os.path.exists(os.path.join('database', item, 'knowledges.toml')):
      knowledges_result += '\n\n======\n\n'.join(generate_konwledges(os.path.join('database', item)))
      print(f'{item} done {len(knowledges_result)}')
  with open('output/documents/knowledges.md', 'w') as f:
    f.write(knowledges_result)
