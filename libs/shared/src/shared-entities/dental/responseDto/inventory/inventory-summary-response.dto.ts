export class InventorySummaryResponseDto {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  expiringSoonItems: number;
  expiredItems: number;
  totalSuppliers: number;
  totalStorageLocations: number;
  totalTransactionsThisMonth: number;
  
  // Category breakdown
  categoryBreakdown: {
    category: string;
    itemCount: number;
    totalValue: number;
    lowStockCount: number;
  }[];

  // Recent activity
  recentTransactions: {
    id: string;
    date: Date;
    type: string;
    itemName: string;
    quantity: number;
  }[];

  // Alerts
  alerts: {
    type: 'LOW_STOCK' | 'EXPIRING_SOON' | 'EXPIRED';
    message: string;
    itemId: string;
    itemName: string;
    urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
}
