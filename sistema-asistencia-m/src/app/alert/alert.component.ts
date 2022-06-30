import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

    @Input() Titulo:string='';
    @Input() Descripcion:any='';
    @Output() Close:EventEmitter<any> = new EventEmitter();

  constructor(
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.Close.emit()
  }

}
