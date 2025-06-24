export interface Step {
  step: string
  problem: string
  knowledge: string
  explanation: string
  conclusion: string
  interaction: string
}

export interface Branch {
  steps: Step[]
  start?: string
  end?: string
}


