export enum CeremonyType {
  DAILY = 'DAILY',
  PLANNING = 'PLANNING',
  REVIEW = 'REVIEW',
  RETROSPECTIVE = 'RETROSPECTIVE',
}

export class Ceremony {
  id: string;
  type: CeremonyType;
  scheduledAt: Date;
  startTime: Date;
  endTime: Date;
  duration?: number;
  participants: string[];
  timeLogs: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Omit<Ceremony, 'id' | 'createdAt' | 'updatedAt'>, id?: string) {
    this.id = id ?? '';
    this.type = props.type;
    this.scheduledAt = props.scheduledAt;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.duration = props.duration;
    this.participants = props.participants;
    this.timeLogs = props.timeLogs;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
