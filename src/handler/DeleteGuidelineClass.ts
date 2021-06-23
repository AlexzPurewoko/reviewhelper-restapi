import express from "express";
import { PostgrestResponse } from "@supabase/postgrest-js/dist/main/lib/types";
import { ResponseData } from "../data/data";
import { Handler } from "../data/handler";
import { authToken } from "../utils/utils";
import { ResultClassResponse } from "../data/response";

export class DeleteGuidelineClass extends Handler {
    path = "/guideline/delete/class/:id"
    
    async handle(request: express.Request , response:  express.Response): Promise<void> {
        const reqId = parseInt(request.params.id);
        try {
            if(request.headers.authorization !== authToken) 
                throw { code: 403, message: "Missing or invalid Authorization Header"}

            const requestDataClass = await this.isDataExists(reqId);

            let insertedData;
            if(requestDataClass){
                insertedData = await this.deleteDataFromDb(reqId);
            } else {
                throw { code: 400, message: "Data is not exists!"}
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

    async isDataExists(dataId: number): Promise<boolean> {
        const requestDataClass = await this.supabase?.from("guideline_classes")?.select("*")?.eq('id', [dataId]);
        if(requestDataClass){
            let {data, error } = <PostgrestResponse<any>>requestDataClass;
            if (data){
                return Promise.resolve(data.length !== 0);
            }
            return Promise.reject(error?.message);
        } 
        return Promise.reject(`Cannot find data with id: ${dataId}`); 
    }

    async deleteDataFromDb(dataId: number): Promise<Record<string, any>> {
        const a = await this.supabase?.from("guideline_classes").delete().eq("id", dataId);
        if(a.error !== null){
            return Promise.reject({
                code: a.error.code,
                message: a.error.message
            })
        }
        const classResponse: ResultClassResponse = a.data[0]
        await this.supabase?.from("guideline_data").delete().eq("submission_tutorial_id", classResponse.class_tutorial_submission_ids);

        return Promise.resolve(a.data);
    }
}