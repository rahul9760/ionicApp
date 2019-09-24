import { Component  } from '@angular/core';
import { ViewController, App } from 'ionic-angular';
import {Login2Page} from "../login2/login2";


@Component({
  template: `
    <ion-list>
      <button ion-item (click)="change()">Change user</button>
    </ion-list>
  `
})

export class PopoverPage {
  constructor(public viewCtrl: ViewController, public app: App) {}
  
  change(){
    this.viewCtrl.dismiss();
    this.app.getRootNav().push(Login2Page);
  }
}