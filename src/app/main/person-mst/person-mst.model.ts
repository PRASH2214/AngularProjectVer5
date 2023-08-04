export class person {
    intGlCode: string;
    varUserCode: string;
    varUserName: string;
    varEmail: string;
    varMobile: string;
    varDesignation: string;
    varPassword: string;
    chrActive: string;
    fk_CountryGlCode: number;
    fk_PersonCountryGlCode: number;
    fk_PersonRoleGlCode: number;
    varUserCode_Ref1: string;
}
export class countrylist {
    intGlCode: string;
    varCountryCode: string;
    varCountryName: string;
    isSelected: boolean;
}



