import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'customFilter',
    pure: false,
    standalone: true
})
export class CustomFilterPipe implements PipeTransform {
    transform(items: any[], callback: (item: any) => boolean): any {
        if (!items || !callback) {
            return items;
        }
        return items.filter(item => callback(item));
    }
}