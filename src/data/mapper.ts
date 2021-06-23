import { SubmissionData } from "./data"
import { ResultClassResponse } from "./response"

export function fromDataResponseExtractSubmissions(resultClassResponse: ResultClassResponse): SubmissionData[] {
    return resultClassResponse.class_submission_tutorials.map((value, index) => {
        return {
            tutorialId: resultClassResponse.class_tutorial_submission_ids[index],
            name: value
        }
    })
}