# awesome-tree

为项目生成一个 Markdown 文件/文件夹结构

## 用法

### 下载：

```BASH
  npm i awesome-tree -g
```

#### OR   

```BASH
  yarn add awesome-tree -g
```

### 使用:

```BASH
awesome <path>
```

默认为当前路径

其中可以配置 `.awesomeignore` 文件, 可用于配置您想排除的文件或者目录, 书写格式与 `.gitignore` 文件类似；

而 `.awesome.config.json` 参照如下，

```json
{
  "ignore": [],
  "transform": {
    "folder": "文件夹"
  }
}
```

* `ignore`字段为字符串类型的数组，可以写入您想排除的文件或者目录，

* `transform`字段可以对您想转换或者替换的字段进行补充说明
  

但是很可惜，命令行中的操作目前还不多，如果有需求，可以留下issue，我会在之后，尽快补充。

----
由于之前提交到npm的时候，觉得这个插件应该是不会被注意到，没有规范书写使用文档，所以在这里向之前下载过的50多位同学说一声抱歉。   
同样，也非常欢迎各位多多提出宝贵意见。
