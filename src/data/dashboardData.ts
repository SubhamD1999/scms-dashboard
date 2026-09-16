
export interface TransactionMetric {
  label: string;
  value: number;
  icon: "indent" | "issue" | "receive" | "expiry";
}

export interface DistrictRow {
  slNo: number;
  district: string;
  totalIndent: number;
  annualIndent: number;
  percentage: number;
}
export interface TopStat {
  id: string;
  label: string;
  value: number;
  icon: "store" | "layers" | "box" | "pill";
  variant: "light" | "filled";   // ← new
}

export interface TransactionRow {
  slNo: number;
  district: string;
  facilityType: string;
  storeName: string;
  verified: boolean;
  totalIndent: number;
  totalIssued: number;
  totalReceipt: number;
}

export const topStats: TopStat[] = [
  { id: "stores",     label: "Stores",          value: 1256, icon: "store",  variant: "filled" },
  { id: "categories", label: "Item Categories", value: 37,   icon: "layers", variant: "filled" },
  { id: "items",      label: "Items",           value: 5250, icon: "box",    variant: "filled" },
  { id: "edl",        label: "EDL",             value: 804,  icon: "pill",   variant: "filled" },
];

export const totalTransactions: TransactionMetric[] = [
  { label: "Indent", value: 242336, icon: "indent" },
  { label: "Issue", value: 186532, icon: "issue" },
  { label: "Receive", value: 941174, icon: "receive" },
  { label: "Short Expiry", value: 23, icon: "expiry" },
];

export const averageTransactions: TransactionMetric[] = [
  { label: "Avg Indent", value: 88, icon: "indent" },
  { label: "Avg Issue", value: 80, icon: "issue" },
  { label: "Avg Receive", value: 9, icon: "receive" },
  { label: "Avg Short Expiry", value: 248, icon: "expiry" },
];

export const todaysTransactions: TransactionMetric[] = [
  { label: "Today's Indent", value: 155, icon: "indent" },
  { label: "Today's Issue", value: 135, icon: "issue" },
  { label: "Today's Receive", value: 408, icon: "receive" },
  { label: "Today's Short Expiry", value: 0, icon: "expiry" },
];

export const districtIndentQuantity: DistrictRow[] = [
  { slNo: 1, district: "Gomati", totalIndent: 42675, annualIndent: 133, percentage: 17 },
  { slNo: 2, district: "West Tripura", totalIndent: 42056, annualIndent: 337, percentage: 17 },
  { slNo: 3, district: "South Tripura", totalIndent: 36858, annualIndent: 235, percentage: 15 },
  { slNo: 4, district: "Dhalai", totalIndent: 33542, annualIndent: 195, percentage: 14 },
  { slNo: 5, district: "North Tripura", totalIndent: 30493, annualIndent: 241, percentage: 12 },
  { slNo: 6, district: "Sipahijala", totalIndent: 24446, annualIndent: 338, percentage: 10 },
  { slNo: 7, district: "Unakoti", totalIndent: 18629, annualIndent: 134, percentage: 8 },
  { slNo: 8, district: "Khowai", totalIndent: 13618, annualIndent: 247, percentage: 6 },
  { slNo: 9, district: "West Tripura", totalIndent: 2716, annualIndent: 0, percentage: 1 },
  { slNo: 10, district: "West Tripura", totalIndent: 91, annualIndent: 0, percentage: 0 },
];

export const allTransactions: TransactionRow[] = [
  {
    slNo: 1,
    district: "Gomati",
    facilityType: "WareHouse",
    storeName: "District Medicine Store, Gomati",
    verified: true,
    totalIndent: 50,
    totalIssued: 5390,
    totalReceipt: 217,
  },
  {
    slNo: 2,
    district: "West Tripura",
    facilityType: "WareHouse",
    storeName: "District Health And Family Welfare Society, West",
    verified: true,
    totalIndent: 32,
    totalIssued: 4615,
    totalReceipt: 417,
  },
  {
    slNo: 3,
    district: "Dhalai",
    facilityType: "WareHouse",
    storeName: "District Health And Family Welfare Society, Dhalai",
    verified: true,
    totalIndent: 52,
    totalIssued: 4526,
    totalReceipt: 445,
  },
  {
    slNo: 4,
    district: "Gomati",
    facilityType: "Sub District Hospital",
    storeName: "Amarpur SDH",
    verified: true,
    totalIndent: 93,
    totalIssued: 4245,
    totalReceipt: 503,
  },
  {
    slNo: 5,
    district: "Gomati",
    facilityType: "District Hospital",
    storeName: "District Hospital of Gomati District",
    verified: true,
    totalIndent: 72,
    totalIssued: 3696,
    totalReceipt: 411,
  },
];


export const fulfillmentRate = Math.round(
  (totalTransactions[1].value / totalTransactions[0].value) * 100
);

export const organisationName = "National Health Mission";
