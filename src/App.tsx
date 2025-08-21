import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  UserOutlined,
  TeamOutlined,
  CreditCardOutlined,
  WifiOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  LinkOutlined,
} from "@ant-design/icons";

import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { authProvider } from "./authProvider";
import { dataProvider } from "./dataProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { UsersCreate, UsersEdit, UsersList, UsersShow, UsersResetPassword } from "./pages/users";
import { DepartmentsCreate, DepartmentsEdit, DepartmentsList, DepartmentsShow } from "./pages/departments";
import { CardsCreate, CardsEdit, CardsList, CardsShow } from "./pages/cards";
import { WifiCreate, WifiEdit, WifiList, WifiShow } from "./pages/wifi";
import { QuickLinksCreate, QuickLinksEdit, QuickLinksList, QuickLinksShow } from "./pages/quick-links";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={[
                  {
                    name: "users",
                    list: "/users",
                    create: "/users/create",
                    edit: "/users/edit/:id",
                    show: "/users/show/:id",
                    meta: {
                      icon: <UserOutlined />,
                    },
                  },
                  {
                    name: "departments",
                    list: "/departments",
                    create: "/departments/create",
                    edit: "/departments/edit/:id",
                    show: "/departments/show/:id",
                    meta: {
                      canDelete: true,
                      icon: <TeamOutlined />,
                    },
                  },
                  {
                    name: "cards",
                    list: "/cards",
                    create: "/cards/create",
                    edit: "/cards/edit/:id",
                    show: "/cards/show/:id",
                    meta: {
                      canDelete: true,
                      icon: <CreditCardOutlined />,
                    },
                  },
                  {
                    name: "wifi",
                    list: "/wifi",
                    create: "/wifi/create",
                    edit: "/wifi/edit/:id",
                    show: "/wifi/show/:id",
                    meta: {
                      canDelete: true,
                      icon: <WifiOutlined />,
                    },
                  },
                  {
                    name: "quick-links",
                    list: "/quick-links",
                    create: "/quick-links/create",
                    edit: "/quick-links/edit/:id",
                    show: "/quick-links/show/:id",
                    meta: {
                      canDelete: true,
                      icon: <LinkOutlined />,
                      label: "Enlaces Rápidos",
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "dmD5WN-itiKHq-B0ImNs",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={Header}
                          Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="users" />}
                    />
                    <Route path="/users">
                      <Route index element={<UsersList />} />
                      <Route path="create" element={<UsersCreate />} />
                      <Route path="edit/:id" element={<UsersEdit />} />
                      <Route path="show/:id" element={<UsersShow />} />
                      <Route path="reset-password/:id" element={<UsersResetPassword />} />
                    </Route>
                    <Route path="/departments">
                      <Route index element={<DepartmentsList />} />
                      <Route path="create" element={<DepartmentsCreate />} />
                      <Route path="edit/:id" element={<DepartmentsEdit />} />
                      <Route path="show/:id" element={<DepartmentsShow />} />
                    </Route>
                    <Route path="/cards">
                      <Route index element={<CardsList />} />
                      <Route path="create" element={<CardsCreate />} />
                      <Route path="edit/:id" element={<CardsEdit />} />
                      <Route path="show/:id" element={<CardsShow />} />
                    </Route>
                    <Route path="/wifi">
                      <Route index element={<WifiList />} />
                      <Route path="create" element={<WifiCreate />} />
                      <Route path="edit/:id" element={<WifiEdit />} />
                      <Route path="show/:id" element={<WifiShow />} />
                    </Route>
                    <Route path="/quick-links">
                      <Route index element={<QuickLinksList />} />
                      <Route path="create" element={<QuickLinksCreate />} />
                      <Route path="edit/:id" element={<QuickLinksEdit />} />
                      <Route path="show/:id" element={<QuickLinksShow />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
