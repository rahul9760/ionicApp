// AUTHOR : HS
// CREATED : 13-04-2018
// DESCRIPTION : Used to show the model description.

import { Component } from "@angular/core";
import { NavController, NavParams, ActionSheetController } from "ionic-angular";

import { EquipmentServiceProvider } from "../../../../providers/equipment-service/equipment-service";

import { NotificationsHelper } from "../../../../helpers/notifications.helper";

@Component({
    selector: "page-description",
    templateUrl: "description.html",
    providers: [EquipmentServiceProvider]
})
export class EquipmentsModelDescription {
    public model_id;
    public model: any;
    public backup: any;
    public attributes: any;
    private color: String = "#488aff";
    private level_names: String = "";
    private is_edit: Boolean = false;

    constructor(
        public navCtrl: NavController,
        public params: NavParams,
        public Notifications: NotificationsHelper,
        public actionSheetCtrl: ActionSheetController,
        public EquipmentService: EquipmentServiceProvider
    ) {
        this.getModel();
    }

    getModel() {
        this.model_id = this.params.get("id");
        this.Notifications.presentLoader();
            

        this.EquipmentService.getModel(this.model_id).then(data => {
            //console.log("data", data);
            this.Notifications.dismissLoader();
            this.model = data.output.model;
            //console.log(this.model);
            this.level_names = data.output.level_names;
            this.attributes = data.output.attributes;
        });
    }

    view(t) {
        this.navCtrl.push(EquipmentsModelDescription, { id: t.id });
    }

    edit() {
        this.color = "#1ea209";
        this.is_edit = true;
        this.backup = Object.assign({}, this.model);
    }

    cancelEdition() {
        this.resetVaribles();
        this.model = this.backup;
    }

    update() {
        this.Notifications.presentLoader();
        this.EquipmentService.updateModel(this.model).then(data => {
            this.Notifications.dismissLoader();
            this.resetVaribles();
            this.getModel();
        });
    }

    resetVaribles() {
        this.is_edit = false;
        this.color = "#488aff";
    }
}
