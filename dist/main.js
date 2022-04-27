var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class IDBClass {
    constructor(o) {
        this.o = o;
        //先调用一下生成仓库对象
        this.getDb();
    }
    /**
     * @async
     * @returns IDBDatabase
     * @description 异步方法，用来获取数据库
     */
    getDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const openRequest = this.getRequest();
            return new Promise((resolve, reject) => {
                let db;
                openRequest.onupgradeneeded = (ev) => {
                    db = ev.target.result;
                    if (db.version) {
                        this.o.objectStores.forEach(v => {
                            var _a;
                            const objectStore = db.createObjectStore(v.objectStoreName, v.objectStoreOptions);
                            (_a = v.objectStoreIndex) === null || _a === void 0 ? void 0 : _a.forEach(v => {
                                objectStore.createIndex(v.name, v.keyPath, v.options);
                            });
                        });
                    }
                };
                openRequest.onsuccess = (ev) => {
                    if (ev.target.result) {
                        db = ev.target.result;
                    }
                    resolve(db);
                };
                openRequest.onerror = (ev) => {
                    reject('数据库连接失败');
                };
            });
        });
    }
    /**
     *
     * @returns IDBRequest
     * @description 同步方法,用来获取数据库连接请求
     */
    getRequest() {
        let indexedDB = window.indexedDB; /* ((window as any).indexedDB =
            (window as any).indexedDB ||
            (window as any).mozIndexedDB ||
            (window as any).webkitIndexedDB ||
            (window as any).msIndexedDB); */
        if (!indexedDB) {
            alert('你的浏览器不支持indexedDB');
            throw Error('你的客户端不支持indexedDB');
        }
        return indexedDB.open(this.o.databaseName, this.o.version);
    }
    /**
     * @async
     * @param StoreNames 仓库名，或仓库名数组
     * @returns IDBObjectStore or IDBObjectStore[]
     * @description 获取事务objectStore
     */
    getObjectStores(StoreNames) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDb();
            return new Promise((resolve, reject) => {
                let objectStores = {};
                let objectStoreNameList = this.o.objectStores.map(v => {
                    return v.objectStoreName;
                });
                const transaction = db.transaction(objectStoreNameList, 'readwrite');
                if (typeof StoreNames == 'string') {
                    objectStores = transaction.objectStore(StoreNames);
                    resolve(objectStores);
                }
                else {
                    StoreNames.forEach((v) => {
                        objectStores[v] = transaction.objectStore(v);
                    });
                    resolve(objectStores);
                }
            });
        });
    }
    /**
     * @async
     * @param storeName 仓库名
     * @param data 添加的数据对象
     * @returns Boolean
     * @description 用来添加单个数据
     */
    add(storeName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStores = yield this.getObjectStores(storeName);
            return new Promise((resolve, reject) => {
                const request = objectStores.add(data);
                request.onerror = () => reject(false);
                request.onsuccess = () => resolve(true);
            });
        });
    }
    /**
     * @async
     * @param storeName 仓库名
     * @param data 添加的数据对象数组
     * @returns Boolean
     * @description 批量添加数据
     */
    addMany(storeName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStores = yield this.getObjectStores(storeName);
            return new Promise((resolve, reject) => {
                data.forEach(v => {
                    const request = objectStores.add(v);
                    request.onerror = () => reject(false);
                    request.onsuccess = () => resolve(true);
                });
            });
        });
    }
    /**
     * @async
     * @param storeName 仓库名
     * @param key 主键值
     * @returns 数据对象
     * @description 通过主键查找
     */
    get(storeName, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStores = yield this.getObjectStores(storeName);
            return new Promise((resolve, reject) => {
                const request = objectStores.get(key);
                request.onerror = () => reject(false);
                request.onsuccess = (ev) => { var _a; return resolve((_a = ev.target) === null || _a === void 0 ? void 0 : _a.result); };
            });
        });
    }
    /**
     * @async
     * @param storeName 仓库名
     * @returns Promise<boolean|object[]>
     * @description 获取当前仓库全部数据
     */
    findAll(storeName) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStores = yield this.getObjectStores(storeName);
            return new Promise((resolve, reject) => {
                const request = objectStores.openCursor();
                console.log(request);
                //创建数组保存数据
                let list = [];
                request.onerror = () => reject(false);
                request.onsuccess = (ev) => {
                    var _a;
                    let cursor = (_a = ev.target) === null || _a === void 0 ? void 0 : _a.result;
                    if (cursor) {
                        list.push(cursor.value);
                        //遍历
                        cursor.continue();
                    }
                    else {
                        resolve(list);
                    }
                };
            });
        });
    }
    /**
     * @async
     * @param storeName 仓库名
     * @param indexName 索引名
     * @param indexValue 索引值
     * @returns Promise<boolean|object>
     * @description 通过索引查找
     */
    getByIndex(storeName, indexName, indexValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStores = yield this.getObjectStores(storeName);
            return new Promise((resolve, reject) => {
                const request = objectStores.index(indexName).get(indexValue);
                request.onerror = () => reject(false);
                request.onsuccess = (ev) => { var _a; return resolve((_a = ev.target) === null || _a === void 0 ? void 0 : _a.result); };
            });
        });
    }
    /**
     * @async
     * @param storeName 仓库名
     * @param indexName 索引名
     * @param indexValue 索引值
     * @param count 数目
     * @returns Promise<boolean|object>
     * @description 通过索引查找指定条数的记录
     */
    findByIndex(storeName, indexName, indexValue, count) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStores = yield this.getObjectStores(storeName);
            return new Promise((resolve, reject) => {
                const request = objectStores.index(indexName).getAll(indexValue, count);
                request.onerror = () => reject(false);
                request.onsuccess = (ev) => { var _a; return resolve((_a = ev.target) === null || _a === void 0 ? void 0 : _a.result); };
            });
        });
    }
    /**
     * @async
     * @param storeName 仓库名
     * @param indexName 索引名
     * @param indexValue 索引值
     * @returns Promise<boolean|object[]>
     * @description 通过索引及游标查询,查询全部符合条件的数据
     */
    getByIndexCursor(storeName, indexName, indexValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStore = yield this.getObjectStores(storeName);
            return new Promise((resolve, reject) => {
                const request = objectStore.index(indexName).openCursor(IDBKeyRange.only(indexValue));
                const list = [];
                request.onerror = () => reject(false);
                request.onsuccess = (ev) => {
                    var _a;
                    let cursor = (_a = ev.target) === null || _a === void 0 ? void 0 : _a.result;
                    if (cursor) {
                        list.push(cursor.value);
                        cursor.continue();
                    }
                    else {
                        resolve(list);
                    }
                };
            });
        });
    }
    /**
     * @async
     * @param storeName 仓库名
     * @param indexName 索引名
     * @param indexValue 索引值
     * @param page 页码
     * @param pageSize 当前页数目
     * @returns Promise<boolean|object[]>
     * @description 分页查找
     */
    PageByIndexCursor(storeName, indexName, indexValue, page = 0, pageSize = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStore = yield this.getObjectStores(storeName);
            return new Promise((resolve, reject) => {
                const request = objectStore.index(indexName).openCursor(IDBKeyRange.only(indexValue));
                const list = [];
                let counter = 0;
                let advanced = true;
                request.onerror = () => reject(false);
                request.onsuccess = (ev) => {
                    var _a;
                    let cursor = (_a = ev.target) === null || _a === void 0 ? void 0 : _a.result;
                    //判断是否需要跳过
                    if (page > 1 && advanced) {
                        advanced = false;
                        //前进多少条
                        cursor.advance((page - 1) * pageSize);
                        return;
                    }
                    if (cursor) {
                        list.push(cursor.value);
                        counter++;
                        if (counter < pageSize) {
                            cursor.continue();
                        }
                        else {
                            cursor = null;
                            resolve(list);
                        }
                    }
                    else {
                        resolve(list);
                    }
                };
            });
        });
    }
    /**
     * @async
     * @param storeName 仓库名
     * @param page 页码
     * @param pageSize 当前页数目
     * @returns Promise<boolean|object[]>
     * @description 分页查找全部数据
     */
    page(storeName, page = 0, pageSize = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStore = yield this.getObjectStores(storeName);
            return new Promise((resolve, reject) => {
                const request = objectStore.openCursor();
                const list = [];
                let counter = 0;
                let advanced = true;
                request.onerror = () => reject(false);
                request.onsuccess = (ev) => {
                    let cursor = ev.target.result;
                    if (page > 1 && advanced) {
                        advanced = false;
                        cursor === null || cursor === void 0 ? void 0 : cursor.advance((page - 1) * pageSize);
                        return;
                    }
                    if (cursor) {
                        list.push(cursor.value);
                        counter++;
                        if (counter < pageSize) {
                            cursor.continue();
                        }
                        else {
                            cursor = null;
                            resolve(list);
                        }
                    }
                    else {
                        resolve(list);
                    }
                };
            });
        });
    }
    /**
     * @async
     * @param storeName 仓库名
     * @param data 数据对象 注意：一定要包含主键
     * @returns Promise<boolean>
     * @description 通过主键更新数据，数据对象中一定要包含主键
     */
    put(storeName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStore = yield this.getObjectStores(storeName);
            return new Promise((resolve, reject) => {
                const request = objectStore.put(data);
                request.onerror = () => reject(false);
                request.onsuccess = () => resolve(true);
            });
        });
    }
    /**
     * @async
     * @param storeName 仓库名
     * @param indexName 索引名
     * @param indexValue 索引值
     * @param data 数据对象，建议不包含主键
     * @param updateAll 是否更新所有匹配
     * @returns Promise<boolean>
     * @description 通过索引批量更新
     */
    putByIndexCursor(storeName, indexName, indexValue, data, updateAll = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStore = yield this.getObjectStores(storeName);
            return new Promise((resolve, reject) => {
                const request = objectStore.index(indexName).openCursor(IDBKeyRange.only(indexValue));
                request.onerror = () => reject(false);
                request.onsuccess = (ev) => {
                    const cursor = ev.target.result;
                    if (cursor) {
                        //保存旧值
                        let Value = cursor.value;
                        let keys = Object.getOwnPropertyNames(data);
                        for (let key in Value) {
                            if (keys.includes(key)) {
                                Value[key] = data[key];
                            }
                        }
                        const updateRequest = cursor.update(Value);
                        updateRequest.onerror = () => {
                            console.log('单个更新失败');
                        };
                        if (updateAll) {
                            cursor.continue();
                        }
                    }
                    else {
                        resolve(true);
                    }
                };
            });
        });
    }
    /**
     * @async
     * @param storeName 仓库名
     * @param key 主键值
     * @returns Promise<boolean>
     * @description 通过主键删除
     */
    delete(storeName, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStore = yield this.getObjectStores(storeName);
            return new Promise((resolve, reject) => {
                const request = objectStore.delete(key);
                request.onerror = () => reject(false);
                request.onsuccess = () => resolve(true);
            });
        });
    }
    /**
     * @async
     * @param storeName 仓库名
     * @param indexName 索引名
     * @param indexValue 索引值
     * @param deleteAll 是否删除全部，默认false
     * @returns Promise<boolean>
     * @description 通过索引删除数据，默认删除匹配的第一条
     */
    deleteByIndex(storeName, indexName, indexValue, deleteAll = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStore = yield this.getObjectStores(storeName);
            return new Promise((resolve, reject) => {
                const request = objectStore.index(indexName).openCursor(IDBKeyRange.only(indexValue));
                request.onerror = () => reject(false);
                request.onsuccess = (ev) => {
                    var _a;
                    let cursor = (_a = ev.target) === null || _a === void 0 ? void 0 : _a.result;
                    if (cursor) {
                        const deleteRequest = cursor.delete();
                        if (deleteAll) {
                            cursor.continue();
                        }
                        deleteRequest.onerror = () => {
                            console.log('删除单个失败');
                        };
                    }
                    else {
                        resolve(true);
                    }
                };
            });
        });
    }
    /**
     * @description 关闭数据库
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDb();
            db.close();
            console.log('数据库已关闭');
        });
    }
    /**
     * @async
     * @returns Promise<boolean>
     * @description 删库跑路
     */
    deleteDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteRequest = window.indexedDB.deleteDatabase(this.o.databaseName);
            return new Promise((resolve, reject) => {
                deleteRequest.onerror = () => reject(false);
                deleteRequest.onsuccess = () => {
                    console.log(`${this.o.databaseName}数据库删除成功`);
                    resolve(true);
                };
            });
        });
    }
}
