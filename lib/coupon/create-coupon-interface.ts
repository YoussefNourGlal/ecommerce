export interface ICreateCoupon{
code: string;
discountPercentage: number;
expiresAt: Date;
isActive?: boolean;
}