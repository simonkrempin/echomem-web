import {Directory} from "./directory";
import {goto} from "$app/navigation";
import Cookies from "js-cookie";

export class GoogleDriveDirectory extends Directory {
    async connectToDirectory() {
        Cookies.set("store-type", "google-drive")
        await goto("/explorer");
    }
}