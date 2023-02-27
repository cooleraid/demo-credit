export interface Transfer {
  id: number;
  sourceTransactionId: number;
  destinationTransactionId: number;
  createdAt: Date;
  updatedAt: Date;
  deleted: Boolean;
}
