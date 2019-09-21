export interface IItem {
  path: string;
  type: string;
  name: string;
  size: number;
  children: Array<any>;
  isOpened?: boolean;
}
