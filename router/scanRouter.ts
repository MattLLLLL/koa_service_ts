import fs from 'fs';
import path from 'path';
import KoaRouter from 'koa-router';
import { Route, Actions } from '../src/common/decorator/Controller'
import Headers from '../action/Headers'

function scanController(dirPath: string, router: KoaRouter): void {
    if (!fs.existsSync(dirPath)) {
        console.warn(`目錄不存在！${dirPath}`);
        return;
    }
    const fileNames: string[] = fs.readdirSync(dirPath);

    for (const name of fileNames) {
        const curPath: string = path.join(dirPath, name);
        if (fs.statSync(curPath).isDirectory()) {
            scanController(curPath, router);
            continue;
        }
        if (!(/(.js|.jsx|.ts|.tsx)$/.test(name))) {
            continue;
        }
        try {
            const scannedModule = require(curPath);
            const controller = scannedModule.default || scannedModule;
            const isController: boolean = Reflect.hasMetadata('basePath', controller);
            const hasRoutes: boolean = Reflect.hasMetadata('routes', controller);
            if (isController && hasRoutes) {
                const basePath: string = Reflect.getMetadata('basePath', controller);
                const routes: Route[] = Reflect.getMetadata('routes', controller);
                let curPath: string, curRouteHandler;
                routes.forEach((route: Route) => {
                    curPath = path.posix.join('/', basePath, route.path);
                    curRouteHandler = controller[route.propertyKey];

                    switch (route.method) {
                        case 'get':
                            route.actions?.forEach(action => {
                                if (action === Actions.Token) router['get'](curPath, Headers.verifyToken);
                                if (action === Actions.Merchant) router['get'](curPath, Headers.merchantRequired);
                            })
                            router['get'](curPath, curRouteHandler);
                            break
                        case 'post':
                            route.actions?.forEach(action => {
                                if (action === Actions.Token) router['post'](curPath, Headers.verifyToken);
                                if (action === Actions.Merchant) router['post'](curPath, Headers.merchantRequired);
                            })
                            router['post'](curPath, curRouteHandler);
                            break
                        case 'put':
                            route.actions?.forEach(action => {
                                if (action === Actions.Token) router['put'](curPath, Headers.verifyToken);
                                if (action === Actions.Merchant) router['put'](curPath, Headers.merchantRequired);
                            })
                            router['put'](curPath, curRouteHandler);
                            break
                        case 'delete':
                            route.actions?.forEach(action => {
                                if (action === Actions.Token) router['delete'](curPath, Headers.verifyToken);
                                if (action === Actions.Merchant) router['delete'](curPath, Headers.merchantRequired);
                            })
                            router['delete'](curPath, curRouteHandler);
                            break
                        case 'patch':
                            route.actions?.forEach(action => {
                                if (action === Actions.Token) router['patch'](curPath, Headers.verifyToken);
                                if (action === Actions.Merchant) router['patch'](curPath, Headers.merchantRequired);
                            })
                            router['patch'](curPath, curRouteHandler);
                            break
                    }

                    console.info(`router: ${controller.name}.${route.propertyKey} [${route.method}] ${curPath}`)
                })
            }
        } catch (error: any) {
            console.warn('檔案讀取失敗！', curPath, error);
        }

    }
}

export default class ScanRouter extends KoaRouter {
    constructor(opt?: KoaRouter.IRouterOptions) {
        super(opt);
    }

    scan(scanDir: string | string[]) {
        if (typeof scanDir === 'string') {
            scanController(scanDir, this);
        } else if (scanDir instanceof Array) {
            scanDir.forEach(async (dir: string) => {
                scanController(dir, this);
            });
        }
    }
}