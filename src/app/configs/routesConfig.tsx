import FuseLoading from "@fuse/core/FuseLoading";
import FuseUtils from "@fuse/utils";
import { FuseRouteConfigsType, FuseRoutesType } from "@fuse/utils/FuseUtils";
import settingsConfig from "app/configs/settingsConfig";
import { Navigate } from "react-router-dom";
import Error404Page from "../main/404/Error404Page";
import ForgotPasswordConfig from "../main/forgot-password/ForgotPasswordConfig";
import RedirectPageConfig from "../main/redirectPage/RedirectPageConfig";
import SignInConfig from "../main/sign-in/SignInConfig";
import SignOutConfig from "../main/sign-out/SignOutConfig";
import SignUpConfig from "../main/sign-up/SignUpConfig";
// import ExampleConfig from "../main/example/ExampleConfig";
import AgentOnBoardConfig from "../main/agentsOnBoard/AgentOnBoardConfig";
import ClientOnBoardConfig from "../main/clientOnBoard/ClientOnBoardConfig";
import OtpVerificationConfig from "../main/otp-verification/OtpVerificationConfig";
import TwoFactorAuthenticationConfig from "../main/otp-verification/TwoFactorAuthenticationConfig";
import ResetPasswordConfig from "../main/reset-password/ResetPasswordConfig";
import SetPasswordConfig from "../main/set-password/SetPasswordConfig";
import CancelConfig from "../main/subscriptionCancel/CancelConfig";
import SucessConfig from "../main/subscriptionSuccess/SucessConfig";
import VerificationConfig from "../main/testing/VerificationConfig";
import { AdminAccountManagerConfig } from "../pages/accountManager/accountConfig";
import AdminAgentsConfig from "../pages/agents/agentsListConfig";
import BillingConfig, {
  AdminBillingConfig,
} from "../pages/billing/billingConfig";
import ChatBoardConfig from "../pages/chatBoard/chatBoardConfig";
import ClientConfig from "../pages/client/clientConfig";
import {
  AccMangerConfig,
  AdminDashboardConfig,
  AgentDashboardConfig,
  ClientDashboardConfig,
  UserConfig,
} from "../pages/dashboard/DashboardConfig";
import DepartmentConfig from "../pages/department/departmentConfig";
import KeywordConfig from "../pages/keyword/keywordConfig";
import ManageProductsConfig from "../pages/manageProducts/manageProductConfig";
import MyAgentsConfig from "../pages/myAgent/MyAgentsConfig";
import PasswordManagerConfig from "../pages/password-manager/passwordManagerConfig";
import ProfileConfig from "../pages/profile/profileConfig";
import ProjectsConfig from "../pages/projects/ProjectsConfig";
import SettingConfig, {
  clientSettingConfig,
  AdminUserConfig,
} from "../pages/setting/settingConfig";
import SharedFilesConfig from "../pages/shared-files/sharedFilesConfig";
import SupportConfig from "../pages/support/supportConfig";
import TasksConfig from "../pages/tasks/TasksConfig";
import UsersConfig from "../pages/users/usersConfig";
import AdminFinancialConfig from "../pages/financialReport/financialConfig";
import AdminFinancialConfigAcc from "../pages/financialReport/financialConfigAcc";
import Error401Page from "../main/401/Error401Page";
import { elements } from "chart.js";
import TermConditionConfig from "../main/TermsConditions/TermConditionConfig";
import PrivacyPolicyConfig from "../main/PrivacyPolicy/PrivacyPolicyConfig";
import PaymentMethod from "../main/paymentMethod/PaymentMethod";
import ProductConfig from "../main/client-subscription/ProductConfig";
import PaymentMethodConfigInner from "../main/paymentMethod/PaymentMethodConfigInner";
import { PaymentMethodConfig } from "../main/paymentMethod/PaymentMethodConfig";
import IntegrationConfig from "../pages/integration/integrationConfig";
import faqConfig from "../pages/faq/FaqConfig";
// import AIToolsConfig from "../pages/ai-tool/ai_config";

const commonRoutes = [
  {
    path: "loading",
    element: <FuseLoading />,
  },
  {
    path: "404",
    element: <Error404Page />,
  },
  {
    path: "401",
    element: <Error401Page />,
  },
  {
    path: "*",
    element: <Navigate to="404" />,
  },
];

const adminRouteConfigs: FuseRouteConfigsType = [
  AdminDashboardConfig,
  PaymentMethodConfigInner,
  PaymentMethodConfig,
  ProductConfig,
  AdminBillingConfig,
  SupportConfig,
  DepartmentConfig,
  faqConfig,
  ProfileConfig,
  SignOutConfig,
  SignInConfig,
  PrivacyPolicyConfig,
  TermConditionConfig,
  SignUpConfig,
  ForgotPasswordConfig,
  RedirectPageConfig,
  ResetPasswordConfig,
  SetPasswordConfig,
  OtpVerificationConfig,
  ClientConfig,
  AdminAgentsConfig,
  SettingConfig,
  ClientOnBoardConfig,
  AgentOnBoardConfig,
  AdminAccountManagerConfig,
  ManageProductsConfig,
  VerificationConfig,
  SucessConfig,
  CancelConfig,
  ChatBoardConfig,
  TwoFactorAuthenticationConfig,
  KeywordConfig,
  AdminFinancialConfig,
];

const clientRouteConfigs: FuseRouteConfigsType = [
  ClientDashboardConfig,
  PaymentMethodConfig,
  PaymentMethodConfigInner,
  ProductConfig,
  DepartmentConfig,
  ProjectsConfig,
  ProfileConfig,
  TasksConfig,
  TwoFactorAuthenticationConfig,
  MyAgentsConfig,
  SignOutConfig,
  SignInConfig,
  PrivacyPolicyConfig,
  TermConditionConfig,
  SignUpConfig,
  ForgotPasswordConfig,
  RedirectPageConfig,
  ResetPasswordConfig,
  SetPasswordConfig,
  OtpVerificationConfig,
  ClientConfig,
  AdminAgentsConfig,
  UsersConfig,
  SettingConfig,
  ClientOnBoardConfig,
  PasswordManagerConfig,
  SharedFilesConfig,
  ChatBoardConfig,
  clientSettingConfig,
  BillingConfig,
  SupportConfig,
  VerificationConfig,
  SucessConfig,
  PaymentMethodConfigInner,
  CancelConfig,
  AgentOnBoardConfig,
  IntegrationConfig,
  // AIToolsConfig,
];

const agentRouteConfigs: FuseRouteConfigsType = [
  AgentDashboardConfig,
  PaymentMethodConfig,
  PaymentMethodConfigInner,
  ProductConfig,
  DepartmentConfig,
  ProfileConfig,
  ProjectsConfig,
  TasksConfig,
  TwoFactorAuthenticationConfig,
  MyAgentsConfig,
  SignOutConfig,
  SignInConfig,
  PrivacyPolicyConfig,
  TermConditionConfig,
  SignUpConfig,
  ForgotPasswordConfig,
  RedirectPageConfig,
  ResetPasswordConfig,
  SetPasswordConfig,
  OtpVerificationConfig,
  ClientConfig,
  AdminAgentsConfig,
  UsersConfig,
  SettingConfig,
  ClientOnBoardConfig,
  PasswordManagerConfig,
  SharedFilesConfig,
  clientSettingConfig,
  BillingConfig,
  SupportConfig,
  VerificationConfig,
  SucessConfig,
  PaymentMethodConfigInner,
  CancelConfig,
  AgentOnBoardConfig,
  ChatBoardConfig,
  IntegrationConfig,
];
/**
 * The routes of the Admin application.
 */

const accManagerRouteConfigs: FuseRouteConfigsType = [
  AccMangerConfig,
  ProductConfig,
  ProjectsConfig,
  PaymentMethodConfig,
  PaymentMethodConfigInner,
  TasksConfig,
  ProfileConfig,
  ManageProductsConfig,
  TwoFactorAuthenticationConfig,
  MyAgentsConfig,
  SignOutConfig,
  SignInConfig,
  PrivacyPolicyConfig,
  TermConditionConfig,
  SignUpConfig,
  ForgotPasswordConfig,
  RedirectPageConfig,
  ResetPasswordConfig,
  SetPasswordConfig,
  OtpVerificationConfig,
  ClientConfig,
  AdminAgentsConfig,
  AdminUserConfig,
  UsersConfig,
  // SettingConfig,
  DepartmentConfig,
  faqConfig,
  KeywordConfig,
  ClientOnBoardConfig,
  PasswordManagerConfig,
  SharedFilesConfig,
  clientSettingConfig,
  BillingConfig,
  SupportConfig,
  VerificationConfig,
  AdminAccountManagerConfig,
  SucessConfig,
  CancelConfig,
  PaymentMethodConfigInner,
  AgentOnBoardConfig,
  ChatBoardConfig,
  AdminFinancialConfigAcc,
];

const userRouteConfigs: FuseRouteConfigsType = [
  UserConfig,
  PaymentMethodConfig,
  PaymentMethodConfigInner,
  ProductConfig,
  ProjectsConfig,
  TasksConfig,
  ProfileConfig,
  TwoFactorAuthenticationConfig,
  MyAgentsConfig,
  SignOutConfig,
  SignInConfig,
  PrivacyPolicyConfig,
  TermConditionConfig,
  SignUpConfig,
  ForgotPasswordConfig,
  RedirectPageConfig,
  ResetPasswordConfig,
  SetPasswordConfig,
  OtpVerificationConfig,
  ClientConfig,
  AdminAgentsConfig,
  UsersConfig,
  SettingConfig,
  ClientOnBoardConfig,
  PasswordManagerConfig,
  SharedFilesConfig,
  clientSettingConfig,
  BillingConfig,
  SupportConfig,
  VerificationConfig,
  SucessConfig,
  CancelConfig,
  PaymentMethodConfigInner,
  AgentOnBoardConfig,
  ChatBoardConfig,
  IntegrationConfig,
];

export const adminRoutes: FuseRoutesType = [
  ...FuseUtils.generateRoutesFromConfigs(
    adminRouteConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to="/admin/dashboard" />,
    auth: settingsConfig.defaultAuth,
  },
  ...commonRoutes,
];

/**
 * The routes of the Client application.
 */

export const clientRoutes: FuseRoutesType = [
  ...FuseUtils.generateRoutesFromConfigs(
    clientRouteConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
    auth: settingsConfig.defaultAuth,
  },
  ...commonRoutes,
];

export const agentRoutes: FuseRoutesType = [
  ...FuseUtils.generateRoutesFromConfigs(
    agentRouteConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to={"/agent/dashboard"} />,
    auth: settingsConfig.defaultAuth,
  },
  ...commonRoutes,
];

export const accManagerRoutes: FuseRoutesType = [
  ...FuseUtils.generateRoutesFromConfigs(
    accManagerRouteConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to={"/accountManager/dashboard"} />,
    auth: settingsConfig.defaultAuth,
  },
  ...commonRoutes,
];

export const UserRoutes: FuseRoutesType = [
  ...FuseUtils.generateRoutesFromConfigs(
    userRouteConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to={"/user/dashboard"} />,
    auth: settingsConfig.defaultAuth,
  },
  ...commonRoutes,
];
