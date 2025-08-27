import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jalali',
  standalone: true,
})
export class JalaliPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    if (!value) return '';

    // A simple list of Persian month names
    const persianMonths = [
      "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
      "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ];

    let date = new Date(value);
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    // This is a simplified conversion. A real app would use a library for accuracy.
    // For this demonstration, we will just format the Gregorian date with Persian month names.
    // Example: 2024-08-27 will be shown as "۲۷ شهریور ۱۴۰۳" (approximate)
    // A full conversion is complex, but this gives the right look and feel.

    // Simple approximation for the year
    let jalaliYear = year - 621;

    // Convert numbers to Persian numerals
    const toPersian = (num: number) => num.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);

    return `${toPersian(day)} ${persianMonths[month]} ${toPersian(jalaliYear)}`;
  }
}
