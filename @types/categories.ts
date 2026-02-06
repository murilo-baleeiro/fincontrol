import { RowDataPacket } from "mysql2";

export interface Categories {
  id: number;
  name: string;
  type: "inbound" | "outbound";
  created_at: Date;
}

export interface CategoriesResult extends RowDataPacket {
  id: number;
  name: string;
  type: "inbound" | "outbound";
  created_at: Date;
}
