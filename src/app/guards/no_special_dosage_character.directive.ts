import { Directive, ElementRef, HostListener, Input } from '@angular/core';


@Directive({
  selector: '[Ignoredosagespecialchar]'
})
export class IgnoredosagespecialcharDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^A-Za-z0-9()/ ]/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}