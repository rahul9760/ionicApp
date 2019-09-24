import { Component  } from '@angular/core';
import { ViewController, App } from 'ionic-angular';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { FunctionsHelper } from '../../../helpers/functions.helper';
import { InfrastructureServiceProvider } from '../../../providers/infrastructure-service/infrastructure-service'
import { NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { InfrastructureLocationModal } from './infrastructurelocationmodal';
import { LocationListModal } from './locationlistmodal';
import { AlertController } from 'ionic-angular';

@Component({
    selector:"create-infra-structure-modal",
    templateUrl: 'infrastructure.html',
    providers: [InfrastructureServiceProvider, NotificationsHelper, FunctionsHelper]
})

export class CreateInfrastructureModal {
      
    levels = {};
    location = {};
    level: any = { one: '' , two: '', three: '' }; 
    article:any = { attributes : {} };
    barcodes:any;
    missingLocationData = {}
    showForm:boolean = false;
    formAttributes:any;
    location_id:any
    item_header_class: String = 'item item-ios list-header list-header-ios';
    public input_class = "text-input text-input-ios";
    public noDataFound:boolean = false;
    public levelsArray:Array<string> = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
    public parentLocation = {};
    public modalCancel:boolean;

    
    constructor( public modalCtrl: ModalController, public viewCtrl: ViewController, public Notifications: NotificationsHelper,public navCtrl: NavController, public InfrastructureService:InfrastructureServiceProvider, public app: App, public params: NavParams, public functionsHelper :FunctionsHelper, public alertCtrl: AlertController) {
        this.getInfrastructureList();
    } 

    getInfrastructureList(){

        this.InfrastructureService.getInfrastructureList(1,'').then(data => {

            this.levels['one'] = data.locations;
            this.location['one'] = data.location;
            this.level['one'] = data;
        });
    }

    refreshList(index){

        if(this.article.parent_id == 0 ){
            this.getInfrastructureList();
            return false;
        }
        console.log("refresh called")
        let location_id = parseInt(this.article.location_id) - 1;
        let where = 'parent_id=' + this.article.parent_id + '&location_id=' + location_id;
        this.InfrastructureService.getInfrastructureList(1,'',where).then(data => {

            this.levels[index] = data.locations;
            this.location[index] = data.location;
            this.level[index] = data;
        });
    }
    
    
    changeLevel(id, stage, nextStage){
        this.Notifications.presentLoader();
        let where = 'parent_id=' + id + '&location_id=' + this.location[stage].id;
        let cloneLevelsArray = this.functionsHelper.clone(this.levels);
        
        for(let i = Object.keys(cloneLevelsArray).indexOf(stage) + 1; i<Object.keys(cloneLevelsArray).length; i++){
            delete this.levels[this.levelsArray[i]];
        }

        this.InfrastructureService.getInfrastructureList(1 , '', where).then(data => {
            this.Notifications.dismissLoader();
            if(typeof data.locations !== "undefined"){
                if(data.locations.length == 0){
                	this.noDataFound = true;
                    this.missingLocationData["id"] = id;
                    this.missingLocationData["stage"] = stage;
                    this.missingLocationData["nextStage"] = nextStage;
                	this.article.location_id = data.location.id;
            		this.article.parent_id = data.parent_location.id;
                } else {
                    this.noDataFound = false;
                    this.location[this.levelsArray[this.levelsArray.indexOf(stage)+1]] = data.location;
                    this.levels[this.levelsArray[this.levelsArray.indexOf(stage)+1]] = data.locations;
                    this.level[this.levelsArray[this.levelsArray.indexOf(stage)+1]] = data;
                    this.article.location_id = data.location.id;
                    this.article.parent_id = data.parent_location.id;
                }
            } else {
                this.noDataFound = true;
            }
        });
    }

    showLevelForm(id,stage,nextStage){
        this.showForm = true;
        let where = 'parent_id=' + id + '&location_id=' + this.location[stage].id;
        
        this.article.location_id = this.location[stage].id;
        this.article.parent_id = id;

        this.InfrastructureService.getInfrastructureFields(this.location[stage].id, this.article.parent_id).then(data => {
            this.formAttributes = data.attributes;
            this.barcodes = data.barcodes;
        });
   }

    dismiss(){
        this.viewCtrl.dismiss();
    }

    create(){
		this.dismiss();
    }

    showModal(){
        let modal = this.modalCtrl.create(InfrastructureLocationModal, {
            location_id: this.article.location_id,
            parent_id: this.article.parent_id
        });

        modal.onDidDismiss(data=>{
            
            if(typeof data!=="undefined"){
                this.changeLevel(this.missingLocationData["id"],this.missingLocationData["stage"], this.missingLocationData["nextStage"]);
            }        
        });
        modal.present();
    }

    showListLocation(locationIndex, locationId, parentId){
        let modal = this.modalCtrl.create(LocationListModal, {
            levels:this.levels[locationIndex],
            level:this.level[locationIndex],
            index:locationIndex,            
            locationId:this.article.location_id,
            parentId:this.article.parent_id
        });
        modal.onDidDismiss(data => {
             
            if(typeof data !== "undefined"){
                
                this.parentLocation[this.levelsArray[this.levelsArray.indexOf(locationIndex)]] = data.name;
                if(locationIndex == "ten"){
                    this.showLevelForm(data.id, locationIndex, locationId);
                } else {
                    this.changeLevel(data.id, locationIndex, locationId);
                }

            } else {
                this.article.parent_id = (typeof this.article.parent_id!== "undefined") ? this.article.parent_id : 0;
                this.refreshList(locationIndex);
            }
        });
        modal.present();
    }

}