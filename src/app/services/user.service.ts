import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, throwError, of } from 'rxjs';
import { catchError, retry, tap, map, take, } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { storageService } from './async-storage.service';
import { User, UserFilter } from '../models/user.model';
import { Contact } from '../models/contact.model';

const ENTITY = 'users'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) {

        const users = JSON.parse(localStorage.getItem(ENTITY) || 'null');
        if (!users || users.length === 0) {
            localStorage.setItem(ENTITY, JSON.stringify(this._createUsers()))
        }
    }

    private _users$ = new BehaviorSubject<User[]>([])
    public users$ = this._users$.asObservable()

    private _user$ = new BehaviorSubject<User | null>(null);
    public user$ = this._user$.asObservable()

    private _userFilter$ = new BehaviorSubject<UserFilter>({ term: '' })
    public userFilter$ = this._userFilter$.asObservable()

    public query() {
        return from(storageService.query(ENTITY))
            .pipe(
                tap(users => {
                    const filterBy = this._userFilter$.value
                    users = users.filter(user => user.name.toLowerCase().includes(filterBy.term.toLowerCase()))
                    this._users$.next(users)
                }),
                retry(1),
                catchError(this._handleError)
            )
    }

    public getLoggedinUser() {
        const loggedinUser = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
        if (loggedinUser) this._user$.next(loggedinUser)
        else this._user$.next(null)
        return this.user$
    }

    public logout() {
        return sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    }

    public login(userToCheck: any) {
        const users = this._users$.value
        const user = users.find(u => u.name === userToCheck.name)
        if (user?.password === userToCheck.password) return this._saveLocalUser(user)
        return
    }

    public signUp(user: User) {
        console.log(user)
        const users = this._users$.value
        if (!users.find(u => u.name === user.name)) {
            user._id = this._makeId()
            users.unshift(user)
            localStorage.setItem(ENTITY, JSON.stringify(users))
            this._users$.next(users)
            return this._saveLocalUser(user)
        }
        return
    }

    public removeContact(contactId: string) {
        return from(storageService.query(ENTITY))
            .pipe(
                tap(users => {
                    const loggedinUser = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
                    const user = users.find(u => u._id === loggedinUser._id)
                    const idx = user?.contacts.findIndex(c => c._id === contactId)
                    if (idx) user?.contacts.splice(idx, 1)
                    return user?.contacts
                }),
                retry(1),
                catchError(this._handleError)
            )
    }

    public getById(userId: string): Observable<User> {
        return from(storageService.get(ENTITY, userId))
            .pipe(
                retry(1),
                catchError(this._handleError)
            )
    }

    public getEmptyUser() {
        return {
            _id: '',
            name: '',
            password: '',
            email: '',
            phone: '',
            coins: 100,
            moves: [],
            contacts: []
        }
    }

    public getEmptyContact() {
        return {
            name: '',
            _id: '',
            phone: ''
        }
    }

    public save(user: any) {
        if (user._id) {
            const updatedUser = this._updateUser(user)
            return this._saveLocalUser(updatedUser)
        }
        return this._addContact(user)
    }

    public setFilter(UserFilter: UserFilter) {
        this._userFilter$.next({ ...UserFilter })
        this.query().subscribe()
    }

    public addMove(contact: User, amount: string) {
        const user: User = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
        if (user) {
            let move = this._getEmptyMove()
            move.toId = contact._id
            move.to = contact.name
            move.at = Date.now()
            move.amount = amount
            user.coins = Number(user.coins) - Number(amount)
            user.moves.unshift(move)
            this._updateUser(user)
            this._saveLocalUser(user)
            contact.coins = Number(contact.coins) + amount;
            this._updateUser(contact)
            return user
        }
        return null
    }

    private _getEmptyMove() {
        return {
            toId: '',
            to: '',
            at: 0,
            amount: ''
        }
    }

    private _updateUser(user: User) {
        const users = this._users$.value
        const idx = users.findIndex(u => u._id === user._id)
        users[idx] = user;
        localStorage.setItem(ENTITY, JSON.stringify(users));
        this._users$.next(users)
        return user
    }

    private _saveLocalUser(user: any) {
        const userToSave = {
            _id: user._id,
            name: user.name,
            coins: user.coins,
            moves: user.moves,
            contacts: user.contacts,
            password: user.password,
            email: user.email,
            phone: user.phone
        }
        sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
        this._user$.next(userToSave)
        return userToSave
    }

    private _addContact(contact: Contact) {
        const loggedinUser = this._user$.value
        const users = this._users$.value
        const userToAdd = users.find(c => c.phone === contact.phone)
        if (loggedinUser && userToAdd) {
            const contactToAdd = {
                "_id": `${userToAdd._id}`,
                "name": `${userToAdd.name}`,
                "phone": `${userToAdd.phone}`,
            }
            loggedinUser.contacts.unshift(contactToAdd)
            this._updateUser(loggedinUser)
        }
    }

    private _createUsers() {
        const users: User[] = [
            {
                "_id": "5a56sfhfsg1515443a5sdf72ca",
                "name": "Adam Bercovich",
                "password": "123456",
                "email": "adambercovich@renovize.com",
                "phone": "+1 (948) 464-4388",
                "coins": "1000000",
                "moves": [
                    { "toId": '5a56640272c7dcdf59c3d411', "to": 'Denis Lit', "at": "1682341788814", "amount": '305' },
                    { "toId": '5a5664025f6ae9aa24a99fde', "to": 'Asaf Margalit', "at": "1682341781533", "amount": '50' },
                    { "toId": '5a5664025f6ae9aa24a99fde', "to": 'Asaf Margalit', "at": "1682341780030", "amount": '50' }
                ],
                "contacts": [
                    {
                        "_id": "5a56640269f443a5d64b32ca",
                        "name": "Yaron Biton",
                        "phone": "+1 (968) 593-3824",
                    },
                    {
                        "_id": "5a5664025f6ae9aa24a99fde",
                        "name": "Asaf Margalit",
                        "phone": "+1 (948) 464-2888",
                    },
                    {
                        "_id": "5a56640252d6acddd183d319",
                        "name": "Dima Polonchuk",
                        "phone": "+1 (958) 502-3495",
                    },
                    {
                        "_id": "5a566402ed1cf349f0b47b4d",
                        "name": "Tal Amit",
                        "phone": "+1 (911) 475-2312",
                    },
                    {
                        "_id": "5a566402abce24c6bfe4699d",
                        "name": "Guy Kadosh",
                        "phone": "+1 (807) 551-3258",
                    },
                    {
                        "_id": "5a566402a6499c1d4da9220a",
                        "name": "Yuval Shmukler",
                        "phone": "+1 (970) 527-3082",
                    },
                    {
                        "_id": "5a566402f90ae30e97f990db",
                        "name": "Chen Mordehai",
                        "phone": "+1 (952) 501-2678",
                    },
                    {
                        "_id": "5a5664027bae84ef280ffbdf",
                        "name": "Dvir Cohen",
                        "phone": "+1 (989) 503-2663",
                    },
                    {
                        "_id": "5a566402e3b846c5f6aec652",
                        "name": "Eran Peled",
                        "phone": "+1 (968) 454-3851",
                    },
                    {
                        "_id": "5a56640272c7dcdf59c3d411",
                        "name": "Denis Lit",
                        "phone": "+1 (986) 545-2166",
                    },
                    {
                        "_id": "5a5664029a8dd82a6178b15f",
                        "name": "Tal Liber",
                        "phone": "+1 (929) 571-2295",
                    },
                    {
                        "_id": "5a5664028c096d08eeb13a8a",
                        "name": "Shachar Ron Zohar",
                        "phone": "+1 (977) 419-3550",
                    },
                    {
                        "_id": "5a5664026c53582bb9ebe9d1",
                        "name": "Stav Yaar Bar",
                        "phone": "+1 (963) 471-3181",
                    }
                ]
            },
            {
                "_id": "5a56640269f443a5d64b32ca",
                "name": "Yaron Biton",
                "email": "yaronbiton@renovize.com",
                "phone": "+1 (968) 593-3824",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a5664025f6ae9aa24a99fde",
                "name": "Asaf Margalit",
                "email": "asafmargalit@renovize.com",
                "phone": "+1 (948) 464-2888",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a56640252d6acddd183d319",
                "name": "Dima Polonchuk",
                "email": "dimapolonchuk@renovize.com",
                "phone": "+1 (958) 502-3495",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a566402ed1cf349f0b47b4d",
                "name": "Tal Amit",
                "email": "talamit@renovize.com",
                "phone": "+1 (911) 475-2312",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a566402abce24c6bfe4699d",
                "name": "Guy Kadosh",
                "email": "guykadosh@renovize.com",
                "phone": "+1 (807) 551-3258",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a566402a6499c1d4da9220a",
                "name": "Yuval Shmukler",
                "email": "yuvalshmukler@renovize.com",
                "phone": "+1 (970) 527-3082",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a566402f90ae30e97f990db",
                "name": "Chen Mordehai",
                "email": "chenmordehai@renovize.com",
                "phone": "+1 (952) 501-2678",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a5664027bae84ef280ffbdf",
                "name": "Dvir Cohen",
                "email": "dvircohen@renovize.com",
                "phone": "+1 (989) 503-2663",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a566402e3b846c5f6aec652",
                "name": "Eran Peled",
                "email": "eranpeled@renovize.com",
                "phone": "+1 (968) 454-3851",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a56640272c7dcdf59c3d411",
                "name": "Denis Lit",
                "email": "denislit@renovize.com",
                "phone": "+1 (986) 545-2166",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a5664029a8dd82a6178b15f",
                "name": "Tal Liber",
                "email": "talliber@renovize.com",
                "phone": "+1 (929) 571-2295",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a5664028c096d08eeb13a8a",
                "name": "Shachar Ron Zohar",
                "email": "shacharronzohar@renovize.com",
                "phone": "+1 (977) 419-3550",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a5664026c53582bb9ebe9d1",
                "name": "Stav Yaar Bar",
                "email": "stavtaarbar@renovize.com",
                "phone": "+1 (963) 471-3181",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a56640298ab77236845b82b",
                "name": "Glenna Santana",
                "email": "glennasantana@renovize.com",
                "phone": "+1 (860) 467-2376",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a56640208fba3e8ecb97305",
                "name": "Malone Clark",
                "email": "maloneclark@renovize.com",
                "phone": "+1 (818) 565-2557",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a566402abb3146207bc4ec5",
                "name": "Floyd Rutledge",
                "email": "floydrutledge@renovize.com",
                "phone": "+1 (807) 597-3629",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a56640298500fead8cb1ee5",
                "name": "Grace James",
                "email": "gracejames@renovize.com",
                "phone": "+1 (959) 525-2529",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a56640243427b8f8445231e",
                "name": "Tanner Gates",
                "email": "tannergates@renovize.com",
                "phone": "+1 (978) 591-2291",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            },
            {
                "_id": "5a5664025c3abdad6f5e098c",
                "name": "Lilly Conner",
                "email": "lillyconner@renovize.com",
                "phone": "+1 (842) 587-3812",
                "coins": "100",
                "moves": [],
                "contacts": [],
                "password": "0000",
            }
        ]
        return users
    }

    private _handleError(err: HttpErrorResponse) {
        console.log('err:', err)
        return throwError(() => err)
    }

    private _makeId(length = 5) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}