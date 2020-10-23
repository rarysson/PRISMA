import Dexie from "dexie";

const db = new Dexie("nets_db");

db.version(1).stores({ nets: "&name" });
db.version(2).stores({ configs: "&name" });

export default db;
