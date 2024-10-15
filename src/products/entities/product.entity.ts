import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  stock: number;

  @Column()
  price: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
