import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../../providers/auth-service/auth-service';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { ProfilePage } from '../profile';
import { Dashboard } from '../../dashboard/dashboard';

import { SessionHelper } from '../../../helpers/session.helper';

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html'
})
export class EditPage {
  public current_user : any
  public title : String
  public currentp : String
  public currentpt : String
  public newp : String
  public newpt : String
  public confirmp : String
  public confirmpt : String
  
  constructor(public navCtrl: NavController,
  			  public session: SessionHelper,
  			  public params: NavParams,
  			  public Notifications: NotificationsHelper,
  			  public auth: AuthServiceProvider) {
    this.current_user = this.session.getUser();
    this.title = this.params.data.type;
  }

  update(){
  	if(this.newp == this.confirmp){
      this.Notifications.presentLoader();
      
      this.auth.update_password( { currentp : this.currentp, newp : this.newp, confirmp : this.confirmp, type : this.title } )
      .then(data => {
        this.Notifications.dismissLoader();
        this.Notifications.presentToast(data.message);
        if(data.status){
          this.navCtrl.setRoot(Dashboard);
        }
      });
    } else {
      this.Notifications.presentToast(this.title + " does not match the confirm " + this.title );
    }
  }

  updatePin(e, type) {
    if(this.title == 'pin'){
      if(type == "current"){
        // if(this.currentp.length > 4){
        //   this.currentp = this.currentpt; 
        // } else {
        //  this.currentpt = this.currentp; 
        // }
      } else if(type == "new"){
        if(this.newp.length > 4){
          this.newp = this.newpt; 
        } else {
         this.newpt = this.newp; 
        }
      } else if(type == "confirm"){
        if(this.confirmp.length > 4){
          this.confirmp = this.confirmpt; 
        } else {
         this.confirmpt = this.confirmp; 
        }
      }
    }
  }

  back() {
    this.navCtrl.push(Dashboard);
  }
  
}
