import { getIdToken, User } from "firebase/auth"
import FlareOrg from "./FlareOrg"
import flareLocation from "@/lib/types/Location"
import { Firestore, GeoPoint } from "firebase/firestore"
import {expect} from "@jest/globals"
import { FirebaseStorage } from "firebase/storage"
import { addDocument, getDocument } from "@/lib/firebase/firestore/firestoreOperations"
import { addFile } from "@/lib/firebase/storage/storageOperations"
import Collections from "@/lib/enums/collections"

describe("flareOrg Class", () => {
    it('shoould constructfrom User object', () => {
        const user = {
            uid: 'abc',
            email: 'test@example.com',
            photoURL: "url",
            getIdToken: jest.fn()
        } as unknown as User

        const loc: flareLocation = {
            id: "1234",
            coordinates: new GeoPoint(0, 0)
        }
        const flareOrg = new FlareOrg(user, 'Test Org', loc)
        expect(flareOrg.id).toBe('abc');
        expect(flareOrg.name).toBe('Test Org');
        expect(flareOrg.email).toBe('test@example.com');
        expect(flareOrg.location).toEqual(loc);
    })



    it('should call getDocument with correct path and converter', async () =>{
        const firestore = {} as Firestore
        await FlareOrg.getOrg(firestore, 'abc')

        expect(getDocument).toHaveBeenCalledWith(
            firestore,
            `${Collections.Organizations}/abc`,
            expect.any(Object)
        )
    })
})