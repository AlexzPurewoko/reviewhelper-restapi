import { Handler } from "../data/handler";
import express from 'express';
import { PostgrestResponse } from "@supabase/postgrest-js/dist/main/lib/types";
import { authToken } from "../utils/utils";
import { ResultGuidelineResponse } from "../data/response";
import { ResponseData } from "../data/data";

export class AddGuideline extends Handler {
    path = "/guideline/add/data"

    async handle(request: express.Request , response:  express.Response): Promise<void> {
        try {
            if(request.headers.authorization !== authToken) 
                throw { code: 403, message: "Missing or invalid Authorization Header"}

            if(request.headers["content-type"] !== 'application/json')
                throw { code: 403, message: "Unsupported request body"}

            const requestDataClass = await this.isAnyDuplicateData(
                request.body.data.map((item: ResultGuidelineResponse) => {
                    return item.content
                })
            );

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

    async isAnyDuplicateData(content: string[]): Promise<boolean> {
        const requestDataClass = await this.supabase?.from("guideline_data")?.select("*")?.eq('content', content);
        if(requestDataClass){
            let {data, error } = <PostgrestResponse<any>>requestDataClass;
            console.log(data);
            if (data){
                return Promise.resolve(data.length > 0);
            }
            return Promise.reject(error?.message);
        } 
        return Promise.reject(`Failed to check data`); 
    }

    async insertDataToDb(request: express.Request): Promise<Record<string, any>> {
        const allData: ResultGuidelineResponse[] = request.body.data;
        let idx = 0
        for(let value of allData){
            if(
                !value.hasOwnProperty("content") &&
                !value.hasOwnProperty("for_accepted") &&
                !value.hasOwnProperty("submission_tutorial_id") &&
                !value.hasOwnProperty("suggestion_template")){
                return Promise.reject({ code: 400, message: `Found any missing property on data index ${idx}`}); 
            }
            idx++;
        }

        const a = await this.supabase?.from("guideline_data").insert(allData);
        if(a.error !== null){
            return Promise.reject({
                code: a.error.code,
                message: a.error.message
            })
        }
        return Promise.resolve(a.data);
    }
}