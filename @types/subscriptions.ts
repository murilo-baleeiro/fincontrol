import { RowDataPacket } from "mysql2";

export interface Subscription {
  id: number;
  description: string;
  amount: number;
  due_day: number;
  active: boolean;
  category_id: number;
  payment_method: string;
  category: string;
  cc_name: string | null;
}

export interface SubscriptionDataRow extends RowDataPacket {
  id: number;
  description: string;
  amount: number;
  due_day: number;
  active: boolean;
  category_id: number;
  payment_method_id: number;
  credit_card_id: number | null;
}
