export interface Activity {
    /**
     * Activity id.
     */
    id: string;
    /**
     * Activity name.
     */
    name: string;
    /**
     * Activity organisation.
     */
    organisation: Organisation;
    /**
     * Activity created on.
     */
    created: number;
    /**
     * Activity modified on.
     */
    modified: number;
    /**
     * Activity status.
     * example:
     * RUNNING
     */
    status: "RUNNING" | "REOPENED" | "ARCHIVED" | "DELETED";
    /**
     * Activity type.
     * example:
     * PUBLIC
     */
    type: "PUBLIC" | "SECLUDED" | "PREPARED" | "PREPARED_REOCURRING";
    /**
     * Activity is a template.
     */
    isTemplate: boolean;
    /**
     * Activity is readonly.
     */
    read: boolean;
    /**
     * Default selected tab of the activity.
     */
    defaultTab: string;
    /**
     * Activity grip phase.
     */
    gripLevel: "G0" | "G1" | "G2" | "G3" | "G4" | "G5";
    /**
     * Activity is marked as read only.
     */
    isReadOnly: boolean;
    /**
     * The organisations involved with the activity.
     */
    involvedOrganisations: string[];
    /**
     * The partner profiles involved with the activity.
     */
    involvedPartnerProfiles: string[];
    /**
     * The profiles involved with the activity.
     */
    involvedProfiles: string[];
    /**
     * The template used for the activity.
     */
    template: ActivityTemplate;
    /**
     * The template used for the activity.
     */
    location: string;
    /**
     * Is the activity secluded.
     */
    secluded: boolean;
    /**
     * Is the activity reoccurring.
     */
    reoccurring: boolean;
}
export interface ActivityAddFromTemplate {
    /**
     * Activity name.
     * example:
     * Activity name
     */
    name: string;
    /**
     * Activity owner organisation.
     */
    organisation: Organisation;
    /**
     * Activity grip phase.
     * example:
     * G0
     */
    gripLevel: "G0" | "G1" | "G2" | "G3" | "G4" | "G5";
    /**
     * The organisations involved with the activity.
     * example:
     * []
     */
    involvedOrganisations: string[];
    /**
     * The partner profiles involved with the activity.
     * example:
     * []
     */
    involvedPartnerProfiles: string[];
    /**
     * The profiles involved with the activity.
     * example:
     * []
     */
    involvedProfiles: string[];
    /**
     * The template used for the activity.
     */
    template: ActivityTemplate;
    /**
     * The template used for the activity.
     * example:
     * Zilverstraat 91, 2718 RP Zoetermeer
     */
    location: string;
    /**
     * Is the activity secluded.
     * example:
     * false
     */
    secluded: boolean;
    /**
     * Activity start time in epoch ms.
     * example:
     * 1584016293883
     */
    startTime: number;
}
export interface ActivityTemplate {
    /**
     * Id of an activity template
     * example:
     * 
     */
    id: string;
    /**
     * Name of an activity template
     * example:
     * 
     */
    name: string;
}
export interface ActivityUpdateFromTemplate {
    /**
     * Activity name.
     * example:
     * Activity name
     */
    name: string;
    /**
     * Activity owner organisation.
     */
    organisation: Organisation;
    /**
     * Activity grip phase.
     * example:
     * G0
     */
    gripLevel: "G0" | "G1" | "G2" | "G3" | "G4" | "G5";
    /**
     * The organisations involved with the activity.
     * example:
     * []
     */
    involvedOrganisations: string[];
    /**
     * The partner profiles involved with the activity.
     * example:
     * []
     */
    involvedPartnerProfiles: string[];
    /**
     * The profiles involved with the activity.
     * example:
     * []
     */
    involvedProfiles: string[];
    /**
     * The template used for the activity.
     * example:
     * Zilverstraat 91, 2718 RP Zoetermeer
     */
    location: string;
    /**
     * Is the activity secluded.
     * example:
     * false
     */
    secluded: boolean;
    /**
     * Activity start time in epoch ms.
     * example:
     * 1584016294090
     */
    startTime: number;
}
export interface AuthUserDto {
    /**
     * Username of the user.
     */
    username: string;
    /**
     * Password of the user.
     */
    password: string;
    /**
     * The name of the server/domain/application to select.
     */
    server: string;
    /**
     * An optional parameter to set the profile.
     */
    profileId: string;
}
export interface Discipline {
    id: string;
    name: string;
    displayName: string;
    description: string;
}
export interface Drawing {
}
export interface Field {
    /**
     * Field uuid.
     */
    uuid: string;
    /**
     * Field contents.
     */
    contents: string;
    /**
     * Template uuid.
     */
    templateUuid: string;
    /**
     * Screen title.
     */
    screenTitle: string;
    /**
     * Read.
     */
    read: boolean;
    /**
     * Position.
     */
    position: number;
    /**
     * Empty.
     */
    empty: boolean;
    /**
     * Has history.
     */
    hasHistory: boolean;
    /**
     * Has non-default content.
     */
    hasNonDefaultContent: boolean;
    /**
     * History available.
     */
    historyAvailable: boolean;
    /**
     * Last change time.
     */
    lastChangeTime: number;
    /**
     * Field category.
     */
    category: "PROPER_FIELD";
    /**
     * Field type.
     */
    type: "VIEWER" | "REGULAR";
    /**
     * Field lock.
     */
    lock: FieldLock;
    /**
     * Field attachments.
     */
    attachments: FieldAttachment[];
    /**
     * Field changes.
     */
    changes: FieldChange[];
    /**
     * Last change date string.
     */
    lastChangeDateString: string;
    /**
     * Last change by user.
     */
    lastChangeByUser: string;
}
export interface FieldAttachment {
    /**
     * Id.
     */
    id: string;
    /**
     * Filename.
     */
    fileName: string;
    /**
     * Name.
     */
    name: string;
    /**
     * Readonly.
     */
    readOnly: boolean;
}
export interface FieldChange {
    /**
     * Type.
     */
    type: "NEW" | "OLD" | "REMOVED";
    /**
     * Contents.
     */
    contents: string;
}
export interface FieldLock {
    /**
     * Locked.
     */
    locked: boolean;
    /**
     * Is own lock.
     */
    isOwnLock: boolean;
    /**
     * Is GMS lock.
     */
    isGmsLock: boolean;
    /**
     * Locked since.
     */
    lockedSince: number;
    /**
     * Locked expiration time.
     */
    lockExpirationTime: number;
    /**
     * Permanent.
     */
    permanent: boolean;
    /**
     * Removable.
     */
    removable: boolean;
}
export interface FieldUpsertDto {
    /**
     * Title.
     */
    title: string;
    /**
     * Description.
     */
    description: string;
    /**
     * Content.
     */
    content?: string;
    /**
     * Set the activity to read.
     */
    setActivityRead: boolean;
}
export interface HeaderParameters {
    "x-where-name"?: Parameters.XWhereName;
    "x-where-only-own-organization"?: Parameters.XWhereOnlyOwnOrganization;
    "x-where-only-not-read"?: Parameters.XWhereOnlyNotRead;
    "x-where-category": Parameters.XWhereCategory;
    "x-order-column": Parameters.XOrderColumn;
    "x-order-ascending"?: Parameters.XOrderAscending;
    "x-skip"?: Parameters.XSkip;
    "x-limit"?: Parameters.XLimit;
}
export interface LcmsGetMyUserInfoResponseDto {
    /**
     * The concatenated display name of the user.
     */
    displayName: string;
    /**
     * The last time the user made a call to the API.
     */
    lastSeen: number;
    /**
     * The authentication name of the user.
     */
    name: string;
    /**
     * The the organisation id of the user.
     */
    organizationId: string;
}
export interface NotImplementedException {
}
export interface Organisation {
    /**
     * Id of the organisation.
     * example:
     * 
     */
    id: string;
    /**
     * Code of the organisation.
     * example:
     * 
     */
    code: string;
    /**
     * Name of the organisation.
     * example:
     * 
     */
    name: string;
    /**
     * Display name of the organisation.
     * example:
     * 
     */
    displayName: string;
    /**
     * The organisation is a partner.
     * example:
     * false
     */
    partnerOrganisation: boolean;
}
declare namespace Parameters {
    export type ActivityUuid = string;
    export type Id = string;
    export type PartnerOrganisations = boolean;
    export type Uuid = string;
    export type ViewUuid = string;
    export type XLimit = number;
    export type XOrderAscending = "true" | "false";
    export type XOrderColumn = "name" | "organization" | "created" | "modified" | "gripLevel";
    export type XSkip = number;
    export type XWhereCategory = "RUNNING" | "ARCHIVED";
    export type XWhereName = string;
    export type XWhereOnlyNotRead = "true" | "false";
    export type XWhereOnlyOwnOrganization = "true" | "false";
}
export interface PathParameters {
    uuid: Parameters.Uuid;
}
export interface Profile {
    partnerProfile?: boolean;
    id: string;
    externalInformation: boolean;
    writer: boolean;
    level: string;
    organisation: Organisation;
    team: Team;
    discipline: Discipline;
    function: ProfileFunction;
    accessLevel?: number;
    restrictedToSummary?: boolean;
    informationManager?: boolean;
    templateManager?: boolean;
    templateCreator?: boolean;
    plotterAdvanced?: boolean;
    flankCommandant?: boolean;
    plotterBasic?: boolean;
    longEdit?: boolean;
    seeUsers?: boolean;
    ownOrganizationRightsOnly?: boolean;
    driveAssign?: boolean;
    measureAssign?: boolean;
    organizationContentManager?: boolean;
}
export interface ProfileFunction {
    id: string;
    name: string;
    displayName: string;
    description: string;
}
export interface QueryParameters {
    partnerOrganisations?: Parameters.PartnerOrganisations;
}
export type RequestBody = FieldUpsertDto;
declare namespace Responses {
    export type $200 = Drawing[];
    export type $201 = Field;
}
export interface Team {
    id: string;
    name: string;
    displayName: string;
    description: string;
}
export interface Template {
    /**
     * Id of the template.
     */
    id: string;
    /**
     * Name of the template.
     */
    name: string;
    /**
     * Description of the template.
     */
    description: string;
    /**
     * Is the template active.
     */
    isActive: boolean;
    /**
     * Is the template coupled to GMS.
     */
    gms: boolean;
    /**
     * Is the template the default template.
     */
    defaultTemplate: boolean;
    /**
     * The views in the template.
     */
    views: TemplateView[];
    /**
     * The view headers in the template.
     */
    viewHeaders: TemplateViewHeader[];
}
export interface TemplateView {
    /**
     * Id of the template view.
     */
    id: string;
    /**
     * Screen title of the template view.
     */
    screenTitle: string;
    /**
     * Position of the template view indicating order.
     */
    position: number;
    /**
     * View category of the template view.
     */
    viewCategory: "REGULAR" | "EXTERNAL" | "GUEST" | "SITUATIEBEELD";
    /**
     * View header id of the template view.
     */
    viewHeaderId: number;
    /**
     * View header name of the template view.
     */
    viewHeaderName: string;
    /**
     * Fields in the template view.
     */
    fields: TemplateViewField[];
}
export interface TemplateViewField {
    /**
     * Id of the template view field.
     */
    id: string;
    /**
     * Screen title of the template view field.
     */
    screenTitle: string;
    /**
     * Description of the template view field.
     */
    description: string;
    /**
     * Default contents of the template view field.
     */
    defaultContents: string;
    /**
     * Order of the field of field the template view.
     */
    positionInView: number;
    /**
     * Field type of the template view field.
     */
    fieldType: "VIEWER" | "REGULAR" | "OVI_INGEZETTE_EENHEDEN" | "OVI_KLADBLOKGEGEVENS_MELDKAMER";
}
export interface TemplateViewHeader {
    /**
     * Type of the template view header.
     */
    type: number;
    /**
     * Name of the template view header.
     */
    name: string;
}
export interface Token {
    /**
     * Sets expiration time in seconds.
     */
    expiresIn: string;
    /**
     * A token to authenticate requests with.
     */
    token: string;
}
export interface TokenBundle {
    /**
     * The token to validate to the backend.
     */
    accessToken: Token;
    /**
     * The refresh token to refresh an expired token.
     */
    refreshToken: Token;
}
export interface View {
    /**
     * View uuid.
     */
    uuid: string;
    /**
     * View name.
     */
    name: string;
    /**
     * Domain code.
     */
    domainCode: string;
    /**
     * Organisation.
     */
    organisation: Organisation;
    /**
     * Screen title.
     */
    screenTitle: string;
    /**
     * Alias.
     */
    alias: string;
    /**
     * Template id.
     */
    templateUuid: string;
    /**
     * Position.
     */
    position: number;
    /**
     * Read.
     */
    read: boolean;
    /**
     * Custom page.
     */
    customPage: boolean;
    /**
     * Empty.
     */
    empty: boolean;
    /**
     * Source activity id.
     */
    sourceActivityUuid: string;
    /**
     * View category.
     */
    category: "REGULAR" | "EXTERNAL" | "GUEST" | "SITUATIEBEELD";
    /**
     * View header.
     */
    header: ViewHeader;
    /**
     * Last change time.
     */
    lastChangeTime: number;
    /**
     * Last structural change time.
     */
    lastStructuralChangeTime: number;
    /**
     * Visible.
     */
    visible: boolean;
}
export interface ViewHeader {
    /**
     * View header id.
     */
    id: number;
    /**
     * View header name.
     */
    name: string;
}
export interface ViewUpsertDto {
    /**
     * Template uuid.
     */
    templateUuid?: string;
    /**
     * Screen title.
     */
    screenTitle: string;
    /**
     * View header.
     */
    header: ViewHeader;
    /**
     * View category. REGULAR | EXTERNAL | GUEST | SITUATIEBEELD
     */
    category: "REGULAR" | "EXTERNAL" | "GUEST" | "SITUATIEBEELD";
    /**
     * View visibility.
     */
    visible: boolean;
}
export interface XHeadersActivities {
    /**
     * Filter by name of the activity.
     */
    "x-where-name"?: string;
    /**
     * Only return activities of your own organisation.
     */
    "x-where-only-own-organization"?: "true" | "false";
    /**
     * Only return not read activities.
     */
    "x-where-only-not-read"?: "true" | "false";
    /**
     * Activity status.
     */
    "x-where-category": "RUNNING" | "ARCHIVED";
    /**
     * Column to sort by.
     */
    "x-order-column": "name" | "organization" | "created" | "modified" | "gripLevel";
    /**
     * Direction to sort by.
     */
    "x-order-ascending"?: "true" | "false";
    /**
     * Number of records to skip. This only works if 'x-limit' is present.
     */
    "x-skip"?: number;
    /**
     * Number of records to limit. This only works if 'x-skip' is present.
     */
    "x-limit"?: number;
}
