class File{
    isFolder; //boolean
    subFolders = [];
    content = {};
    name;

    constructor(name, isFolder, content){
        this.name = name;
        this.isFolder = isFolder;
        this.content = content;
    }
}


export default class FileSystem {
    fs;

    constructor(data){
        if(Object.keys(data).length === 0){
            //empty obj
            this.fs = new File('/', true);
        } else {        
            this.fs = data;
        }
    }
    
    fsToString(){
        return JSON.stringify(this.fs);
    }

    stringToPaths(pathString){
        if(pathString === '' || pathString === '/'){
            return [];
        } else {
            const splitPaths = pathString.split('/');
            splitPaths.shift(); //get rid of the empty space first element 
            return splitPaths;
        }
    }

    treeNavigate(subPaths, folderPtr = this.fs){
        if(subPaths.length === 0){
           return folderPtr; 
        }
        // /home/test
        const subFolder = folderPtr.subFolders.filter((sf)=>{
            return sf.name === subPaths[0];
        })

        subPaths.shift()

        if(subPaths.length > 0){
            return this.treeNavigate(subPaths, subFolder[0]);
        } else {
            return subFolder[0];
        }
    }

    ls(path){
        const subPaths = this.stringToPaths(path)
        const folder = this.treeNavigate(subPaths);
        if(folder.subFolders.length > 0){
            folder.subFolders.forEach(item => {
                var formattedString = '';
                formattedString += item.isFolder ? 'Folder' : 'File';
                formattedString += ' ' + item.name; 
                console.log(formattedString);
            });
        } else {
            console.log('Dir is empty');
        }
    }

    mkdir(path, dirName){
        const subPaths = this.stringToPaths(path)
        let folder = this.treeNavigate(subPaths);
        const newFolder = new File(dirName, true);
        folder.subFolders.push(newFolder);
        console.log('Created Folder ' + dirName);
    }

    touch(path, fileName, content){
        const subPaths = this.stringToPaths(path)
        let folder = this.treeNavigate(subPaths);
        const newFile = new File(fileName, false, content);
        folder.subFolders.push(newFile);
        console.log('Created File ' + fileName);
    }

    cat(path, fileName){
        const subPaths = this.stringToPaths(path + '/' + fileName)
        let found = this.treeNavigate(subPaths);
        if(found && !found.isFolder){
            console.log('-----------------------------------------------')
            console.log(found.content)
            console.log('-----------------------------------------------')
        } else {
            console.log('Could not find file')
        }
    }

    tree(path){
        const subPaths = this.stringToPaths(path)
        const folder = this.treeNavigate(subPaths);

        let prefix = '';

        if(folder){        
            function recursiveTree(folder, prefix){
                console.log(prefix + '|- ' + folder.name)
                folder.subFolders.forEach((item)=>{
                    if(item.isFolder){
                        recursiveTree(item, prefix + '| ');
                    } else {
                        console.log(prefix + ' |- ', item.name)
                    }
                })
            }

            recursiveTree(folder, prefix)
        } else {
            console.log('Did not find ', path)
        }

    }

    deleteFile(path, fileName){
        const subPaths = this.stringToPaths(path)
        const folder = this.treeNavigate(subPaths);
        if(folder.subFolders.length > 0){
            folder.subFolders = folder.subFolders.filter((sf)=>{
                return sf.name !== fileName;
            })
        }

    }

    exists(path){
        const subPaths = this.stringToPaths(path);
        let found = this.treeNavigate(subPaths);
        return found;
    }

    fileExists(path){
        const found = this.exists(path);
        return (found && !found.isFolder);
    }

    folderExists(path){
        const found = this.exists(path);
        return (found && found.isFolder);
    }

}