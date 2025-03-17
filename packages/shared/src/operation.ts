export type Position = string
export type WithId<T> = T & {
  id: string;
}

export type AddNodeOperation = {
  type: "add-node";
  position: Position;
  content: string;
};
export type SetPropOperation = {
  type: "set-prop";
  position: Position;
  attr: string;
  value: string;
};
export type SetContentOperation = {
  type: "set-content";
  position: Position;
  content: string;
};
export type RemovePropOperation = {
  type: "remove-prop";
  position: Position;
  attr: string;
};
export type RemoveNodeOperation = {
  type: "remove-node";
  position: Position;
};

export type Operation = WithId<
  | AddNodeOperation
  | SetPropOperation
  | SetContentOperation
  | RemovePropOperation
  | RemoveNodeOperation
>
  