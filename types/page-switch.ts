export type AddPage = {
  type: 'add-page',
  title: string
}

export type SwitchPage = {
  type: 'switch-page',
  pageId: string
}

export type PageSwitch = AddPage | SwitchPage
