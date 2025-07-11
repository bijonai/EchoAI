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
  children: Branch[]
  from?: string
  to?: string
}


