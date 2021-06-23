export interface ResultClassResponse {
    id: number,
    class_name: string,
    class_submission_tutorials: string[],
    class_tutorial_submission_ids: number[]
}

export interface ResultGuidelineResponse {
    id: number,
    content: string,
    for_accepted: boolean,
    submission_tutorial_id: number,
    suggestion_template: string | null
}