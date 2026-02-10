
export enum AppState {
  LOADING = 'LOADING',
  NAME_INPUT = 'NAME_INPUT',
  CHOICE = 'CHOICE',
  RESULT = 'RESULT'
}

export interface LoveNote {
  message: string;
  isCustom: boolean;
}
