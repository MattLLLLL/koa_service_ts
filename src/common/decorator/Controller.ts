export enum Actions { Token, Merchant, None };

export interface Route {
    propertyKey: string;
    method: string;
    path: string;
    actions?: [Actions]
}

export function Controller(path: string = ''): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata('basePath', path, target);
    }
}

export type RouterDecoratorFactory = (path?: string, headers?: Actions[]) => MethodDecorator;

export function createRouterDecorator(method: string): any {
    return (path?: string, headers?: [Actions]) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const route: Route = {
            propertyKey,
            method,
            path: path || '',
            actions: headers
        };
        if (!Reflect.hasMetadata('routes', target)) {
            Reflect.defineMetadata('routes', [], target);
        }
        const routes = Reflect.getMetadata('routes', target);
        routes.push(route);
    }
}

export const Get: RouterDecoratorFactory = createRouterDecorator('get');
export const Post: RouterDecoratorFactory = createRouterDecorator('post');
export const Put: RouterDecoratorFactory = createRouterDecorator('put');
export const Delete: RouterDecoratorFactory = createRouterDecorator('delete');
export const Patch: RouterDecoratorFactory = createRouterDecorator('patch');
