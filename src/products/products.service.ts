import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Response } from 'src/utils/response.utils';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { name, categoryId, stock, price } = createProductDto;

    const existingProduct = await this.productsRepository.findOne({
      where: { name },
    });

    if (existingProduct) {
      throw new ConflictException(
        Response(false, 'Product already exists', null),
      );
    }

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(Response(false, 'Category not found', null));
    }

    const product = this.productsRepository.create({
      name,
      stock,
      price,
      category,
    });

    try {
      const result = await this.productsRepository.save(product);
      return Response(true, 'Product added successfully', result);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      const products = await this.productsRepository.find();
      return Response(true, 'Products fetched successfully', products);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.productsRepository.findOne({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(
          Response(false, `Product with ID ${id} not found`, null),
        );
      }

      return Response(true, 'Products fetched successfully', product);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(Response(false, `Product not found`, null));
    }

    Object.assign(product, updateProductDto);

    try {
      const updatedProduct = await this.productsRepository.save(product);

      return Response(true, 'Product updated successfully!', updatedProduct);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException(
        Response(false, `Product with ID ${id} not found`, null),
      );
    }

    try {
      await this.productsRepository.remove(product);
      return Response(false, `Product with ID ${id} has been deleted`, null);
    } catch (error) {
      throw new Error(error);
    }
  }
}
