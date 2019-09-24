import { Injectable } from '@angular/core';

@Injectable()
export class SessionHelper{
	
 	public current_user: any;
	
	constructor() {
    	this.current_user = { username : '', image_path : '', email : '' };
	}

	setToken( token ){
		window.localStorage.setItem('token', token);
	}

	setFcmToken( token ){
		window.localStorage.setItem('fcm_token', token);
	}

	getFcmToken(){
		return window.localStorage.getItem('fcm_token');	
	}

	getToken(){
		return window.localStorage.getItem('token');	
	}

	setNotificationCount( count ){
		window.localStorage.setItem('notifications', count );	
	}

	getNotificationCount(){
		return window.localStorage.getItem('notifications');	
	}

	setUser(user){
		window.localStorage.setItem('user', JSON.stringify(user));
	}

	setLastUser(user){
		window.localStorage.setItem('last_logged_in_user_pin', JSON.stringify(user));
	}

	getUser(){
		let cu =  JSON.parse( window.localStorage.getItem('user') );
		this.current_user = cu ? cu : this.current_user;
		return this.current_user;
	}

	getUrl(){
		return JSON.parse( window.localStorage.getItem('url') );
	}

	setUrl(url = []){
		window.localStorage.setItem('url', JSON.stringify(url));
	}
	
	getLastUser(){
		return JSON.parse( window.localStorage.getItem('last_logged_in_user_pin') );
	}

	clearSession(){
		window.localStorage.removeItem('token');
		window.localStorage.removeItem('user');
		window.localStorage.removeItem('url');
	}

	isLoggedIn(){
		return null !== this.getToken()
	}

	setTouchID(value){
		window.localStorage.setItem('touch_id', value);
	}

	getTouchID(){
		let touch_id = window.localStorage.getItem('touch_id');
		return touch_id === 'true' ? true : false;
	}

}