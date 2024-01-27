import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class ShopListItem {
  @PrimaryColumn()
  name: string;

  @Column()
  rank: number;

  @Column()
  active: boolean;

  @Column()
  _deleted: boolean;

  @Column()
  lastUpdate: number;
}
