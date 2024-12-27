'use server'
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secretKey = "6raZojAswqRDpJhkylxjYk0Tw0DyPTzo";
const key = new TextEncoder().encode(secretKey);

export const encrypt = async(payload: any) => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime("7 days")
        .sign(key)
}

export const decrypt = async(input: string): Promise<any> => {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  }

export const getSession = async () => {
    const session = (await cookies()).get('session')?.value;
    
    if (!session) {
        return null;
    }
    return await decrypt(session);
}

export const signOut = async () => {
    (await cookies()).set('session', '', { expires: new Date(0) });
}
