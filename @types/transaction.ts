import { RowDataPacket } from "mysql2";

export interface Transaction extends RowDataPacket {
  id: number;
  action: "inbound" | "outbound";
  description: string;
  value: number;
  date: string;
  category_id: number | null;
  payment_id: number | null;
}