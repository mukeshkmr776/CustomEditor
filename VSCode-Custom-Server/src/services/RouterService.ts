import * as Tree from '../routers/TreeRoutes';


function addRoutes (app: any, router: any) {
    app.use('/api/tree', Tree.setRoute(router));       
}

export { addRoutes }
