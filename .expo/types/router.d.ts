/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/add`; params?: Router.UnknownInputParams; } | { pathname: `/alerts`; params?: Router.UnknownInputParams; } | { pathname: `/history`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/product/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/add`; params?: Router.UnknownOutputParams; } | { pathname: `/alerts`; params?: Router.UnknownOutputParams; } | { pathname: `/history`; params?: Router.UnknownOutputParams; } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/product/[id]`, params: Router.UnknownOutputParams & { id: string; } };
      href: Router.RelativePathString | Router.ExternalPathString | `/add${`?${string}` | `#${string}` | ''}` | `/alerts${`?${string}` | `#${string}` | ''}` | `/history${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/add`; params?: Router.UnknownInputParams; } | { pathname: `/alerts`; params?: Router.UnknownInputParams; } | { pathname: `/history`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | `/product/${Router.SingleRoutePart<T>}` | { pathname: `/product/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
    }
  }
}
