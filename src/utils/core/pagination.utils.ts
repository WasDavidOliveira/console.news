import { count, SQL } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { db } from '@/db/db.connection';
import {
  PaginationOptions,
  PaginatedResult,
  PaginationMeta,
} from '@/types/core/pagination.types';

export class PaginationUtils {
  static validatePaginationParams(
    page: number,
    limit: number,
    maxLimit = 100,
  ): PaginationOptions {
    const validatedPage = Math.max(1, Math.floor(page));
    const validatedLimit = Math.max(1, Math.min(Math.floor(limit), maxLimit));

    return {
      page: validatedPage,
      limit: validatedLimit,
      maxLimit,
    };
  }

  static calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static createPaginationMeta(
    currentPage: number,
    limit: number,
    totalItems: number,
  ): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit);

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }

  static async paginate<T>(
    table: PgTable,
    page: number,
    limit: number,
    whereConditions?: SQL,
    orderBy?: SQL,
    maxLimit = 100,
  ): Promise<PaginatedResult<T>> {
    const validatedParams = this.validatePaginationParams(
      page,
      limit,
      maxLimit,
    );
    const offset = this.calculateOffset(
      validatedParams.page,
      validatedParams.limit,
    );

    let countQuery = db.select({ count: count() }).from(table);
    let dataQuery = db.select().from(table);

    if (whereConditions) {
      countQuery = countQuery.where(whereConditions) as typeof countQuery;
      dataQuery = dataQuery.where(whereConditions) as typeof dataQuery;
    }

    if (orderBy) {
      dataQuery = dataQuery.orderBy(orderBy) as typeof dataQuery;
    }

    const [countResult, data] = await Promise.all([
      countQuery,
      dataQuery.limit(validatedParams.limit).offset(offset),
    ]);

    const totalItems = countResult[0].count;

    const meta = this.createPaginationMeta(
      validatedParams.page,
      validatedParams.limit,
      totalItems,
    );

    return {
      data: data as T[],
      meta,
    };
  }
}

export default PaginationUtils;
