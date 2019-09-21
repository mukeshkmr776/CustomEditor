import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';

const dirTree = require("directory-tree");

// const dirname = "/home/mukesh/Desktop/test/own-editor-web/directory-test";

function mergeExtraKeys(item: any) {
    item['isOpened'] = false

    if (item['children']) {
        item.children.map((i: any) => mergeExtraKeys(i))
    }

    return item;
}

function transformTypes(item: any) {
    if (item.type === 'directory') {
        item.type = 'folder';
        item.children.map((i: any) => transformTypes(i));
    } else if (item.type === 'file') {
        switch (item.extension) {
            case '.js':
                item.iconType = 'javascript';
                item.editorType = 'javascript';
                break;
            case '.json':
                item.iconType = 'json';
                item.editorType = 'json';
                break;
            case '.sh':
                item.iconType = 'shell';
                item.editorType = 'shell';
                break;
            case '.ksh':
                item.iconType = 'shell';
                item.editorType = 'shell';
                break;
            case '.css':
                item.iconType = 'css';
                item.editorType = 'css';
                break;
            case '.less':
                item.iconType = 'less';
                item.editorType = 'css';
                break;
            case '.html':
                item.iconType = 'html';
                item.editorType = 'html';
                break;
            case '.ts':
                item.iconType = 'typescript';
                item.editorType = 'typescript';
                break;
            case '.png':
                item.iconType = 'image';
                item.editorType = 'unknown';
                break;
            case '.jpg':
                item.iconType = 'image';
                item.editorType = 'unknown';
                break;
            case '.jpeg':
                item.iconType = 'image';
                item.editorType = 'unknown';
                break;
            case '.py':
                item.iconType = 'python';
                item.editorType = 'python';
                break;
            case '.gz':
                item.iconType = 'zip';
                item.editorType = 'unknown';
                break;
            case '.tar':
                item.iconType = 'zip';
                item.editorType = 'unknown';
                break;
            case '.tar':
                item.iconType = 'zip';
                item.editorType = 'unknown';
                break;
            case '.txt':
                item.iconType = 'file';
                item.editorType = 'text/plain';
                break;
            case '.log':
                item.iconType = 'file';
                item.editorType = 'text/plain';
                break;
            case '.map':
                    item.iconType = 'file';
                    item.editorType = 'text/plain';
                    break;
            default: {
                if (item.name.includes('.log.')) { // Handling special case of logs. Log files can be numbered.
                    item.iconType = 'file';
                    item.editorType = 'text/plain';
                } else {
                    item.iconType = 'file'; // If file not mapped, the treat it as file.
                    item.editorType = 'unknown';
                }
            }
        }
    }
    return item;
}

function sortDirectory(item: any) {
    if (item.type === 'directory' && item.children.length > 0) {
        item.children = _.sortBy(item.children, ['type', 'name']);
        item.children.map((i: any) => sortDirectory(i));
    }
    return item;
}

function getTree(dirPath: any) {

    dirPath = path.resolve(dirPath);

    let output = dirTree(dirPath, {
        exclude: /(node_modules|\.git|\.cache|\.bin)/
    });

    // if directory doesn't exists, it returns null
    if (output === null) {
        return null;
    }

    let data = mergeExtraKeys(output);

    data = sortDirectory(data);
    data = transformTypes(data);
    return data;
}

function getFileContent(res: any, file: any) {
    fs.readFile(file.path, 'utf8', (err, data) => {
        if (err) {
            if (err.code && err.code === 'ENOENT') {
                file.errorMessage = 'File not found. Please refresh your directory tree to see updated list of files.';
                res.status(404).send(file);
            } else {
                file.errorMessage = err.message;
                res.status(404).send(file);
            }
        } else {
            file.data = data.toString();
            res.status(200).send(file);
        }
    });
}

function saveFileContent(res: any, file: any) {
    fs.writeFile(file.path, file.content, 'utf8', (err: any) => {
        if (err) {
            file.content = '';
            file.errorMessage = err && err.message ? err.message : err;
            res.status(500).send(file);
            console.log(err);
        } else {
            file.content = '';
            res.status(201).send(file);
        }
    });
}

function checkIfExistOrNot( res: any, itemPath: any) {
    fs.stat(itemPath, (err, stat) => {
        if(!err) {
            res.status(200).send();
        } else {
            res.status(400).send({errorMessage: `folder/file doesn't exits. Please verify the path.`});
        }
    })
}

export {
    getTree,
    getFileContent,
    saveFileContent,
    checkIfExistOrNot
}