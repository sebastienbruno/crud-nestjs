import { Injectable } from '@nestjs/common';
import { offApiConstants } from './constants';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

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
            .pipe(map((response) => response.data));

        return response;
    }
}
