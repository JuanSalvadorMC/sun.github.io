import { Directive, Input, HostListener, OnInit, ElementRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import * as _ from 'lodash';

@Directive({
	selector: '[moneda]',
	providers: [CurrencyPipe]
})
export class CurrencyFormatterDirective implements OnInit {

	@Input() currencymx: any;

	constructor(
		private el: ElementRef,
		private currencyPipe: CurrencyPipe
	) {

	}

	ngOnInit() {
		this.el.nativeElement.value = this.currencyPipe.transform(this.el.nativeElement.value, 'MXN', 'symbol-narrow' );
	}

	@HostListener("focus", ["$event.target.value"])
	onFocus(value) {
		this.el.nativeElement.value = this.currencyPipe.transform(this.parse(value), 'MXN', 'symbol-narrow' );
	}

	@HostListener("blur", ["$event.target.value"])
	onBlur(value) {
		// console.log(value)
		this.el.nativeElement.value = this.currencyPipe.transform(this.parse(value), 'MXN', 'symbol-narrow');
	}

	@HostListener('click', ["$event.target.value"])
	onClick(value) {
		// console.log(value)
		this.el.nativeElement.value = this.parse(value); // opossite of transform
	}

	@HostListener('change', ["$event.target.value"])
	ngOnChanges(value) {
		// console.log(value)
		if (typeof value === 'object')
			value = value.currencymx.currentValue;

		if (value != '')
			this.el.nativeElement.value = this.currencyPipe.transform(this.parse(value), 'MXN', 'symbol-narrow');
	}

	parse(value: string, fractionSize: number = 2): number {
		let numberWithoutFormat = null;
		if (value != null && typeof value !== 'undefined' && value != '') {
			let val = value;
			while (_.includes(val, ',')) {
				val = val.replace(',', '');
			}
			val = val.replace('$', '');
			// console.log(val);
			numberWithoutFormat = parseInt(val,10);
		}
		// console.log(numberWithoutFormat);
		return numberWithoutFormat;
	}

}
