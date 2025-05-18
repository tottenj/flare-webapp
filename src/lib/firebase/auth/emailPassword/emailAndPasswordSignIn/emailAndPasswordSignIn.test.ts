import { signInWithEmailAndPassword } from "firebase/auth";
import emailAndPasswordSignIn from "./emailAndPasswordSignIn";
import {expect} from "@jest/globals"
import { auth } from "../../configs/clientApp";


describe('emailAndPasswordSignIn', () =>{
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should login a user when an existing  email and password are provided', async() =>{
        const formData = new FormData()
        formData.append('email', 'test@example.com')
        formData.append('password', 'password123');

        (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
            user: {email: 'test@example.com', emailVerified: true}
        })

        const result = await emailAndPasswordSignIn({}, formData)

        expect(result).toEqual({ message: 'success' });
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
            auth,
            'test@example.com',
            'password123'
        )
    })

    it('should return an error message when email or password is missing', async () => {
        const formData = new FormData();
        formData.append('email', '');
        const result = await emailAndPasswordSignIn({}, formData)
       
        expect(result).toEqual({ message: 'Error Logging In Please Try Again' });
        expect(signInWithEmailAndPassword).not.toHaveBeenCalled()
    })
})