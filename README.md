# IDBClass

**基于promise对indexedDB的简单封装**



## 一.背景

最近在阮一峰的日记里无意间浏览到了indexedDB,标准的客户端存储技术。IndexedDB 是一个基于 JavaScript 的面向对象数据库。IndexedDB 允许您存储和检索用**键**索引的对象；

### 官方介绍

IndexedDB 是一种底层 API，用于在客户端存储大量的结构化数据（也包括文件/二进制大型对象（blobs））。该 API 使用索引实现对数据的高性能搜索。虽然 [Web Storage](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API) 在存储较少量的数据很有用，但对于存储更大量的结构化数据来说力不从心。而 IndexedDB 提供了这种场景的解决方案。本页面 MDN IndexedDB 的主要引导页 - 这里，我们提供了完整的 API 参考和使用指南，浏览器支持细节，以及关键概念的一些解释的链接。



**Note:** 此特性在 [Web Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API) 中可用



**注意**：IndexedDB API是强大的，但对于简单的情况可能看起来太复杂。如果你更喜欢一个简单的API，请尝试  [localForage](https://localforage.github.io/localForage/)、[dexie.js](https://www.dexie.org/)、[PouchDB](https://pouchdb.com/)、[idb](https://www.npmjs.com/package/idb)、[idb-keyval](https://www.npmjs.com/package/idb-keyval)、[JsStore](https://jsstore.net/) 或者 [lovefield](https://github.com/google/lovefield) 之类的库，这些库使 IndexedDB 对开发者来说更加友好。



### 产生原因

indexedDB的方法都是异步的，得去成功的回调去拿值，用起来不是很方便，所以打算自己封装一下indexedDB的常用操作，目前只有class版本的。



## 二.使用方式

导入模块



### 1.初始化

| optionsName        | value              |
| ------------------ | ------------------ |
| databaseName       | 数据库名称         |
| version            | 版本               |
| objectStores       | 想要创建的对象仓库 |
| objectStoreName    | 仓库名称           |
| objectStoreOptions | 仓库选项           |
| objectStoreIndex   | 创建索引           |



```typescript
onst database = new IDBClass({
      databaseName: 'test',
      version: 2,
      objectStores: [{
        objectStoreName: 'test',
        objectStoreOptions: {
          keyPath: 'id'
        },
        objectStoreIndex: [
          { name: 'name', keyPath: 'name', options: { unique: false } },
          { name: 'email', keyPath: 'email', options: { unique: false } }
        ]
      },
      {
        objectStoreName: 'person',
        objectStoreOptions: {
          keyPath: 'id'
        },
        objectStoreIndex: [
          { name: 'name', keyPath: 'name', options: { unique: false } },
          { name: 'email', keyPath: 'email', options: { unique: false } }
        ]
      }
      ],
    })
```



### 2.使用方法进行操作

为了简单点，我使用了typedoc注释文档生成

