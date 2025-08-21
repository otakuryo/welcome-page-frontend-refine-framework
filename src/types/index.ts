// Barrel exports para los tipos
export type {
  LoginRequest,
  AuthUser,
  AuthData,
  ApiResponse,
  LoginResponse,
  ApiError
} from './auth';

export type {
  UserRole,
  PaginationInfo,
  ApiPaginatedResponse,
  UserPersonalInfoLite,
  UsersListItem,
  UserCard,
  UserDetailed,
  UserPersonalInfo,
  UsersListQuery,
  UpdatePersonalInfoRequest,
  UpdateRoleRequest,
  UpdateStatusRequest,
  BulkAction,
  AdminBulkUpdateRequest,
  CreateUserRequest,
} from './users';

export type {
  CardType,
  CardCreatedBy,
  CardListItem,
  FullCard,
  MyCardItem,
  UserCardAssignment,
  CardsListQuery,
  CreateCardRequest,
  UpdateCardRequest,
  AssignCardRequest,
  UpdateFeaturedRequest,
  DeleteCardResponse,
  SoftDeleteCardResponse,
} from './cards';

export type {
  WifiNetwork,
  WifiListQuery,
  CreateWifiNetworkRequest,
  UpdateWifiNetworkRequest,
  WifiResponse,
  WifiListResponse,
} from './wifi';

export type {
  QuickLink,
  QuickLinksListQuery,
  CreateQuickLinkRequest,
  UpdateQuickLinkRequest,
  DeleteQuickLinkResponse,
  QuickLinksListResponse,
  QuickLinkResponse,
} from './quicklinks';
