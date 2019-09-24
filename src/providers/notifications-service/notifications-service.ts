import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeoutWith';

import { config } from '../../app.config';

import { SessionHelper } from '../../helpers/session.helper';


@Injectable()
export class NotificationServiceProvider {

	public data: any;

	constructor(public http: Http, public session: SessionHelper) {

	}

	getHeaders(): RequestOptions{
		let headers = new Headers({'Content-Type': 'application/json'});  
			headers.append('Authorization', this.session.getToken() );
	    return new RequestOptions({ headers: headers }); // Create a request option
	}

	getNotifications(page = 1,search) {

		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'notifications?page='+page+'&per_page='+config.per_page+'&search='+search, this.getHeaders())
			  .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			  .map(res => res.json())
			  .subscribe(
			  	data => {
				  	this.data = data; 
				    resolve(this.data);
				},
				err =>{
					resolve({ error: true })
			  	}
			  );
		});
	}

	getItems(page = 1,search) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'notifications/items?page='+page+'&per_page='+config.per_page+'&search='+search, this.getHeaders())
			  .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			  .map(res => res.json())
			  .subscribe(
			  	data => {
				  	this.data = data; 
				    resolve(this.data);
				},
				err =>{
					resolve({ error: true })
			  	}
			  );
		});
	}

	getRecentNotifications() {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'notifications/recent?&token=' + this.session.getToken())
			  .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			  .map(res => res.json())
			  .subscribe(
			  	data => {
				
				  	this.data = data; 
				    resolve(this.data);
				},
				err =>{
					resolve({ error: true })
			  	}
			  );
		});

		
	}

	getNotificationsCount() {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'notifications/counts', this.getHeaders())
			  .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			  .map(res => res.json())
			  .subscribe(
			  	data => {
				  	this.data = data; 
				    resolve(this.data);
				},
				err =>{
					resolve({ error: true })
			  	}
			  );
		});
	}

	openNotification(id) {
	 
	 return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'notifications/' + id , this.getHeaders())
	      .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
	      .map(res => res.json())
	      .subscribe(data => {
	        this.data = data;
	        resolve(this.data);
	      	},
			err =>{
				resolve({ error: true })
		  	}
		  );
	  });
	  
	}

	markAsValueNotification(ids, value){
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'notifications/mark_as_value?ids=' + ids + '&value=' + value  , this.getHeaders())
	      .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
	      .map(res => res.json())
	      .subscribe(data => {
	        this.data = data;
	        resolve(this.data);
	      	},
			err =>{
				resolve({ error: true })
		  	}
		  );
	  });
	}

	deleteNotifications(ids){
	    return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'notifications/delete' , { notification_ids : ids } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveNotificationsDays(days){
	    return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'notifications/save_notifications_days' , { days : days } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	getNotificationsDays(){
	    return new Promise<any>(resolve => {
		this.http.get(config.api_url + 'notifications/get_notifications_days' , this.getHeaders())
		  .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
		  .map(res => res.json())
		  .subscribe(data => {
		    this.data = data;
		    resolve(this.data);
		  	},
			err =>{
				resolve({ error: true })
		  	}
		  );
		});
	}

	

}
