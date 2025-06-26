export type Position = string
export type WithId<T> = T & {
  id: string;
}

export type AddNodeOperation = WithId<{
  type: "add-node";
  position: Position;
  content: string;
}>;
export type SetPropOperation = WithId<{
  type: "set-prop";
  position: Position;
  attr: string;
  value: string;
}>;
export type SetContentOperation = WithId<{
  type: "set-content";
  position: Position;
  content: string;
}>;
export type RemovePropOperation = WithId<{
  type: "remove-prop";
  position: Position;
  attr: string;
}>;
export type RemoveNodeOperation = WithId<{
  type: "remove-node";
  position: Position;
}>;

export type Operation = WithId<
  | AddNodeOperation
  | SetPropOperation
  | SetContentOperation
  | RemovePropOperation
  | RemoveNodeOperation
>
  