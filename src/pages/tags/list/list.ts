import { Component } from '@angular/core';
import { NavController, AlertController, ActionSheetController } from 'ionic-angular';
import { DocumentServiceProvider } from '../../../providers/document-service/document-service';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
// import { SessionHelper } from '../../../helpers/session.helper';


@Component({
  selector: 'page-tags',
  templateUrl: 'list.html',
  providers: [DocumentServiceProvider]
})
export class Tags {
  public tags: any;
  public data: any;
  public task: any;
  constructor(public navCtrl: NavController,public DocumentService: DocumentServiceProvider, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public Notifications: NotificationsHelper) {

  }

  ngOnInit(){
  	this.getTags();
  }

  getTags(){
    this.Notifications.presentLoader();
    this.DocumentService.getTags()
    .then(data => {
      this.Notifications.dismissLoader();
      this.data = data.tags;
      this.tags = data.tags;
    });
  }

  initializeItems(){
    this.tags = this.data;
  }

  delete(id){
    this.Notifications.dismissLoader();
    let res = { id : id }
    this.DocumentService.deleteTag(res)
    .then(data => {
      this.getTags();
    });
  }

  getItems(ev: any) {
    this.initializeItems();

    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.tags = this.tags.filter((item) => {
        return (item.tag_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  view(tag){
    console.log(tag);

    let alert = this.alertCtrl.create({
      title: 'Edit New Tag',
      message: 'Enter a tag name',
      inputs: [
        {
          name: 'tag',
          placeholder: 'Tag',
          value: tag.tag_name
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: (res) => {
            let params = {  tag_name :  res.tag , tag_id : tag.id }
            this.DocumentService.editTag(params)
            .then(data => {
              this.getTags();
            });
          }
        }
      ]
    });

    alert.present();
  }

  create(){
     let alert = this.alertCtrl.create({
      title: 'Add New Tag',
      message: 'Enter a tag name',
      inputs: [
        {
          name: 'tag',
          placeholder: 'Tag'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: (res) => {
            this.DocumentService.createTag(res)
            .then(data => {
              this.getTags();
            });
          }
        }
      ]
    });

    alert.present();
  }

  presentActionSheet(t) {
      let options = [];


      options = options.concat([{
                      text: 'Edit',
                      handler: () => {
                        this.view(t);
                      }
                  }, {
                     text: 'Delete',
                     role: 'destructive',
                     handler: () => {
                        this.delete(t.id);
                     }
                  },{
                  text: 'Cancel',
                  role: 'cancel'
              }]);

      let actionSheet = this.actionSheetCtrl.create({
          title: 'Choose one option',
          buttons: options
    });
    actionSheet.present();
  }

}
