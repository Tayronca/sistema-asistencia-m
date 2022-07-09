import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  @Input() Titulo:string='';
  @Input() Descripcion:any='';
  @Input() Id:string='';
  @Output() Close:EventEmitter<any> = new EventEmitter();
  @Output() Confirm:EventEmitter<any> = new EventEmitter();

constructor(
) { }

ngOnInit(): void {
}

close(){
  this.Close.emit()
}

confirm(){
  this.Confirm.emit(this.Id)
}

}
