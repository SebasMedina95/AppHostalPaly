
export interface ICategories {
    id: number;
    name: string; 
    description: string; 
    theme: string;
    status: boolean;
    populate : number;
    userCreateAt?: string;
    createDateAt: Date;
    userUpdateAt?: string;
    updateDateAt: Date;
}
