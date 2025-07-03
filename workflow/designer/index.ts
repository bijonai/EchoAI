import type { DesignerRequestBody } from "~/types";
import { message } from "@xsai/utils-chat";
import { type Message } from "xsai";
import { DESIGNER_MODEL_BASE_URL, DESIGNER_MODEL_API_KEY, DESIGNER_MODEL } from "~/utils/env";
import { prompt, latest } from "~/utils";
import { ADDITION, SYSTEM, USER, USER_WITH_RESOURCE } from "./prompts";
import { structure } from "./structure";
import { generateObject } from "@xsai/generate-object";
import type { Step } from "~/types/timeline";
import type { Section } from "~/types/resource";

const env = {
  baseURL: DESIGNER_MODEL_BASE_URL,
  apiKey: DESIGNER_MODEL_API_KEY,
  model: DESIGNER_MODEL,
}

export function createDesigner(context: Message[]) {
  return async (options: DesignerRequestBody & { sections?: Section[] }) => {
    if (context.length === 0)
      context.push(message.system(prompt(SYSTEM)))
    if (latest(context)!.role !== 'user')
      if (context.length > 2) {
        context.push(message.system(
          prompt(ADDITION, {
            step: options.step!,
            prompt: options.prompt,
          })
        ))
      } else {
        if (options.sections) {
          context.push(message.user(
            prompt(USER_WITH_RESOURCE, {
              resource: options.sections.map(section => section.text).join('\n\n'),
            })
          ))
        } else {
          context.push(message.user(prompt(USER, {
            prompt: options.prompt,
          })))
        }
      }

    const { object, messages } = await generateObject({
      messages: context,
      output: 'array',
      schema: structure,
      ...env,
    })

    context.push(messages[messages.length - 1])
    return object as unknown as Step[]
  }
}
