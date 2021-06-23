import { Handler } from "../data/handler";
import express from 'express';
import { ResponseData } from "../data/data";
import {authToken} from "../utils/utils";
import { PostgrestResponse } from "@supabase/postgrest-js/dist/main/lib/types";

export class AddClassGuideline extends Handler {
    path = "/guideline/add/class"

    async handle(request: express.Request, response: express.Response): Promise<void> {
        try {
            if(request.headers.authorization !== authToken) 
                throw { code: 403, message: "Missing or invalid Authorization Header"}

            if(request.headers["content-type"] !== 'application/json')
                throw { code: 403, message: "Unsupported request body"}

            const requestDataClass = await this.isAnyDuplicateData(request.body.id);

            let insertedData;
            if(!requestDataClass){
                insertedData = await this.insertDataToDb(request);
            } else {
                throw { code: 400, message: "Data is exists!"}
            }

            const data: ResponseData = {
                success: true,
                error_message: null,
                data: insertedData
            }
            response.status(200);
            response.send(data);

        } catch(e){
            const data: ResponseData = {
                success: false,
                error_message: e,
                data: null
            }
            response.status(404);
            response.send(data);
        }
        return Promise.resolve();
    }

    async isAnyDuplicateData(classId: number): Promise<boolean> {
        const requestDataClass = await this.supabase?.from("guideline_classes")?.select("*")?.eq('id', [classId]);
        if(requestDataClass){
            let {data, error } = <PostgrestResponse<any>>requestDataClass;
            if (data){
                return Promise.resolve(data.length > 0);
            }
            return Promise.reject(error?.message);
        } 
        return Promise.reject(`Cannot find class with id: ${classId}`); 
    }

    async insertDataToDb(request: express.Request): Promise<Record<string, any>> {
        
        const composeData = {
            id: request.body.id,
            class_name: request.body.class_name,
            class_submission_tutorials: request.body.class_submission_tutorials,
            class_tutorial_submission_ids: request.body.class_tutorial_submission_ids
        };
        const a = await this.supabase?.from("guideline_classes").insert([composeData]);
        if(a.error !== null){
            return Promise.reject({
                code: a.error.code,
                message: a.error.message
            })
        }
        return Promise.resolve(a.data);
    }

}