import AgeGroup from "../enums/AgeGroup";
import eventType from "../enums/eventType";

interface EventFilters {
  flare_id?: string;
  type?: eventType[];
  ageGroup?: AgeGroup[];
  afterDate?: Date;
  beforeDate?: Date;
  onDate?: Date
  location?: {
    center: {lat: number, lng: number},
    radius: number
  }
};


export default EventFilters