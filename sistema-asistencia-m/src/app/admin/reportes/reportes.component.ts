import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Matriz } from '../Matriz';

import * as moment from 'moment';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
moment.locale('es')

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {


  listaMatriz:Array<Matriz>=[]


  showReportAprobado=false
  matriz:Matriz={
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
  }

  constructor(
    private db:AngularFirestore,
    private router:Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getMatriz()
  }

  async getMatriz(){

    this.listaMatriz = []
    var  lista:Array<Matriz>=[]
  
      await this.db.firestore.collection('matriz').where('Aprobado','==',true).get().then(resp=>{
  
        if(resp.docs.length>0){
          
          resp.docs.map(m=>{
              var matriz = m.data() as Matriz
  
              lista.push(matriz)
          })
  
        }
      })
  
       this.listaMatriz = await lista.sort((a,b)=>b.Codigo.localeCompare(a.Codigo))
    }

    dateFormat(date: any, format: string) {


      return moment(date).format(format).toUpperCase()
    }
  

        getReport(Matriz:Matriz){
          this.matriz = Matriz
          this.showReportAprobado= true
      }

      closeReport(){
        this.showReportAprobado = false

        this.getMatriz()
      }

      downloadPDF(x:Matriz){

        this.router.navigate(['/admin/pdf/'+x.IdMatriz])

      }

}
