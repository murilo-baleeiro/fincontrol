import { RowDataPacket } from "mysql2";

export interface Categories extends RowDataPacket {
  id: number;
  name: string;
  created_at: Date;
}