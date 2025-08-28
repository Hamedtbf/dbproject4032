import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jalali',
  standalone: true,
})
export class JalaliPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    if (!value) return '';

    const persianMonths = [
      "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
      "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ];

    let date = new Date(value);
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();


    let jalaliYear = year - 621;

    const toPersian = (num: number) => num.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);

    return `${toPersian(day)} ${persianMonths[month]} ${toPersian(jalaliYear)}`;
  }
}
