import type { Sprint } from "./Sprint";

export enum CeremonyType {
  DAILY = "DAILY",
  PLANNING = "PLANNING",
  REVIEW = "REVIEW",
  RETROSPECTIVE = "RETROSPECTIVE",
  OTHER = "OTHER",
}

export class Ceremony {
  id: string;
  type: CeremonyType;
  typeDesc?: string;
  scheduledAt: Date;
  startTime: Date;
  endTime: Date;
  duration?: number;
  participants: string[];
  createdAt: Date;
  updatedAt: Date;
  sprintId?: string;
  sprint?: Sprint;

  constructor(
    props: Omit<Ceremony, "id" | "createdAt" | "updatedAt">,
    id?: string
  ) {
    this.id = id ?? "";
    this.type = props.type;
    this.typeDesc = props.typeDesc;
    this.scheduledAt = props.scheduledAt;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.duration = props.duration;
    this.participants = props.participants;
    this.sprintId = props.sprintId;
    this.sprint = props.sprint;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
