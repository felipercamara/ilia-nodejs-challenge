/**
 * DTO for balance response
 * Based on OpenAPI specification: BalanceResponse schema
 * Returns the consolidated amount from CREDIT and DEBIT transactions
 */
export class BalanceResponseDto {
  amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }
}
