export type NewPage = {
  type: 'new-page',
  title: string
}

export type SwitchPage = {
  type: 'switch-page',
  pageId: string
}

export type PageSwitch = NewPage | SwitchPage
