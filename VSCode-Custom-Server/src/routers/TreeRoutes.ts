import { isEmpty } from 'lodash';

import * as TreeService from '../services/TreeService';

function setRoute(router: any) {
    router.post('/getTree', function (req: any, res: any) {
        let { directoryPath } = req.body;
        if(!isEmpty(directoryPath)) {
            let data = TreeService.getTree(directoryPath);
            if(data === null) {
                res.status(404).send(`No Directory/File(${directoryPath}) found. Please give correct path.`);
            } else {
                res.send(data);
            }
        } else {
            res.status(400).send('Directory/File path missing.');
        }
    });

    router.post('/getFileContent', function (req: any, res: any) {
        let file = req.body;
        if(file && file.type && file.type === 'file') {
            if(!isEmpty(file['name']) && !isEmpty(file['path'])) {
                TreeService.getFileContent(res, file);
            } else {
                file.errorMessage = 'One or more mandatory parameters[name, path] of file missing.';
                res.status(400).send(file);
            }
        } else {
            file.errorMessage = 'Invalid/Missing File type.';
            res.status(400).send(file);
        }
    });

    router.post('/saveFileContent', function (req: any, res: any) {
        let file = req.body;
        if(file && file.type && file.type === 'file') {
            if(!isEmpty(file['name']) && !isEmpty(file['path']) && (typeof file.content === 'string')) {
                TreeService.saveFileContent(res, file);
            } else {
                file.errorMessage = 'One or more mandatory parameters[type, path, content] of file missing.';
                file.content = '';
                res.status(400).send(file);
            }
        } else {
            file.errorMessage = 'Invalid/Missing File type.';
            file.content = '';
            res.status(400).send(file);
        }
    });

    router.post('/checkIfExistOrNot', function (req: any, res: any) {
        let { itemPath } = req.body;
        if(!isEmpty(itemPath)) {
                TreeService.checkIfExistOrNot(res, itemPath);
        } else {
            const errorMessage = 'Missing path for folder/file.';
            res.status(400).send({ errorMessage });
        }
    });

    return router;
}

export { setRoute }