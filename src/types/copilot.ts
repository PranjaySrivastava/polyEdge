import { ScannerFinding } from './market';

export type CopilotIntentType = 
  | "EXPLAIN_TOP_EDGE"       // "Show/explain highest discrepancy"
  | "CALCULATE_RETURN"       // "Calculate return on $50 YES position"
  | "PORTFOLIO_STATUS"       // "How is my paper portfolio doing?"
  | "COMPARE_CONTRACTS"      // "Compare Fed rate cut contracts"
  | "EXPLAIN_CONCEPT"        // "What is implied probability vs arbitrage?"
  | "UNKNOWN";

export interface CopilotMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  intent?: CopilotIntentType;
  relatedFinding?: ScannerFinding;
  calculationBreakdown?: {
    shares?: number;
    entryPrice?: number;
    investment?: number;
    potentialPayout?: number;
    potentialProfit?: number;
    returnPercentage?: number;
  };
  suggestedActions?: {
    label: string;
    actionType: "inspect_finding" | "open_order_slip" | "switch_tab";
    payload?: string;
  }[];
}
