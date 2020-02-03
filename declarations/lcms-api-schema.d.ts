export interface ViewUpsertDto {
  /**
   * Template uuid.
   */
  templateUuid?: string;
  /**
   * Screen title.
   */
  screenTitle: string;
  header: any;
  /**
   * View category. REGULAR | EXTERNAL | GUEST | SITUATIEBEELD
   */
  category: 'REGULAR' | 'EXTERNAL' | 'GUEST' | 'SITUATIEBEELD';
  /**
   * View visibility.
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
  organisation: any;
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
  category: 'REGULAR' | 'EXTERNAL' | 'GUEST' | 'SITUATIEBEELD';
  header: any;
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
export interface TokenBundle {
  accessToken: any;
  refreshToken: any;
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
export interface Team {
  id: string;
  name: string;
  displayName: string;
  description: string;
}
export interface ProfileFunction {
  id: string;
  name: string;
  displayName: string;
  description: string;
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
export interface Organisation {
  /**
   * Id of the organisation.
   */
  id: string;
  /**
   * Code of the organisation.
   */
  code: string;
  /**
   * Name of the organisation.
   */
  name: string;
  /**
   * Display name of the organisation.
   */
  displayName: string;
  /**
   * The organisation is a partner.
   */
  partnerOrganisation: boolean;
}
export interface NotImplementedException { }
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
export interface FieldChange {
  /**
   * Type.
   */
  type: 'NEW' | 'OLD' | 'REMOVED';
  /**
   * Contents.
   */
  contents: string;
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
  category: 'PROPER_FIELD';
  /**
   * Field type.
   */
  type: 'VIEWER' | 'REGULAR';
  lock: any;
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
export interface Discipline {
  id: string;
  name: string;
  displayName: string;
  description: string;
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
export interface Activity {
  /**
   * Activity id.
   */
  id: string;
  /**
   * Activity name.
   */
  name: string;
  organisation: any;
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
   */
  status: 'RUNNING' | 'REOPENED' | 'ARCHIVED' | 'DELETED';
  /**
   * Activity type.
   */
  type: 'PUBLIC' | 'SECLUDED' | 'PREPARED' | 'PREPARED_REOCURRING';
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
  gripLevel: 'G0' | 'G1' | 'G2' | 'G3' | 'G4' | 'G5';
  /**
   * Activity is marked as read only.
   */
  isReadOnly: boolean;
}
