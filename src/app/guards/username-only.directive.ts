import { Directive, ElementRef, HostListener, Input, } from '@angular/core';


@Directive({
  selector: '[UserNameOnly]'
})
export class UnsernameOnlyDirective {

  constructor(private _el: ElementRef) {

  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^A-Za-z ]/g, '');
    //this._el.nativeElement.value = initalValue.replace(/[^a-zA-Z ]/g, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}

