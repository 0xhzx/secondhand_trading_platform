要定义能够访问MongoDB中`user`集合（表）的`User`对象，你需要使用Mongoose库来创建一个模型。这个模型将映射到数据库中的`user`集合，并定义了可以在该集合上进行操作的文档的结构（schema）。下面是创建`User`模型的步骤：

### 1. 定义`Schema`

首先，定义一个`Schema`来描述`user`集合中文档的结构。这包括定义字段名称、数据类型以及任何特定的验证或默认值。

```javascript
// 引入mongoose模块
import mongoose from 'mongoose';

// 定义User的Schema
const userSchema = new mongoose.Schema({
  user_name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // 可以根据需要添加更多字段
}, { timestamps: true }); // timestamps选项会自动添加createdAt和updatedAt字段
```

### 2. 创建模型

接下来，使用定义好的`Schema`来创建一个Mongoose模型。模型是一个构造函数，你可以用它来创建和读取特定集合的文档。

```javascript
// 创建User模型
const User = mongoose.model('User', userSchema);
```

这里，`mongoose.model`的第一个参数是模型的名称。Mongoose会自动查找名称为模型名称小写且复数形式的集合，即在这个例子中会查找`users`集合。如果你的集合名称不遵循这个命名约定，你可以通过`Schema`的第三个参数显式指定集合名称：

```javascript
const User = mongoose.model('User', userSchema, 'user'); // 明确指定集合名称为'user'
```

### 3. 使用模型

现在，你可以使用`User`模型来访问数据库中的`user`集合了。例如，你可以创建新用户、查找现有用户或执行其他操作：

```javascript
// 创建一个新用户
const newUser = new User({
  user_name: 'john_doe',
  email: 'john@example.com',
  password: 'securepassword123',
});

newUser.save()
  .then(() => console.log('User created successfully.'))
  .catch(error => console.error('Error creating user:', error));

// 查找一个用户
User.findOne({ user_name: 'john_doe' })
  .then(user => console.log(user))
  .catch(error => console.error('Error fetching user:', error));
```

通过定义模型，你就可以非常容易地与MongoDB中的`user`集合交互了。

## MongoDB Type
import { Binary , BSON , BSONRegExp , BSONSymbol , BSONType , Code , DBRef , Decimal128 , deserialize , Document , Double , Int32 , Long , MaxKey , MinKey , ObjectId , serialize , Timestamp , UUID } from 'bson';

**Not sure about whta should use in mongoose, but here is the list of types that can be used in MongoDB.**