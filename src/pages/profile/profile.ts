import { Component } from '@angular/core';
import { NavController, Events , ToastController} from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { NotificationsHelper } from '../../helpers/notifications.helper';

import { SessionHelper } from '../../helpers/session.helper';
import { EditPage } from './edit/edit';
import { Dashboard } from '../dashboard/dashboard';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

import { config } from '../../app.config';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers : [
                Camera,
                Transfer
              ]
})

export class ProfilePage {

	public current_user : any;
	public is_updated : boolean = false;
	public profile : Array<{
						    value: string,
  						  column: string,
  						  placeholder: string,
  						  disabled: boolean,
  						  type: string}>;


	constructor(
				public navCtrl: NavController,
				private camera: Camera,
				private transfer: Transfer,
				public actionSheetCtrl: ActionSheetController,
				public Notifications: NotificationsHelper,
				public auth: AuthServiceProvider,
        public events: Events,
				public session: SessionHelper,
        public toastController: ToastController) {
	this.current_user = this.session.getUser();

	this.profile =  [
                    { value:this.current_user.username ,
                      column : 'name',
                      placeholder : 'Username',
                      disabled : true,
                      type : 'username' 
                    },
                    { value:this.current_user.email ,
                      column : 'email',
                      placeholder : 'Email',
                      disabled : true,
                      type : 'email' 
                    },
                    { value: '******',
                      column : 'password',
                      placeholder : 'Password',
                      disabled : true,
                      type : 'password' 
                    },
                    { value: '****',
                      column : 'pin',
                      placeholder : 'PIN',
                      disabled : true,
                      type : 'pin' 
                    },
                    { value : this.current_user.address,
                      column : 'address',
                      placeholder : 'Address',
                      disabled : true,
                      type : 'address' 
                    }
                  ];

  }

  fileTransfer: TransferObject = this.transfer.create();

  edit(t,c = '', i){
 	
 	if ( t == 'password' ){
 		this.navCtrl.push(EditPage,{ type: t , column : c});
 	} else if( t == 'pin' ){
 		this.navCtrl.push(EditPage,{ type: t , column : c});
 	}  else if( t == 'email' ){
 		
 	} else {
 		this.profile[i].disabled = false;
 		this.is_updated = true;

 	}

  }

  tedit(){
  	var i = 0;
  	this.is_updated = true;
	  this.profile.forEach(st=> {
  		if ( i !== 1 &&
           i !== 2 &&
           i !== 3 ) {
        		this.profile[i].disabled = false;
  		}
      i++;
    });

    console.log("clicked !");

    this.presentToast("Edit Profile Enabled !");
  }

  update(){
  	this.Notifications.presentLoader();
  	
  	this.auth.update( this.profile )
  	.then(data => {
  		this.Notifications.dismissLoader();
  		if(data.status){
  			
  			var i = 0;
  			this.profile.forEach(st=> {
              this.profile[i].disabled = true;
              i++;
            });
        console.log("Profile :"+JSON.stringify(this.profile));
        
	  		this.current_user.username = this.profile[0].value;
	  		this.current_user.address = this.profile[4].value;
	  		// this.current_user.contact_no = this.profile[5].value;
	  		this.session.setUser(this.current_user);
        this.events.publish('user:refresh', this.current_user);
	  		this.is_updated = false;
  		}
  	});
  }

  presentActionSheet() {
      let actionSheet = this.actionSheetCtrl.create({
          title: 'Choose one option',
          buttons: [
          {
              text: 'Camera',
              role: 'destructive',
              handler: () => {
                this.captureImage(this.options(this.camera.PictureSourceType.CAMERA));
            }
          },{
              text: 'Gallery',
              handler: () => {
                this.captureImage(this.options(this.camera.PictureSourceType.PHOTOLIBRARY));
              }
          },{
          text: 'Cancel',
          role: 'cancel'
      }]
    });
    actionSheet.present();
  }

  captureImage(camera_options){
      this.camera.getPicture(camera_options).then((imageData) => {
      // this.image_data = imageData;
      this.upload(imageData);
    }, (err) => {
      alert(err);
    });

  }

  options(source_type){
    let camera_options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: source_type,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit:true,
        correctOrientation:true,
        targetWidth: 300,
        targetHeight: 300
    }
    return camera_options;
  }

  upload(imageData) {
    let options: FileUploadOptions = {
                fileKey: 'file',
                fileName: 'file.jpg',
                mimeType: "multipart/form-data",
                params : { 'fileName': 'file.jpg',
                           'org_user_id' : this.current_user.user_id ,
                           'org_id' : this.current_user.user_org_id 
                         }
              }
    this.Notifications.presentLoader();

    this.fileTransfer.upload(imageData, config.api_url + 'auth/uploads', options)
    .then((data) => {
   		this.Notifications.dismissLoader();
   		this.current_user.private_image_path = config.api_url + 
                                            'documents/download?fileName=' + 
                                            this.current_user.image_name + 
                                            '&token='+this.session.getToken() + 
                                            '&type=profile_pic&timestamp=' + 
                                            new Date().getTime();
      this.events.publish('user:refresh', this.current_user);
   		this.session.setUser(this.current_user);

      this.Notifications.presentToast("Profile picture updated successfully");
    }, (err) => {
 		  this.Notifications.dismissLoader();
      this.Notifications.presentToast("Unable to update profile picture");
    })
  }

  presentToast(msg) {
    const toast = this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: 'success',
      position: 'top'
    });
    toast.present();
  }

  back(){
    this.navCtrl.setRoot(Dashboard);
  }

}
