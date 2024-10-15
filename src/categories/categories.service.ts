import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { Response } from 'src/utils/response.utils';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    if (!name || name.trim() === '') {
      throw new BadRequestException(
        Response(false, 'Please provide a valid category name', null),
      );
    }

    const existingCategory = await this.categoriesRepository.findOne({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictException(
        Response(false, 'Category already exists', null),
      );
    }

    const category = this.categoriesRepository.create(createCategoryDto);

    try {
      const result = await this.categoriesRepository.save(category);
      return Response(true, 'Category created successfully!', result);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      const categories = await this.categoriesRepository.find();
      return Response(true, 'Categories fetched successfully', categories);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoriesRepository.findOne({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(
          Response(false, `Data with ID ${id} not found`, null),
        );
      }

      return Response(true, 'Data fetched successfully', category);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findOne({ where: { id } });

    if (!category) {
      throw new BadRequestException(
        Response(false, 'Category not found', null),
      );
    }

    Object.assign(category, updateCategoryDto);

    try {
      const updatedCategory = await this.categoriesRepository.save(category);
      return Response(true, 'Category updated successfully!', updatedCategory);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(
        Response(false, `Category with ID ${id} not found`, null),
      );
    }

    try {
      await this.categoriesRepository.remove(category);
      return Response(true, 'Category deleted successfully!', null);
    } catch (error) {
      throw new Error(error);
    }
  }
}
