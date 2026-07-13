export type TicketStatus = "new" | "in_progress" | "done" | "archived";

export type TicketRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
};

export type TicketInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  message: string;
};
