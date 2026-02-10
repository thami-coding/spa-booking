import type { UseFormRegister } from "react-hook-form"


export type Inputs = {
 fullName: string
 email: string
 phone: string
 service: string
 date: string
 time: string
 guests: number
 requests: string
}

export type FormFieldsData = {
 defaultValue: string,
 register: UseFormRegister<Inputs>;
 labelText: string,
 value: | "fullName"
 | "email"
 | "phone"
 | "service"
 | "date"
 | "time"
 | "guests"
 | "requests";
}

export type Fields = | "fullName"
 | "email"
 | "phone"
 | "service"
 | "date"
 | "time"
 | "guests"
 | "requests";