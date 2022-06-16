import { query } from "express";
import {Paginate, Paginated, PaginateQuery, PaginateConfig} from "nestjs-paginate";
import { SelectQueryBuilder } from "typeorm";
export class ApiPaginateResponse implements PaginateConfig<any>{
    constructor(
       statusCode: number,
       message?: string,
       data?: any,
    ) {
       this.statusCode = statusCode;
       this.message = message;
       this.data = data;
    }
    statusCode:number;
    message:string;
    data?:any;
    
    sortableColumns: string[];
    searchableColumns?: string[];
    maxLimit?: number;
    defaultSortBy?: [string, "ASC" | "DESC"][];
    defaultLimit?: number;
    where?: any;
    queryBuilder?: SelectQueryBuilder<any>;
}