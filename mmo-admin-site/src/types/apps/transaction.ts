export interface TransactionDto {
  id: string;
  user: UserTransactionDto;
  amount: number;
  transactionType: string;
  balanceBefore: number;
  balanceAfter: number;
  reason: string;
  createdAt: string;
}

export interface UserTransactionDto {
  id: number;
  fullName: string;
  username: string;
  avatar: string;
}
