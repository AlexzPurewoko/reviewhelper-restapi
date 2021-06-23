import { Handler } from "../data/handler";
import express from 'express';
import { GuidelineFilteredData, ItemData, ResponseData, SubmissionData } from "../data/data";
import { PostgrestResponse } from "@supabase/postgrest-js/dist/main/lib/types";
import { ResultClassResponse, ResultGuidelineResponse } from "../data/response";

export class GetGuidelineByClassId extends Handler {
    path = "/guideline/by/:classid"

    async handle(request: express.Request , response:  express.Response): Promise<void> {
        const reqClass: number = parseInt(request.params.classid);

        try {
            const getDataClass = await this.getClassData(reqClass);
            const getGuidelineData = await this.getGuidelineData(getDataClass.class_tutorial_submission_ids);

            const composedData = this.composeData(getDataClass, getGuidelineData);
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
        
        return Promise.resolve() 
    }

    composeData(classData: ResultClassResponse, guidelineData: ResultGuidelineResponse[]): ResponseData {
        const submissionData: SubmissionData[] = classData.class_submission_tutorials.map((value, index) => {
            return {
                tutorialId: classData.class_tutorial_submission_ids[index],
                name: value
            }
        })

        const guidelineContent: ItemData[] = guidelineData.map((value)=> {
            return {
                id: value.id,
                title: value.content,
                for_accepted: value.for_accepted,
                submission_ref_id: value.submission_tutorial_id,
                suggestion_template: value.suggestion_template
            }
        })

        const data: GuidelineFilteredData = {
            class_data: {
                id: classData.id,
                name: classData.class_name,
                submission_data: submissionData,
            },
            content: guidelineContent
        };
        
        return {
            success: true,
            error_message: null,
            data
        }
    }

    async getClassData(classId: number, ): Promise<ResultClassResponse> {
        const requestDataClass = await this.supabase?.from("guideline_classes")?.select("*")?.in('id', [classId]);
        if(requestDataClass){
            let {data, error } = <PostgrestResponse<any>>requestDataClass;
            if (data){
                const resultClass: ResultClassResponse = data[0];
                return Promise.resolve(resultClass);
            }
            return Promise.reject(error?.message);
        } 
        return Promise.reject(`Cannot find class with id: ${classId}`);
    }

    async getGuidelineData(submission_tutorial_id: number[]): Promise<ResultGuidelineResponse[]> {
        const requestDataClass = await this.supabase?.from("guideline_data")?.select("*")?.in("submission_tutorial_id", submission_tutorial_id);
        if(requestDataClass){
            let {data, error } = <PostgrestResponse<any>>requestDataClass;
            if (data){
                const resultClass: ResultGuidelineResponse[] = data;
                return Promise.resolve(resultClass);
            }
            return Promise.reject(error?.message);
        } 
        return Promise.reject(`Cannot find guideline with all tutorials: ${submission_tutorial_id}`);
    }
}