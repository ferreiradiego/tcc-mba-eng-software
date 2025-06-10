import type { Sprint } from "./Sprint";

export class Trimester {
  constructor(
    public id: string,
    public year: number,
    public number: number,
    public sprints?: Sprint[]
  ) {}
}