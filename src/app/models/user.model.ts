export interface User {
    _id: string
    name: string
    password: string
    email: string
    phone: string
    coins: any
    moves: Array<any>
    contacts: Array<any>
}

export interface UserFilter {
    term: string
}