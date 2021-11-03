import { Injectable, NotFoundException } from '@nestjs/common';
import { offApiConstants } from './constants';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import e from 'express';

@Injectable()
export class ProductsService {

    constructor(private httpService: HttpService) {}

    async getProduct(barcode: number) {

        const url = `https://${offApiConstants.hostname}${offApiConstants.path}/${barcode}.json`
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'TechnicalTestsInnovorder - SBR',
            }
        };
        const response = this.httpService.get(url, config )
            .pipe(map((response) => {
                if(response.data.status === 0) {
                    throw new NotFoundException(e, `Product ${barcode} not found`);
                } 
                return response.data;
            }));
        return response;
    }
}
