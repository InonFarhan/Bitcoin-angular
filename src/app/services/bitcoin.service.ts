import { Injectable } from '@angular/core';
import { BehaviorSubject, of, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Rate } from '../models/rate.model';
import { User } from 'src/app/models/user.model';

const ENTITY = 'rate'

@Injectable({
    providedIn: 'root'
})
export class BitcoinService {
    constructor(private http: HttpClient) {
        const rate = JSON.parse(localStorage.getItem(ENTITY) || 'null')
        if (!rate || !rate.rate || rate.date - Date.now() > 1000 * 60 * 60 * 24) this._loadRate()
    }

    private _rate$ = new BehaviorSubject<Rate | {}>({})
    public rate$ = this._rate$.asObservable()

    public loadUserRate(user: User) {
        const rate = JSON.parse(localStorage.getItem(ENTITY) || 'null')
        this._rate$.next(rate.rate * +user.coins)
    }

    public getMarketPrice() {

    }

    public getConfirmedTransactions() {

    }

    private async _loadRate() {
        const rate = await lastValueFrom(this.http.get(`https://blockchain.info/tobtc?currency=USD&value=1`))
        const rateToSave = {
            rate,
            date: Date.now()
        }
        localStorage.setItem(ENTITY, JSON.stringify(rateToSave))
    }
}