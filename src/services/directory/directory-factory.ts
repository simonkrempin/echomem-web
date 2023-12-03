import type {Directory} from "./directory";
import {LocalDirectory} from "./local-directory";
import {GoogleDriveDirectory} from "./gdrive-directory";
import {EchomemDirectory} from "./echomem-directory";

let _directory: Directory | undefined;

export const directoryFactory = (storeType: string): Directory => {
    switch(storeType) {
        case "local":
            _directory = new LocalDirectory();
            return _directory;
        case "google-drive":
            _directory = new GoogleDriveDirectory();
            return _directory
        case "account":
            _directory = new EchomemDirectory();
            return _directory;
        default:
            throw new Error("invalid directory type");
    }
}

export const getDirectory = () => {
    // if (!_directory) {
    //     throw new Error("Directory was not configured yet, please call the directory factory");
    // }

    return _directory;
}