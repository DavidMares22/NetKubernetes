import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client app';
  showSpinner = false;


  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.firestore.collection('test').stateChanges().subscribe(personas => {
      console.log(personas.map(persona => persona.payload.doc.data()));
    });
  }

  onToggleSpinner() : void {
    this.showSpinner = !this.showSpinner;
  }

  onFilesChanged(urls: string | string[]) {
    console.log('urls', urls);
  }

}
