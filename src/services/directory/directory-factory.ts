import type {Directory} from "./directory";
import {LocalDirectory} from "./local-directory";
import {GoogleDriveDirectory} from "./gdrive-directory";
import {EchomemDirectory} from "./echomem-directory";

export const directoryFactory = (storeType: string): Directory => {
    switch(storeType) {
        case "local":
            return new LocalDirectory();
        case "google-drive":
            return new GoogleDriveDirectory();
        case "account":
            return new EchomemDirectory();
        default:
            throw new Error("invalid directory type");
    }
}