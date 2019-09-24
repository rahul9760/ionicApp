import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController } from 'ionic-angular';
import { EquipmentServiceProvider } from '../../../providers/equipment-service/equipment-service';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { FunctionsHelper } from '../../../helpers/functions.helper';
import { EquipmentsModels } from '../models/models';
import { Equipments } from '../list/list';

@Component({
    selector: 'page-menu',
    templateUrl: 'menu.html',
    providers: [EquipmentServiceProvider, FunctionsHelper]
})

export class EquipmentsMenu {
  
    search: String = '';
    is_searched: Boolean = false;
    levels:any = [];
    backup:any = [];

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public Notifications: NotificationsHelper, public fns: FunctionsHelper, public EquipmentService: EquipmentServiceProvider, public actionSheetCtrl: ActionSheetController) {
        this.getSearchLevels();     
        console.log("menu level called");
    }

    getSearchLevels(){
        this.Notifications.presentLoader();
        this.EquipmentService.searchLevels(this.search.toLowerCase()).then(data => {
            this.Notifications.dismissLoader();
            this.levels = data.levels;
            this.backup = data.levels;
        });
    }
    

    getItems(ev: any) {

        let val = ev.target.value;
        if (val && val.trim() != '') {
            this.levels = this.backup.filter((level) => {
                var condition = this.fns.match(level.name, val) || this.fns.match(level.level1, val);
                return condition;
            });
        } else {
            this.levels = this.backup;
        }
    }

    next(t){
        this.navCtrl.push(EquipmentsModels,{ levels_data_id : t.id, parent_id : t.parent_id });
    }

    create(){
        this.navCtrl.push(Equipments);
    }

}
