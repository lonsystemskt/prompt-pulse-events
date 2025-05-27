
export interface Demand {
  id: string;
  title: string;
  subject: string;
  date: string;
  completed: boolean;
  completedAt?: string;
}

export interface Event {
  id: string;
  name: string;
  logo?: string;
  date: string;
  demands: Demand[];
}
