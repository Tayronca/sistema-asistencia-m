import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Matriz } from '../../Matriz';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/shared/services/user';
import { AuthService } from 'src/app/shared/services/auth.service';
moment.locale('es')

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

    @Input() Matriz:Matriz={
      IdMatriz: '',
      Codigo: '',
      FechaInicio: '',
      FechaFin: '',
      FechaEntrega: '',
      UsuarioEntrega: '',
      UsuarioAprobado: '',
      UsuarioRecibido: '',
      Entregado: false,
      Aprobado: false,
      Recibido: false,
      Docentes: []
    };

    @Output() Close:EventEmitter<any> = new EventEmitter();
  constructor(
    private db: AngularFirestore,
    public authService: AuthService, 
  ) { }

  ngOnInit(): void {

  }

  
  dateFormat(date: any, format: string) {


    return moment(date).format(format).toUpperCase()
  }

  confirm(){
      if(this.Matriz.IdMatriz){
        var user = this.authService.userData as User
        this.Matriz.Aprobado = true
        this.Matriz.UsuarioAprobado =  user.titulo.split('.')[0] +". "+  user.nombres +" "+user.apellidos

        this.db.firestore.collection('matriz').doc(this.Matriz.IdMatriz).update(this.Matriz).then(()=>{
          this.Close.emit()

        }).catch(err=>console.log(err))
      }
  }
  close(){
    this.Close.emit()
  }

}
