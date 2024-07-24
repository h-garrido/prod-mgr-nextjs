import { Timestamp } from "firebase/firestore";

export interface User{
    uid: string;
    image?: string;
    name: string;
    lastname: string;
    email: string;
    password?: string;
    createdAt?: Timestamp;
}