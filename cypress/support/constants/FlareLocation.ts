export default interface FlareLocation{
    id:string
    coordinates:{
        longitude:number
        latitude:number
    },
    name:string
}



export const preMadeLocation: FlareLocation =  {
    coordinates: {
      latitude: 43.67772,
      longitude: -79.62482,
    },
    id: 'ChIJK4J5p5RzK4gRL6c1pFiP7Tw',
    name: 'Toronto Pearson International Airport',
  }