import { MatChipInputEvent } from '@angular/material';

import { FuseUtils } from '@fuse/utils';

export class Product {
    intGlCode: number
    varProductCode: string;
    varProductName: string;
    fk_PTMGlCode: number;
    chrProductType: string;
    varGTINNo: string;
    varGenericName: string;
    varComposition: string;
    chrScheduled: string;
    varUsage: string;
    chrMonocarton: string;
    chrActive: string;

   

    /**
     * Constructor
     *
     * @param product
     */
    constructor(product?) {
        product = product || {};
        this.intGlCode = product.intGlCode || 0;
        this.varProductCode = product.varProductCode || '';
        this.varProductName = product.varProductName || '';
        this.fk_PTMGlCode = product.fk_PTMGlCode || 0;
        this.chrProductType = product.chrProductType || '';
        this.varGTINNo = product.varGTINNo || '';
        this.varGenericName = product.varGenericName || '';
        this.varComposition = product.varComposition || '';
        this.chrScheduled = product.chrScheduled || '';
        this.varUsage = product.varUsage || '';
        this.chrMonocarton = product.chrMonocarton || '';
        this.chrActive = product.chrActive || '';
    }

   
}
