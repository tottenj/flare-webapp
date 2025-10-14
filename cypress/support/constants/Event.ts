import FlareLocation from "./FlareLocation"

export interface createEvent{
    title:string
    description:string
    location:FlareLocation
}


export const createEvent: createEvent = {
  title: 'Event Title',
  description: 'This is the description',
  location: {
    name: 'Art Gallery of Guelph',
    coordinates: {
      longitude: 43.5441,
      latitude: -80.2488,
    },
    id: 'ChIJ_yHsStaaK4gRGHO3fJz-1jA',
  },
};