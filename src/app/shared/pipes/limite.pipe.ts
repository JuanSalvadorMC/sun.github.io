import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limite'
})
export class LimitePipe implements PipeTransform {

  transform(value: string): string {

 return value.toLocaleUpperCase();
  }

}
