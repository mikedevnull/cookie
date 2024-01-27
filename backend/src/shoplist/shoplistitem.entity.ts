import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ShopListItem')
export class ShopListItemEntity {
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
