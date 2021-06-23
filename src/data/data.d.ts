 
export interface SubmissionData {
    tutorialId: number,
    name: string
}

export interface ClassData { 
    id: number,
    name: string,
    submission_data: SubmissionData[]
}

export interface ItemData {
    id: number,
    title: string,
    for_accepted: boolean,
    submission_ref_id: number,
    suggestion_template: string | null
}

export interface GuidelinesData {
    classes: ClassData[], 
    items: ItemData[]
}

export interface GuidelineFilteredData {
    class_data: ClassData,
    content: ItemData[]
}
 
export interface ResponseData {
     success: boolean,
     error_message: string | null,
     data: GuidelinesData | ItemData[] | GuidelineFilteredData | null | ClassData[]
}

// mapper 
