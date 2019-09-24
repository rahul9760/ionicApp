import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';

 @Injectable()

  export class CameraHelper {
      
      constructor(
        private camera: Camera,
        public actionSheetCtrl: ActionSheetController) {
      }

     action( callback ) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Choose one option',
            buttons: [
            {
                text: 'Camera',
                role: 'destructive',
                handler: () => {
                  this.captureImage(this.options(this.camera.PictureSourceType.CAMERA), callback);
              }
            },{
                text: 'Gallery',
                handler: () => {
                  this.captureImage(this.options(this.camera.PictureSourceType.PHOTOLIBRARY), callback);
                }
            },{
            text: 'Cancel',
            role: 'cancel'
        }]
      });
      actionSheet.present();
    }

    captureImage(camera_options, callback){
     
      this.camera.getPicture(camera_options).then((imageData) => {
          callback(imageData)
      }, (err) => {
          callback(err)
      });

    }

    options(source_type){
      let camera_options: CameraOptions = {
          quality: 80,
          destinationType: this.camera.DestinationType.FILE_URI,
          sourceType: source_type,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          allowEdit:true,
          correctOrientation:true,
          targetWidth: 500,
          targetHeight: 500
      }
      return camera_options;
    }

  }
  