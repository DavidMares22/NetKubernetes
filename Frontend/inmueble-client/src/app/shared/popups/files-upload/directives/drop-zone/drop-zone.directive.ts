import { Directive, EventEmitter, Host, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDropZone]',
})
export class DropZoneDirective {

  @Output() dropped = new EventEmitter<FileList>();
  @Output() hovered = new EventEmitter<boolean>();

  constructor() { }

  // This event is fired when the dragged item is dropped on the drop zone
  // The event contains the dataTransfer object which contains the files

  @HostListener('drop', ['$event'])
  onDrop($event: any) {
    $event.preventDefault();
    this.dropped.emit($event.dataTransfer.files);
    this.hovered.emit(false);
  
  }

  // This event is fired when the dragged item enters the drop zone
  // without dropping it

  @HostListener('dragover', ['$event'])
  onDragOver($event : any) {
    $event.preventDefault();
    this.hovered.emit(true);

  }

  // This event is fired when the dragged item leaves the drop zone
  // without dropping it

  @HostListener('dragleave', ['$event'])
  onDragLeave($event : any) {
    $event.preventDefault();
    this.hovered.emit(false);

  }


}
