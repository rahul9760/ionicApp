import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Injectable()

export class NotificationsHelper{

	loading: any;
	toaster: any;

	constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {}

	presentToast( message, duration = 3000 , myClass = 'my-toaster'  ) {
	    let toast = this.toastCtrl.create({
	      message: message,
	      duration: 3000,
	      cssClass: myClass
	    });
	    toast.present();
	}

	uploadingToast( message ) {
	    this.toaster = this.toastCtrl.create({
	      message: message
	    });
	    this.toaster.present();
	}

	dismissToaster(){
		this.toaster.dismiss();
	}

	setToasterContent(u,f,t,p = 0){

		var done = u + "(" + p + "%)" + "/" + t + (u > 1 ? " Files" : " File") + " Uploaded Successfully" ;

		var failed =  f > 0 ? " " + f + (f > 1 ? " Files Failed." : " File Failed.") : "";

		var nd = u > 0 && f > 0 ? " & " : ""; 

		this.toaster.data.message = done + nd + failed;
	}

	setToastFile(m) {
		this.toaster.data.message = m;
	}

	presentLoader( message = "Please wait..." ){

		this.loading = this.loadingCtrl.create({
		    content: message
		});

		this.loading.present();

	}

	customLoader( message = "Please wait..." ){

		this.loading = this.loadingCtrl.create({
			spinner: 'hide',
		    content: "<div>0%</div>"
		});

		this.loading.present();

	}

	
	setLoader(s){
		this.loading.data.content = "<div>"+s+"</div>";
	}

	showAlert(title, message) {
	    let alert = this.alertCtrl.create({
	      title: title,
	      subTitle: message,
	      buttons: ['OK']
	    });
	    alert.present();
	}

   removeCondition(index,conditions){
	    if (index > -1) {
	      const alert = this.alertCtrl.create({
	          title: 'Remove condition',
	          message: 'Do you want to remove this condition?',
	          buttons: [
	            {
	              text: 'Cancel',
	              role: 'cancel',
	              handler: () => {
	                console.log('Cancel clicked');
	              }
	            },
	            {
	              text: 'Ok',
	              handler: () => {
	               return conditions.splice(index, 1);
	              }
	            }
	          ]
	        });
	        alert.present();
	    }
	 }

	dismissLoader(){

		this.loading.dismiss();

	}

}