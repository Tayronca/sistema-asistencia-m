import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import {User} from '../../../shared/services/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  user:User={
    rol:'',
    nombres:'',
    apellidos:'',
    cedula:'',
    uid:'',
    correo:'',
    photoURL:'',
    emailVerified:false,
    titulo:''
  };
  valid:boolean= false;
  uid:string='';

  constructor(
    private route:ActivatedRoute,
    private db:AngularFirestore,
    private router:Router
    
  ) {
   }

  ngOnInit(): void {

      this.route.paramMap.forEach(params=>{

          var uid  = String(params.get('uid'));

          this.uid = uid;

          this.getUser(uid)
        
    })
  }

   async getUser(uid:string){

  await this.db.firestore.collection('users').doc(uid).get().then(e=>{

    this.user = e.data() as User



   })

  }

  async updateUser(){

    await this.db.firestore.collection('users').doc(this.uid).update(this.user).then(e=>{

          this.router.navigate(['admin/users'])
  
     })
  }

}
