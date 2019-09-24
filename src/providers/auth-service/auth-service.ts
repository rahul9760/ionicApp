import { Injectable } from '@angular/core';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeoutWith';
import { config } from '../../app.config';

import { SessionHelper } from '../../helpers/session.helper';

@Injectable()

export class AuthServiceProvider {
	public data: any;

	constructor(public http: Http, public session: SessionHelper ) {
		
	}

	getHeaders(): RequestOptions{
		let headers = new Headers({'Content-Type': 'application/json'});
		return new RequestOptions({ headers: headers }); // Create a request option
	}


	getTHeaders(): RequestOptions{
		let headers = new Headers({'Content-Type': 'application/json'});  
		headers.append('Authorization', this.session.getToken() );
	    return new RequestOptions({ headers: headers }); // Create a request option
	}

	getLastUserHeaders(): RequestOptions{
		let headers = new Headers({'Content-Type': 'application/json'});  
		var user =  this.session.getLastUser()
		headers.append('Authorization', user.token );
	    return new RequestOptions({ headers: headers }); // Create a request option
	}

	login(credentials) {
		var headers = new Headers();
	    headers.append('Content-Type', 'application/json' );
	    let options = new RequestOptions({ headers: headers });

	    let postParams = {
	      username: credentials.username,
	      password: credentials.password,
	      fcm_token: this.session.getFcmToken()
	    }

	    return new Promise<any>(resolve => {
	   	 this.http.post(config.api_url + 'auth/login', postParams, options)
	   	 .timeoutWith(5000,  Observable.throw(new Error('Boom!')) )
	     .subscribe(data => {
	        this.data = JSON.parse(data['_body']);
        	resolve(this.data);
	       },
			err =>{
			resolve({ error: true })
		 });
	    });
	}

	register(r) {
	    return new Promise<any>(resolve => {
	   	 this.http.post(config.api_url + 'auth/register', r , this.getHeaders())
	      .subscribe(data => {
	        this.data = JSON.parse(data['_body']);
        	resolve(this.data);
	       },
			err =>{
				resolve({ error: true });
		 	});
	    });
	}

	update(r) {
	    return new Promise<any>(resolve => {
	   	 this.http.post(config.api_url + 'auth/update_profile', r , this.getTHeaders())
	      .subscribe(data => {
	        this.data = JSON.parse(data['_body']);
        	resolve(this.data);
	       });
	    });
	}

	update_password(r) {
	    return new Promise<any>(resolve => {
	   	 this.http.post(config.api_url + 'auth/update_pass', r , this.getTHeaders())
	      .subscribe(data => {
	        this.data = JSON.parse(data['_body']);
        	resolve(this.data);
	       });
	    });
	}

	setPin(p1) {
		var p = { pin : p1 } 
	    return new Promise<any>(resolve => {
	   	 this.http.post(config.api_url + 'auth/set_pin', p , this.getTHeaders())
	      .subscribe(data => {
	        this.data = JSON.parse(data['_body']);
        	resolve(this.data);
	       });
	    });
	}

	getOrgs() {
	    return new Promise<any>(resolve => {
	   	 this.http.get(config.api_url + 'documents/get_orgs' , this.getTHeaders())
	      .subscribe(data => {
	        this.data = JSON.parse(data['_body']);
        	resolve(this.data);
	       });
	    });
	}

	getUserByOrg(id) {
	    return new Promise<any>(resolve => {
	   	 this.http.get(config.api_url + 'documents/get_org_users?org_id='+id , this.getTHeaders())
	      .subscribe(data => {
	        this.data = JSON.parse(data['_body']);
        	resolve(this.data);
	       });
	    });
	}


	loginViaPin(p1) {

	    var user = this.session.getLastUser();
	    var postParams = { pin : p1,
	    				   user_id : user !== null ? user.user_id : '', 
	    				   org_id : user !== null ? user.user_org_id  : '' 
	    				} 

	    return new Promise<any>(resolve => {
	   	 this.http.post(config.api_url + 'auth/login', postParams, this.getHeaders())
	   	  .timeoutWith(5000,  Observable.throw(new Error('Boom!')) )
	      .subscribe(data => {
	        this.data = JSON.parse(data['_body']);
        	resolve(this.data);
	       },
			err =>{
				resolve({ error: true })
		 	});
	    });
	}


	loginViaFingerprint() {

	    var user = this.session.getLastUser();
	    var postParams = {
	    				   user_id : user.user_id, 
	    				   org_id : user.user_org_id
	    				} 

	    return new Promise<any>(resolve => {
	   	 this.http.post(config.api_url + 'auth/fingerprint', postParams, this.getLastUserHeaders())
	   	  .timeoutWith(5000,  Observable.throw(new Error('Boom!')) )
	      .subscribe(data => {
	        this.data = JSON.parse(data['_body']);
        	resolve(this.data);
	       },
			err =>{
				resolve({ error: true })
		 	});
	    });
	}

	saveNotificationToken(token) {
		var user = this.session.getLastUser();

	    return new Promise<any>(resolve => {
	   	 this.http.post(config.api_url + 'documents/save_push_token', { token : token , user_id : user.id } , this.getHeaders())
	      .subscribe(data => {
	        this.data = JSON.parse(data['_body']);
        	resolve(this.data);
	       });
	    });
	}

}
