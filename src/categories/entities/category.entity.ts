import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
