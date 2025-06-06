// Read a prompt template from a .prompts file and replace <:insert:variable> with the value of the variable
export function prompt(content: string, inserts: Record<string, string> = {}, path: string = './prompts/') {
  return content.replace(/\<:insert:(\w+)\>/g, (_: string, key: string) => inserts[key])
}
