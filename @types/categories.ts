import { RowDataPacket } from "mysql2";

export interface Categories extends RowDataPacket {
  id: number;
  name: string;
  usage_count: number;
  created_at: Date;
}
