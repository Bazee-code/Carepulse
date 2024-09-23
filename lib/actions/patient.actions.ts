'use server'

import { Query, ID } from "node-appwrite"
import { DATABASE_ID, databases, PATIENT_COLLECTION_ID, PROJECT_ID, PUBLIC_BUCKET_ID, PUBLIC_ENDPOINT, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils"

import {InputFile} from 'node-appwrite/file'

export const createUser = async(user : CreateUserParams) => {
    try {
        const newUser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name)

        return parseStringify(newUser)
    }
    catch(e:any){
        if(e && e?.code === 409){
            const existingUser = await users.list([
                Query.equal('email',[user.email])
            ])

            return existingUser?.users[0]
        }
    }
}

export const getUser = async(userId : string) => {
    try{
        const user = await users.get(userId)

        return parseStringify(user)
    }
    catch(e:any){
        console.log(e)
        throw(e)
    }
}

export const registerPatient = async({identificationDocument, ...patient} : RegisterUserParams) => {
    try{
        let file;

        if(identificationDocument){
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string,
            )

            file = await storage.createFile(PUBLIC_BUCKET_ID!, ID.unique(),inputFile)
            console.log("file",file)
        }

        // console.log('patientAction',patient)

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            { 
                identificationDocument: file?.$id || null,
                identificationDocumentUrl : `${PUBLIC_ENDPOINT}/storage/buckets/${PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient
            }
        )

        return parseStringify(newPatient)

    }
    catch(e:any){
        console.log(e)
        throw(e)
    }
}