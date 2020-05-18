export interface MessageEvent {
  data: string;
}

export interface BtnEvent {
  action: string;
  context: string;
  device: string;
  event: "keyDown" | "keyUp" | "willAppear" | "willDisappear" | "titleParametersDidChange";
  payload: Payload;
}

interface Payload {
  coordinates: Coordinates;
  isInMultiAction: boolean;
  settings: Settings;
  state: number;
}

interface Settings {
}

interface Coordinates {
  column: number;
  row: number;
}