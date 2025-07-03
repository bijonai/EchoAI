export enum ResourceType {
  LESSON = 'lesson',
}

export interface ResourceTag {
  name: string
  id: string
}

export interface Section {
  text: string
}

export interface PublicResource {
  id: string
  type: ResourceType
  name: string
  tags: ResourceTag[]
  author: string
  author_id: string
  description: string
  readme: string
}

export interface PrivateResource extends PublicResource {
  sources: Record<string, string>
  sections: Section[]
}

// --- Server ---

export interface ResourceUploadRequestBody {
  type: ResourceType
  name: string
  tags: ResourceTag[]
  author: string
  author_id: string
  description: string
  readme: string
  sources: Record<string, string>
  sections: Section[]
}

export interface ResourceUploadResponse {
  id: string
}

export interface ResourceQueryRequestBody {
  limit: number
  offset: number
}

export interface ResourceQueryResponse {
  resources: PublicResource[]
}