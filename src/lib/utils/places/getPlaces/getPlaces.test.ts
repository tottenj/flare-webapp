import getPlaces from "./getPlaces";
import { expect } from '@jest/globals';

describe('getPlaces', () =>{
    it('returns place suggestions if requestId matches', async () =>{
        const results = await getPlaces('Guelph', 1, 1);
        expect(results).toEqual([{label: "Guelph City Hall", value: "abc123"}])
    })

    it('returns empty array if requestId does not match', async () => {
        const results = await getPlaces('Guelph', 1, 2);
        expect(results).toEqual([])
    })
})