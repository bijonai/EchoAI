import type { DesignerRequestBody } from "~/types";
import { prompt, latest } from "~/utils";
import { ADDITION, SYSTEM, USER, USER_WITH_RESOURCE } from "./prompts";
import { structure } from "./structure";
import type { Step } from "~/types/timeline";
import type { Section } from "~/types/resource";
import { message } from "~/utils/ai-sdk/message";
import { generateObject, type Message } from "ai";
import { designerModel } from "~/utils/ai-sdk/designer-provider";

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

    const { object } = await generateObject({
      model: designerModel,
      output: 'array',
      schema: structure,
      messages: context,
    })

    return object as unknown as Step[]
  }
}
