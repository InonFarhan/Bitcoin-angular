// import { Injectable } from '@angular/core';
// import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
// import { catchError, retry, tap, map, take } from 'rxjs/operators';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { storageService } from './async-storage.service';
// import { User } from '../models/user.model';

// const ENTITY = 'contacts'

// @Injectable({
//     providedIn: 'root'
// })
// export class ContactsService {
//     constructor(private http: HttpClient) {

//         const contacts = JSON.parse(localStorage.getItem(ENTITY) || 'null');
//         if (!contacts || contacts.length === 0) {
//             localStorage.setItem(ENTITY, JSON.stringify(this._loadContacts()))
//         }
//     }

//     public sort(arr) {
//         return arr.sort((a, b) => {
//             if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
//                 return -1;
//             }
//             if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
//                 return 1;
//             }

//             return 0;
//         })
//     }

//     public getContacts(filterBy = null) {
//         return new Promise((resolve, reject) => {
//             const user = userService.getLoggedinUser()
//             let contacts = userService.getUsers()
//             let contactsToReturn = contacts.filter(c => user.contacts.find(contact => {
//                 return contact.phone === c.phone
//             }))
//             if (filterBy && filterBy.term) {
//                 contactsToReturn = filter(contactsToReturn, filterBy.term)
//             }
//             if (contactsToReturn?.length) resolve(sort(contactsToReturn))
//             else resolve(contactsToReturn)
//         })
//     }

//     public getContactById(id) {
//         return new Promise((resolve, reject) => {
//             const users = userService.getUsers()
//             const contactToSend = users.find(u => u._id === id)
//             contactToSend ? resolve(contactToSend) : reject(`Contact id ${id} not found!`)
//         })
//     }

//     public deleteContact(phone) {
//         return new Promise((resolve, reject) => {
//             const user = userService.getLoggedinUser()
//             const index = user.contacts.findIndex(contact => contact.phone === phone)
//             if (index !== -1) {
//                 user.contacts.splice(index, 1)
//             }
//             userService.updateUser(user)
//             resolve(user.contacts)
//         })
//     // }

//     public _addContact(contact) {
//         return new Promise((resolve, reject) => {
//             const loggedinUser = userService.getLoggedinUser()
//             const users = userService.getUsers()
//             const userToAdd = users.find(u => u.phone === contact.phone)
//             const contactToAdd = {
//                 "_id": `${userToAdd._id}`,
//                 "name": `${userToAdd.name}`,
//                 "phone": `${userToAdd.phone}`,
//             }
//             loggedinUser.contacts.unshift(contactToAdd)
//             userService.updateUser(loggedinUser)
//             resolve(contactToAdd)
//         })
//     }

//     public saveContact(contact) {
//         return contact._id ? userService.updateUser(contact) : _addContact(contact)
//     }

//     public getEmptyContact() {
//         return {
//             name: '',
//             email: '',
//             phone: ''
//         }
//     }

//     public filter(contacts, term) {
//         term = term.toLocaleLowerCase()
//         return contacts.filter(contact => {
//             return contact.name.toLocaleLowerCase().includes(term) ||
//                 contact.phone.toLocaleLowerCase().includes(term) ||
//                 contact.email.toLocaleLowerCase().includes(term)
//         })
//     }
// }