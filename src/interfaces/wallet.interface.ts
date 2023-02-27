export interface Wallet {
  id: number;
  balance: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  deleted: Boolean;
}
