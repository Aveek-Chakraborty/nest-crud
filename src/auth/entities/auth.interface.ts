export interface User{
    id?: number,
    email?: string,
    hash?: string,
    firstName?: string | null,
    lastName?: string | null,
    createdAt?: Date,
    updatedAt?: Date
}