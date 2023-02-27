export interface Transaction {
  id: number;
  amount: number;
  userId: number;
  type: string;
  status: string;
  direction: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Boolean;
}
