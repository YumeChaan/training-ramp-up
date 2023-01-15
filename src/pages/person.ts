export interface Person {
    ID: number,
    Name?: string,
    Gender?: string,
    Address? : string,
    MobileNo?: string,
    DateofBirth?: string,
    Age?: number,
    expanded?: boolean,
    inEdit?: boolean | string,
    locked?: boolean
}