export interface FuseNavigationItem
{
    intGlCode: string;
    varMenuName: string;
    varMenuType: 'item' | 'group' | 'collapsable';
    varIconPath?: string;
    varURL?: string;
    translate?: string;
    classes?: string;
    exactMatch?: boolean;
    externalUrl?: boolean;
    openInNewTab?: boolean;
    hidden?: boolean;
    function?: any;
    badge?: {
        title?: string;
        translate?: string;
        bg?: string;
        fg?: string;
    };
    children?: FuseNavigationItem[];

    // id: string;
    // title: string;
    // type: 'item' | 'group' | 'collapsable';
    // translate?: string;
    // icon?: string;
    // hidden?: boolean;
    // url?: string;
    // classes?: string;
    // exactMatch?: boolean;
    // externalUrl?: boolean;
    // openInNewTab?: boolean;
    // function?: any;
    // badge?: {
    //     title?: string;
    //     translate?: string;
    //     bg?: string;
    //     fg?: string;
    // };
    // children?: FuseNavigationItem[];
}

export interface FuseNavigation extends FuseNavigationItem
{
    children?: FuseNavigationItem[];
}
