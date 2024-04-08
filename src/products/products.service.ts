import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

import { PaginationDto } from 'src/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);
  
  onModuleInit() {
    this.$connect();
    this.logger.log('Database conected');
  }
  create(createProductDto: CreateProductDto) {
    return this.products.create({
      data: createProductDto,
    });
  }

  async findAll( paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalProducts = await this.products.count({ where: { available: true } });
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await this.products.findMany({
      where: {
        available: true
      },
      take: limit,
      skip: (page - 1) * limit,
    })

    const result = {
      data: products,
      pagination: {
        count: totalProducts,
        page: page,
        totalPages: totalPages,
      }
    }

    return result;
  }

  async findOne(id: number) {
    const product = await this.products.findFirst({
      where: { id, available: true }
    });

    if (!product) {
      throw new RpcException({
        status: 400,
        message: `Product with id #${ id } not found`
      })
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const { id: __, ...data } = updateProductDto;

    return this.products.update({
      where: { id },
      data: data
    });

  }

  async remove(id: number) {
    await this.findOne(id);

    return this.products.update({
      where: { id },
      data: {
        available: false,
      }
    })
  }

  async validateProducts(ids: number[]) {
    const products = await this.products.findMany({
      where: {
        id: {
          in: ids
        }
      }
    })

    if (ids.length !== products.length) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'Some products were not found',
      })
    }

    return products;
  }
}
