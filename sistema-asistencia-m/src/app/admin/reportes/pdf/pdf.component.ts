import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Matriz } from '../../Matriz';

import * as moment from 'moment';
moment.locale('es')

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";


@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {

    id:string=''
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

  @ViewChild("reporte")
  reporte!: ElementRef;

constructor(
  private route:ActivatedRoute,
  private db:AngularFirestore,
  private router:Router,
  public authService: AuthService, 
) { }

  ngOnInit(): void {

        this.route.paramMap.forEach(params=>{

          var id  = String(params.get('id'));

          this.id = id;

          this.getMatriz(id)
        
    })
  }

  async getMatriz(id:string){

    this.db.firestore.collection('matriz').doc(id).get().then(e=>{
      if(e.exists){

        this.Matriz = e.data() as Matriz
      }
    })
  }

  dateFormat(date: any, format: string) {


    return moment(date).format(format).toUpperCase()
  }

  async descargar(){

      var code = this.Matriz.Codigo
      var fecha = this.Matriz.FechaEntrega

         var doc = new jsPDF('p', 'mm', [297, 210])
      
          var w = this.reporte.nativeElement.offsetWidth;
          var h =  this.reporte.nativeElement.offsetHeight;

         await html2canvas( this.reporte.nativeElement, {
              scale: 2,
          }).then((canvas) => {
              var img = canvas.toDataURL("image/jpeg", 1);
             
              doc.addImage(img, "JPEG", 0, 0, 210, 297);

             
          });

         await  doc.setProperties({title:code+"_"+fecha+"_matriz_.pdf"})
          await window.open(doc.output('bloburl'), '_blank')

  }

  

}
