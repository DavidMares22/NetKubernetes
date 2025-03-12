import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'your-app';


  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.firestore.collection('test').stateChanges().subscribe(personas => {
      console.log(personas.map(persona => persona.payload.doc.data()));
    }
    );
  }
}
