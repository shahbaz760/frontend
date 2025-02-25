import FuseNavItemModel from "@fuse/core/FuseNavigation/models/FuseNavItemModel";
import {
  FuseFlatNavItemType,
  FuseNavItemType,
} from "@fuse/core/FuseNavigation/types/FuseNavItemType";
import FuseUtils from "@fuse/utils";
import FuseNavigationHelper from "@fuse/utils/FuseNavigationHelper";
import {
  PayloadAction,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import navigationConfig, {
  UserNavigationConfig,
  adminNavigationConfig,
  agentNavigationConfig,
  managerNavigationConfig,
  ClientNoNavigationConfig,
} from "app/configs/navigationConfig";
import { selectCurrentLanguageId } from "app/store/i18nSlice";
import { AppThunk, RootStateType } from "app/store/types";
import i18next from "i18next";
import {
  selectUserRole,
  userSliceType,
} from "src/app/auth/user/store/userSlice";
import { getLocalStorage, getPermission, getUserDetail } from "src/utils";
import { PartialDeep } from "type-fest";

type AppRootStateType = RootStateType<[navigationSliceType, userSliceType]>;

const navigationAdapter = createEntityAdapter<FuseFlatNavItemType>();

const emptyInitialState = navigationAdapter.getInitialState([]);



/**
 * Redux Thunk actions related to the navigation store state
 */
/**
 * Appends a navigation item to the navigation store state.
 */
export const appendNavigationItem =
  (item: FuseNavItemType, parentId?: string | null): AppThunk =>
  async (dispatch, getState) => {
    const AppState = getState() as AppRootStateType;
    const navigation = FuseNavigationHelper.unflattenNavigation(
      selectNavigationAll(AppState)
    );

    dispatch(
      setNavigation(
        FuseNavigationHelper.appendNavItem(
          navigation,
          FuseNavItemModel(item),
          parentId
        )
      )
    );

    return Promise.resolve();
  };

/**
 * Prepends a navigation item to the navigation store state.
 */
export const prependNavigationItem =
  (item: FuseNavItemType, parentId?: string | null): AppThunk =>
  async (dispatch, getState) => {
    const AppState = getState() as AppRootStateType;
    const navigation = FuseNavigationHelper.unflattenNavigation(
      selectNavigationAll(AppState)
    );

    dispatch(
      setNavigation(
        FuseNavigationHelper.prependNavItem(
          navigation,
          FuseNavItemModel(item),
          parentId
        )
      )
    );

    return Promise.resolve();
  };

/**
 * Adds a navigation item to the navigation store state at the specified index.
 */
export const updateNavigationItem =
  (id: string, item: PartialDeep<FuseNavItemType>): AppThunk =>
  async (dispatch, getState) => {
    const AppState = getState() as AppRootStateType;
    const navigation = FuseNavigationHelper.unflattenNavigation(
      selectNavigationAll(AppState)
    );

    dispatch(
      setNavigation(FuseNavigationHelper.updateNavItem(navigation, id, item))
    );

    return Promise.resolve();
  };

/**
 * Removes a navigation item from the navigation store state.
 */
export const removeNavigationItem =
  (id: string): AppThunk =>
  async (dispatch, getState) => {
    const AppState = getState() as AppRootStateType;
    const navigation = FuseNavigationHelper.unflattenNavigation(
      selectNavigationAll(AppState)
    );

    dispatch(setNavigation(FuseNavigationHelper.removeNavItem(navigation, id)));

    return Promise.resolve();
  };

export const {
  selectAll: selectNavigationAll,
  selectIds: selectNavigationIds,
  selectById: selectNavigationItemById,
} = navigationAdapter.getSelectors(
  (state: AppRootStateType) => state.navigation
);
const userDetail = getUserDetail();

const permissionRoute = getPermission(userDetail);
export const initialState = navigationAdapter.upsertMany(
  emptyInitialState,

  FuseNavigationHelper.flattenNavigation(
    userDetail?.role_id == 1
      ? adminNavigationConfig
      : userDetail?.role_id == 3
        ? agentNavigationConfig
        : userDetail?.role_id == 4
          ? managerNavigationConfig
          : userDetail?.role_id == 5
            ? UserNavigationConfig
            : userDetail?.is_signed == 1 &&
                (userDetail.projects == true ||
                  userDetail?.projects?.length > 0)
              ? navigationConfig
              : ClientNoNavigationConfig
  )
);

/**
 * The navigation slice
 */
export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setInitialState: (state, { payload }) => {
      state = navigationAdapter.upsertMany(
        emptyInitialState,
        FuseNavigationHelper.flattenNavigation(
          payload?.role_id == 1
            ? adminNavigationConfig
            : payload?.isAdd
              ? payload?.customNavigation
              : payload?.role_id == 3
                ? agentNavigationConfig
                : payload?.role_id == 4
                  ? managerNavigationConfig
                  : payload?.role_id == 5
                    ? UserNavigationConfig
                    : payload?.is_signed == 1 &&
                        (payload.projects == true ||
                          payload?.projects?.length > 0)
                      ? navigationConfig
                      : ClientNoNavigationConfig
        )
      );
    },
    setNavigation(state, action: PayloadAction<FuseNavItemType[]>) {
      return navigationAdapter.setAll(
        state,
        FuseNavigationHelper.flattenNavigation(action.payload)
      );
    },
    resetNavigation: () => initialState,
  },
});

export const { setNavigation, resetNavigation, setInitialState } =
  navigationSlice.actions;

export const selectNavigation = createSelector(
  [selectNavigationAll, selectUserRole, selectCurrentLanguageId],
  (navigationSimple, userRole) => {
    const navigation =
      FuseNavigationHelper.unflattenNavigation(navigationSimple);

    function setAdditionalData(data: FuseNavItemType[]): FuseNavItemType[] {
      return data?.map((item) => ({
        hasPermission: Boolean(FuseUtils.hasPermission(item?.auth, userRole)),
        ...item,
        ...(item?.translate && item?.title
          ? { title: i18next.t(`navigation:${item?.translate}`) }
          : {}),
        ...(item?.children
          ? { children: setAdditionalData(item?.children) }
          : {}),
      }));
    }

    const translatedValues = setAdditionalData(navigation);

    return translatedValues;
  }
);

export const selectFlatNavigation = createSelector(
  [selectNavigation],
  (navigation) => {
    return FuseNavigationHelper.flattenNavigation(navigation);
  }
);

export type navigationSliceType = typeof navigationSlice;

export default navigationSlice.reducer;
