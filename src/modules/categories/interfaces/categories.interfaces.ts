
export interface ICategories {
    id: number;
    name: string; 
    description: string; 
    theme: string;
    status: boolean;
    populate : number;
    userDocumentCreateAt?: string;
    createDateAt: Date;
    userDocumentUpdateAt?: string;
    updateDateAt: Date;
}
