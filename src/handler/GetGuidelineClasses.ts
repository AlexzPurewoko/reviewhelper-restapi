import { Handler } from "../data/handler";
import express from 'express'
import { ResultClassResponse } from "../data/response";
import { PostgrestResponse } from "@supabase/postgrest-js/dist/main/lib/types";
import { ClassData, ResponseData, SubmissionData } from "../data/data";
import { fromDataResponseExtractSubmissions } from "../data/mapper";


export class GetGuidelineClasses extends Handler {
    path = "/guideline/classes";

    async handle(_: express.Request , response:  express.Response): Promise<void>{
        try {
            const getDataClass = await this.getAllClassData();
            const composedData: ResponseData = {
                success: true,
                error_message: null,
                data: getDataClass
            }

            response.status(200);
            response.send(composedData);

        } catch (e) {
            const data: ResponseData = {
                success: false,
                error_message: e,
                data: null
            }
            response.status(404);
            response.send(data);
            return;
        }

        return Promise.resolve();
    }

    async getAllClassData(): Promise<ClassData[]> {
        const requestDataClass = await this.supabase?.from("guideline_classes")?.select("*");
        if(requestDataClass){
            let {data, error } = <PostgrestResponse<any>>requestDataClass;
            if (data){
                const resultClass: ResultClassResponse[] = data;
                const mappedData: ClassData[] = resultClass.map((item) => {
                    return {
                        id: item.id,
                        name: item.class_name,
                        submission_data: fromDataResponseExtractSubmissions(item)
                    }
                })
                return Promise.resolve(mappedData);
            }
            return Promise.reject(error?.message);
        } 
        return Promise.reject(`Data class is empty`);
    }

}