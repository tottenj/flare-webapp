import eventType from "@/lib/enums/eventType";
import { EventArgs } from "./Event";
import AgeGroup from "@/lib/enums/AgeGroup";
import { GeoPoint } from "firebase/firestore";

const eventOne: EventArgs = {
    flare_id: "123",
    title: "Title",
    type: eventType["Special Events"],
    ageGroup: AgeGroup.AllAges,
    startDate: new Date(),
    endDate: new Date(),
    location: {
            id: 'loc005',
            name: 'The Cozy Corner',
            coordinates: new GeoPoint(41.8781, -87.6298),
          },
    price: 20,
    verified: true,
    createdAt: new Date(),
    id: "12345",
    ticketLink: "https://localhost:3000"
}


export {eventOne}




