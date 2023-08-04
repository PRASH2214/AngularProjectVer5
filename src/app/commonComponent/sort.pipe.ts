import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sortgrid'
})

@Injectable()
export class SortGridPipe implements PipeTransform {
    transform(array: any[], args: string): any[] {
        if (typeof array === "undefined") {
            return array;
        }
        let direction = args[0][0];
        let column = args.replace('-', '');
        array.sort((a: any, b: any) => {
            if (!a[column].localeCompare(b[column])) {
                return (direction === "-") ? b[column].localeCompare(a[column]) : a[column].localeCompare(b[column]);
            }
            return (direction === "-") ? b[column].localeCompare(a[column]) : a[column].localeCompare(b[column]);
        });
        return array;
    }
    // transform(array: Array<any>, args: string): Array<any> {
    //     if (typeof array === "undefined") {
    //         return array;
    //     }
    //     let direction = args[0][0];
    //     let column = args.replace('-', '');
    //     array.sort((a: any, b: any) => {
    //         let left = Number(new Date(a[column]));
    //         let right = Number(new Date(b[column]));
    //         return (direction === "-") ? right - left : left - right;
    //     });
    //     return array;
    // }
}