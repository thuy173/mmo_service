export enum TransactionType {
    DEPOSIT,
    WITHDRAW,
}

export interface Transaction {
    id: string;
    paymentMethodId: number;
    amount: number;
    transactionType: TransactionType;
    balanceBefore: number;
    balanceAfter: number;
    reason: string;
    createdAt: Date;
}