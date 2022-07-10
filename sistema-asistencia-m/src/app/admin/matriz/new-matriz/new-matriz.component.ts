import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import { Docente } from '../../docentes/Docente';
import { Facultad } from '../../docentes/Facultad';
import { Matriz } from '../../Matriz';
import { Semana } from './Semana';

moment.locale('es')

@Component({
  selector: 'app-new-matriz',
  templateUrl: './new-matriz.component.html',
  styleUrls: ['./new-matriz.component.css']
})
export class NewMatrizComponent implements OnInit {

  fechaInicio: string = ''
  fechaFin: string = ''
  IdDocente: string = ''
  docentes: Array<Docente> = []
  referencia: Semana = {
    Total: 0
  }

  semanas: Array<any> = []
  totalMes:number=0

  facultad:string=""
  cedula:string=""

  Observaciones:string=''
  valid:boolean=false



  constructor(
    private db: AngularFirestore,
  ) { }

  ngOnInit(): void {

    this.fechaInicio = moment(new Date()).format('yyyy-MM-DD')
    this.fechaFin = moment(new Date()).format('yyyy-MM-DD')

    this.getDocentes()

    this.getSemanasFecha()
  }

  async getDocentes() {

    this.docentes = []

    await this.db.firestore.collection('docentes').orderBy('Apellidos', 'asc').get().then(e => {

      if (e.docs.length > 0) {

        e.docs.map(doc => {
          var docente = doc.data() as Docente

          this.docentes.push(docente)


        })
      }
    })

    if (this.docentes.length > 0) {
      this.IdDocente = await this.docentes[0].IdDocente

      await this.getFichas(this.docentes[0])
    }

  }

  async getDocente() {

    if (this.IdDocente != '') {
      await this.db.firestore.collection('docentes').doc(this.IdDocente)
        .get().then(e => {

          if (e.exists) {
            this.getFichas(e.data() as Docente)
          }

        })
    }
  }


  async getFichas(docente: Docente) {
    var d = docente
    var matriz: Matriz = {
      IdMatriz: "",
      IdDocente: d.IdDocente,
      Nombre: d.Nombres + " " + d.Apellidos,
      Cedula: d.Cedula,
      Facultad: "",
      FechaInicio: "",
      FechaFin: "",
      FechaEntrega: "",
      TotalHorasMes: "",
      TotalHorasreferencia: "",
      Observaciones: "",
      UsuarioEntrega: "",
      UsuarioAprobado: "",
      UsuarioRecibido: "",
      Entregado: false,
      Aprobado: false,
      Recibido: false,
      Fichas: []

    }

    var facultad = await this.getFacultad(d.Facultad)

    matriz.Facultad = facultad

    this.facultad = facultad
    this.cedula = d.Cedula

    this.referencia ={Total:0}

    await this.db.firestore.collection('zoom').where("IdDocente", '==', matriz.IdDocente)
      .get().then(e => {

        if (e.docs.length > 0) {

          var TotalHorasMes = 0
          var exist = false

          e.docs.map(f => {
            var ficha = f.data() as any

            var fechaFicha = new Date(ficha.HoraInicio.toDate())

            var fechaInicio = new Date(this.fechaInicio)
            var fechaFin = new Date(this.fechaFin)

            if (fechaFicha >= fechaInicio && fechaFicha <= fechaFin) {

              matriz.Fichas.push(ficha)

              TotalHorasMes += Math.round(parseFloat(ficha.Duracion.toString()) / 60)
            }

          })


          matriz.TotalHorasMes = TotalHorasMes.toString()



        }



        if (matriz.Fichas.length > 0) {

          this.referencia = {
            Total: 0
          }

          matriz.Fichas.map(ficha => {

            var date = ficha.HoraInicio as any

            var day = moment(date.toDate()).format('dddd') as string


            if (!this.referencia[day]) {
              this.referencia[day] = Math.round(parseFloat(ficha.Duracion.toString()) / 60)
              this.referencia.Total += Math.round(parseFloat(ficha.Duracion.toString()) / 60)
            }




          })


        }

      })

    this.getSemanasFecha()
  }

  async getFacultad(IdFacultad: string) {

    var nombre: string = ''

    nombre = await this.db.firestore.collection('facultad').doc(IdFacultad).get().then(e => {

      if (e.exists) {
        var facultad = e.data() as Facultad
        return facultad.Nombre.toString()
      }

      return ""
    })


    return nombre
  }


  dateFormat(date: any, format: string) {


    return moment(date).format(format).toUpperCase()
  }

  getNameDocente() {
    var docente = this.docentes.find(e => e.IdDocente == this.IdDocente)


    return docente?.Apellidos + " " + docente?.Nombres
  }

  getSemanasFecha() {

    var currentDate = new Date(this.fechaInicio)
    var fechaFin = new Date(this.fechaFin)

    currentDate.setDate(currentDate.getDate() + 1)
    fechaFin.setDate(fechaFin.getDate() + 1)


    var dates = [];

    while (currentDate <= fechaFin) {


      dates.push(currentDate);


      var d = new Date(currentDate.valueOf());
      d.setDate(d.getDate() + 1);
      currentDate = d;

    }

    this.getWeekends(dates)
  }


  getWeekends(dates: any) {

    this.totalMes =0

    this.semanas = []


    var count = 0

    var semana: any = {}


    dates.forEach(async (day: any) => {



      var d = moment(day).format('dddd')
      var fecha = moment(day).format('DD')
      var month = moment(day).format('MM')

      await this.db.firestore.collection('zoom').where("IdDocente", '==', this.IdDocente)
        .get().then(fichas => {


          if (d != 'domingo') {


            semana[d] = {
              Fecha: fecha
            }

            if (fichas.docs.length > 0) {



              fichas.docs.map(zoom => {
                var data = zoom.data() as any
  
                var fechaZoom = moment(data.HoraInicio.toDate()).format('DD-MM-YYYY')
  
                var fechaDay = moment(day).format('DD-MM-YYYY')
  
  
                if (fechaZoom == fechaDay) {

                  semana[d].Total = Math.round(parseFloat(data.Duracion.toString()) / 60)

                  this.totalMes += Math.round(parseFloat(data.Duracion.toString()) / 60)
  
                }
  
              })
            }



          } else if (d == 'domingo') {
            this.semanas.push(semana)
            semana = {}

          }
          count++



          if (dates.length == count && d != 'domingo') {
            this.semanas.push(semana)
            semana = {}
          }


  
        })








    })



  }


}
