declare type Index={
  name: string,
  keyPath: string | Iterable<string>, 
  options?: IDBIndexParameters
}
declare type StoreItem={
  objectStoreName:string,
  objectStoreOptions?:IDBObjectStoreParameters,
  objectStoreIndex?:Index[],
}
declare interface Options{
  databaseName: string,
  version?: number,
  objectStores:StoreItem[],
}

declare interface IDBRequest{
  onupgradeneeded:((this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any)|null
}

declare interface EventTarget{
  result:any
}

declare interface IDBCursor{
  value:any
}