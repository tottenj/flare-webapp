export default class Event{
    id: string
    flare_id: string
    title: string
    description: string
    type: any //TO DO
    ageGroup: any //TO DO
    date: any // TO DO
    location: Location
    price: number | string
    ticketLink?: string

    constructor(id: string, flare_id:string, title: string, desciption:string, type:any, ageGroup:any, date:any, location:Location, price: number | string, ticketLink?:string){
        this.id = id
        this.flare_id = flare_id
        this.title = title
        this.description = desciption
        this.type = type
        this.ageGroup = ageGroup
        this.date = date
        this.location = location
        this.price = price
        this.ticketLink = ticketLink
    }
}