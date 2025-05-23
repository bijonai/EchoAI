import { ChatCompletionMessageParam } from "openai/resources.mjs"
import { startChalkWorkflow } from "./chalk"

const context: ChatCompletionMessageParam[] = []

const test = "create a new page related to the primary page and draw a table to show the function types and their general forms"
let log = ''

export const main = async () => {
  const res = await startChalkWorkflow([], {
    prompt: test,
    document: '<root></root>',
    stream: true
  })

  console.log(res)

  // for await (const chunk of res as any) {
  //   const data = JSON.parse(chunk)
  //   console.log(data[data.length - 1])
  // }

  log += `\n\n${JSON.stringify(res)}`
}

console.time('main')
main().then(() => {
  console.timeEnd('main')
  console.log(context)
})
