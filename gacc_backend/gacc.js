const express = require('express');
const sql = require('mssql');

const app = express();
const port = 3000;

// ===========================
// 1. 配置 SQL Server 连接
// ===========================
const config = {
  user: 'duoxxn7',
  password: 'qwq204320',
  server: 'localhost',
  database: 'gacc',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// ===========================
// 2. 启用跨域 & JSON 解析
// ===========================
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(express.json());

// ===========================
// 3. 测试数据库连接
// ===========================
sql.connect(config, err => {
  if (err) {
    console.error('数据库连接失败:', err);
    return;
  }
  console.log('数据库连接成功');
});

// ===========================
// 4. 查询所有用户（保持原有）
// ===========================
app.get('/user', async (req, res) => {
  try {
    const result = await sql.query('SELECT * FROM Users');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===========================
// 5. 查询所有订单（保持原有）
// ===========================
app.get('/order', async (req, res) => {
  try {
    const result = await sql.query('SELECT * FROM Orders');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===========================
// 6. 登录验证（保持原有）
// ===========================
app.post('/login', async (req, res) => {
  const { userID, password } = req.body;

  if (!userID || !password) {
    return res.status(400).json({ success: false, message: '账号和密码不能为空' });
  }

  try {
    const request = new sql.Request();
    request.input('userID', sql.VarChar(50), userID);
    request.input('password', sql.VarChar(50), password);

    const queryStr = `
      SELECT TOP 1 *
      FROM Users
      WHERE UserID = @userID AND Password = @password
    `;
    const result = await request.query(queryStr);

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
	  const role = result.recordset[0].Role
      delete user.Password;
      res.json({ success: true, user , role });
    } else {
      res.json({ success: false, message: '账号或密码错误' });
    }
  } catch (err) {
    console.error('登录查询出错:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===========================
// 7. 注册功能
// ===========================
app.post('/register', async (req, res) => {
  const { UserID, UserName, PhoneNumber, IDNumber, Password, Role } = req.body;

  // 验证逻辑...
  if (!UserName || !PhoneNumber || !IDNumber || !Password || !Role) {
    return res.status(400).json({ success: false, message: '所有字段都不能为空' });
  }
  if (!/^1[3-9]\d{9}$/.test(PhoneNumber)) {
    return res.status(400).json({ success: false, message: '请输入有效的手机号' });
  }
  if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(IDNumber)) {
    return res.status(400).json({ success: false, message: '请输入有效的身份证号' });
  }
  if (Password.length < 6 || Password.length > 20) {
    return res.status(400).json({
      success: false,
      message: '密码长度应在6-20位之间'
    });
  }
  const validRoles = ['用户','管理员'];
  if (!validRoles.includes(Role)) {
    return res.status(400).json({
      success: false,
      message: '角色必须是用户或管理员'
    });
  }

  try {
    // 检查用户名是否存在
    const checkRequest = new sql.Request();
    checkRequest.input('UserID', sql.VarChar(50), UserID);
    const checkResult = await checkRequest.query(
      'SELECT 1 FROM Users WHERE UserID = @UserID'
    );
    if (checkResult.recordset.length > 0) {
      return res.status(400).json({ success: false, message: '用户昵称已存在' });
    }

    // 检查手机号是否已注册
    const phoneCheckReq = new sql.Request();
    phoneCheckReq.input('PhoneNumber', sql.VarChar(20), PhoneNumber);
    const phoneCheck = await phoneCheckReq.query(
      'SELECT 1 FROM Users WHERE PhoneNumber = @PhoneNumber'
    );
    if (phoneCheck.recordset.length > 0) {
      return res.status(400).json({ success: false, message: '手机号已注册' });
    }

    // 插入新用户
    const insertReq = new sql.Request();
    insertReq.input('UserID',       sql.VarChar(50), UserID);
    insertReq.input('UserName',     sql.VarChar(20), UserName);
    insertReq.input('PhoneNumber',  sql.VarChar(20), PhoneNumber);
    insertReq.input('IDNumber',     sql.VarChar(20), IDNumber);
    insertReq.input('Password',     sql.VarChar(50), Password);
    insertReq.input('Role',         sql.VarChar(20), Role);

    const insertSql = `
      INSERT INTO Users (UserID, UserName, PhoneNumber, IDNumber, Password, Role)
      VALUES (@UserID, @UserName, @PhoneNumber, @IDNumber, @Password, @Role)
    `;
    await insertReq.query(insertSql);

    res.json({
      success: true,
      message: '注册成功',
      user: { UserID, PhoneNumber, Role }
    });
  } catch (err) {
    console.error('注册出错:', err);
    res.status(500).json({ success: false, message: '注册失败: ' + err.message });
  }
});

// ===========================
// 8. 获取所有商品（方案 A）
//    只返回 Items 表中的字段，不包含 SellerName
// ===========================
app.get('/items', async (req, res) => {
  try {
    const queryStr = `
      SELECT
        ItemID,
        ItemName,
        GameName,
        ItemType,
        Price,
        Stock,
        SellerID,
        IsApproved,
        ItemImage
      FROM GameItems
      WHERE IsApproved = 1
      ORDER BY 上架时间 DESC
    `;
    const result = await sql.query(queryStr);
    res.json(result.recordset);
  } catch (err) {
    console.error('获取商品列表出错:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===========================
// 9. 获取单个用户信息：供卖家名称查询使用
// ===========================
app.get('/users/:id', async (req, res) => {
  const userID = req.params.id;
  if (!userID) {
    return res.status(400).json({ error: '缺少用户 ID' });
  }
  try {
    const request = new sql.Request();
    request.input('UserID', sql.VarChar(50), userID);

    const queryStr = `
      SELECT UserID, UserName, PhoneNumber, Role, CreditLevel, TransactionHistory
      FROM Users
      WHERE UserID = @UserID
    `;
    const result = await request.query(queryStr);
    res.json(result.recordset[0] || {});
  } catch (err) {
    console.error('获取用户信息出错:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===========================
// 10. 获取用户订单（保持原有）
// ===========================
app.get('/orders', async (req, res) => {
  const buyerID = req.query.buyerID;
  if (!buyerID) {
    return res.status(400).json({ error: '缺少 buyerID 参数' });
  }
  try {
    const request = new sql.Request();
    request.input('BuyerID', sql.VarChar(50), buyerID);

    const queryStr = `
      SELECT OrderID, ItemID, OrderAmount, OrderTime, OrderStatus ,Quantity
      FROM Orders
      WHERE BuyerID = @BuyerID and OrderStatus = '已支付'
      ORDER BY OrderTime DESC
    `;
    const result = await request.query(queryStr);
    res.json(result.recordset);
  } catch (err) {
    console.error('获取订单列表出错:', err);
    res.status(500).json({ error: err.message });
  }
});
// ===========================
// 11. 获取单个商品详情（新增）
// ===========================
app.get('/items/:id', async (req, res) => {
  const itemID = req.params.id;
  if (!itemID) {
    return res.status(400).json({ error: '缺少商品 ID' });
  }
  try {
    const request = new sql.Request();
    request.input('ItemID', sql.VarChar(50), itemID);

    const queryStr = `
      SELECT 
        i.ItemID,
        i.ItemName,
        i.GameName,
        i.ItemType,
        i.Price,
        i.Stock,
        i.SellerID,
        i.IsApproved,
        i.ItemImage,
        u.UserName AS SellerName
      FROM GameItems i
      LEFT JOIN Users u ON i.SellerID = u.UserID
      WHERE i.ItemID = @ItemID
    `;
    const result = await request.query(queryStr);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: '商品不存在' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('获取商品详情出错:', err);
    res.status(500).json({ error: err.message });
  }
});
// ===========================
// 12. 搜索商品接口
// ===========================
app.get('/search', async (req, res) => {
  const { query } = req.query; // 获取查询字符串

  if (!query) {
    return res.status(400).json({ error: '查询参数不能为空' });
  }

  try {
    const request = new sql.Request();
    request.input('query', sql.VarChar(100), `%${query}%`); // 使用通配符进行模糊匹配

    const result = await request.query(`
      SELECT ItemID, ItemName, GameName, Price, ItemImage
      FROM GameItems
      WHERE ItemName LIKE @query OR GameName LIKE @query
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: '未找到匹配的商品' });
    }

    res.json(result.recordset); // 返回商品数据
  } catch (err) {
    console.error('查询失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});
// ===========================
// 13. 购物车接口
// ===========================
//13.1 添加商品到购物车
app.post('/cart/add', async (req, res) => {
  const { UserID, ItemID, Quantity ,ItemImage } = req.body;

  if (!UserID || !ItemID || !Quantity || !ItemImage) {
    return res.status(400).json({ error: '缺少必需的参数' });
  }

  try {
    const request = new sql.Request();
	
	// 在查询前先声明 @ItemID 变量
    request.input('UserID', sql.VarChar(50), UserID);
    request.input('ItemID', sql.VarChar(50), ItemID);
    request.input('Quantity', sql.Int, Quantity);
    request.input('ItemImage', sql.VarChar(255), ItemImage);
	
    // 查询商品库存
    const stockResult = await request.query(`
      SELECT Stock FROM GameItems WHERE ItemID = @ItemID
    `);
    
    if (stockResult.recordset.length === 0) {
      return res.status(404).json({ error: '商品未找到' });
    }

    const stock = stockResult.recordset[0].Stock;

    // 如果库存不足
    if (stock < Quantity) {
      return res.status(400).json({ error: '库存不足' });
    }

    // 如果库存足够，继续操作
    const query = `
      IF EXISTS (SELECT 1 FROM ShoppingCart WHERE UserID = @UserID AND ItemID = @ItemID)
      BEGIN
        UPDATE ShoppingCart
        SET Quantity = Quantity + @Quantity
        WHERE UserID = @UserID AND ItemID = @ItemID;
      END
      ELSE
      BEGIN
        INSERT INTO ShoppingCart (UserID, ItemID, Quantity , ItemImage)
        VALUES (@UserID, @ItemID, @Quantity, @ItemImage);
      END
    `;
    
    // 更新库存
    await request.query(query);
    
    // 更新商品库存（减少库存）
    const updateStockQuery = `
      UPDATE GameItems
      SET Stock = Stock - @Quantity
      WHERE ItemID = @ItemID
    `;
    
    await request.query(updateStockQuery);

    res.status(200).json({ message: '商品已添加到购物车' });
  } catch (err) {
    console.error('添加商品到购物车出错:', err);
    res.status(500).json({ error: '添加商品到购物车失败' });
  }
});

//13.2 获取购物车中的商品
app.get('/cart/:UserID', async (req, res) => {
    const UserID = req.params.UserID;

    try {
        const request = new sql.Request();
        request.input('UserID', sql.VarChar(50), UserID);
		
        const result = await request.query(`
            SELECT c.CartID, c.UserID, c.ItemID, c.Quantity, i.ItemName, i.Price ,c.ItemImage
            FROM ShoppingCart c
            INNER JOIN GameItems i ON c.ItemID = i.ItemID
            WHERE c.UserID = @UserID
        `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('获取购物车商品出错:', err);
        res.status(500).json({ error: '获取购物车商品失败' });
    }
});
//13.3 删除购物车中的商品
app.delete('/cart/:UserID/:ItemID', async (req, res) => {
  const { UserID, ItemID } = req.params;

  try {
    const request = new sql.Request();
    request.input('UserID', sql.VarChar(50), UserID);
    request.input('ItemID', sql.VarChar(50), ItemID);

    // 获取购物车中商品的数量
    const quantityResult = await request.query(`
      SELECT Quantity FROM ShoppingCart WHERE UserID = @UserID AND ItemID = @ItemID
    `);

    if (quantityResult.recordset.length === 0) {
      return res.status(404).json({ error: '购物车中没有该商品' });
    }

    const quantityInCart = quantityResult.recordset[0].Quantity;

    // 删除购物车中的商品
    await request.query(`
      DELETE FROM ShoppingCart WHERE UserID = @UserID AND ItemID = @ItemID
    `);

    // 恢复库存
    const restoreStockQuery = `
      UPDATE GameItems
      SET Stock = Stock + @Quantity
      WHERE ItemID = @ItemID
    `;
    request.input('Quantity', sql.Int, quantityInCart); // 添加 Quantity 参数
    await request.query(restoreStockQuery);

    res.status(200).json({ message: '商品已从购物车中删除' });
  } catch (err) {
    console.error('删除商品出错:', err);
    res.status(500).json({ error: '删除商品失败' });
  }
});
//13.4 清空购物车
app.delete('/cart/clear/:UserID', async (req, res) => {
  const UserID = req.params.UserID;

  try {
    const request = new sql.Request();
	request.input('UserID', sql.VarChar(50), UserID);
    // 获取购物车中所有商品的信息
    const cartItemsResult = await request.query(`
      SELECT ItemID, Quantity FROM ShoppingCart WHERE UserID = @UserID
    `);

    if (cartItemsResult.recordset.length === 0) {
      return res.status(404).json({ error: '购物车为空' });
    }

    // 恢复库存
    for (const item of cartItemsResult.recordset) {
	  const itemRequest = new sql.Request(); // 为每个商品创建新的请求
      itemRequest.input('ItemID', sql.VarChar(50), item.ItemID);
      itemRequest.input('Quantity', sql.Int, item.Quantity);
	  
      await request.query(`
        UPDATE GameItems
        SET Stock = Stock + @Quantity
        WHERE ItemID = @ItemID
      `);
    }

    // 清空购物车
    await request.query(`
      DELETE FROM ShoppingCart WHERE UserID = @UserID
    `);

    res.status(200).json({ message: '购物车已清空' });
  } catch (err) {
    console.error('清空购物车出错:', err);
    res.status(500).json({ error: '清空购物车失败' });
  }
});
// 13.5 更新购物车商品数量
app.put('/cart/:UserID/:ItemID', async (req, res) => {
  const { UserID, ItemID } = req.params;
  const { Quantity } = req.body;

  if (!Quantity || Quantity < 1) {
    return res.status(400).json({ 
      success: false,
      code: 'INVALID_QUANTITY',
      message: '数量必须大于0' 
    });
  }

  const transaction = new sql.Transaction();
  
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    // 1. 检查商品库存
    request.input('ItemID', sql.VarChar(50), ItemID);
    const stockResult = await request.query(`
      SELECT Stock FROM GameItems WHERE ItemID = @ItemID
    `);
    
    if (stockResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ 
        success: false,
        code: 'ITEM_NOT_FOUND',
        message: '商品不存在'
      });
    }

    // 2. 获取购物车当前数量
    request.input('UserID', sql.VarChar(50), UserID);
    const cartResult = await request.query(`
      SELECT Quantity FROM ShoppingCart 
      WHERE UserID = @UserID AND ItemID = @ItemID
    `);
    
    if (cartResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ 
        success: false,
        code: 'CART_ITEM_NOT_FOUND',
        message: '购物车中没有该商品'
      });
    }

    const oldQuantity = cartResult.recordset[0].Quantity;
    const quantityDifference = Quantity - oldQuantity;
    const currentStock = stockResult.recordset[0].Stock;

    // 3. 库存检查（关键修改）
    if (quantityDifference > 0) {
      if (currentStock < quantityDifference) {
        await transaction.rollback();
        return res.json({  // 注意这里返回200状态码
          success: false,
          code: 'INSUFFICIENT_STOCK',
          message: '库存不足',
          data: {
            available: currentStock,
            required: quantityDifference
          }
        });
      }
    }

    // 4. 更新购物车
    request.input('Quantity', sql.Int, Quantity);
    await request.query(`
      UPDATE ShoppingCart
      SET Quantity = @Quantity
      WHERE UserID = @UserID AND ItemID = @ItemID
    `);

    // 5. 更新库存
    if (quantityDifference !== 0) {
      request.input('QuantityDifference', sql.Int, quantityDifference);
      await request.query(`
        UPDATE GameItems
        SET Stock = Stock - @QuantityDifference
        WHERE ItemID = @ItemID
      `);
    }

    await transaction.commit();
    
    res.json({
      success: true,
      message: '更新成功',
      data: {
        newQuantity: Quantity,
        stockChange: -quantityDifference
      }
    });

  } catch (err) {
    console.error('更新出错:', err);
    
    if (transaction._aborted === false) {
      await transaction.rollback().catch(e => {
        console.error('回滚失败:', e);
      });
    }
    
    res.status(500).json({ 
      success: false,
      code: 'SERVER_ERROR',
      message: '服务器错误',
      error: err.message 
    });
  }
});
// ===========================
// 14. 商品上传接口（自动处理SellerID）
// ===========================
app.post('/items/upload', async (req, res) => {
  const { ItemName, GameName, ItemType, Price, Stock, ItemImage, SellerID } = req.body;

  // 验证商品信息
  if (!ItemName || !GameName || !ItemType || !Price || !Stock || !ItemImage || !SellerID) {
    return res.status(400).json({ error: '所有字段都是必填项' });
  }

  try {
    const request = new sql.Request();

    // 获取当前时间，作为商品的上架时间
    const currentTime = new Date();

    // 插入商品信息到 GameItems 表
    const queryStr = `
      INSERT INTO GameItems (ItemID, ItemName, GameName, ItemType, Price, Stock, SellerID, 上架时间, IsApproved, ItemImage)
      VALUES (NEWID(), @ItemName, @GameName, @ItemType, @Price, @Stock, @SellerID, @上架时间, 0, @ItemImage)
    `;

    // 插入数据
    request.input('ItemName', sql.NVarChar, ItemName);
    request.input('GameName', sql.NVarChar, GameName);
    request.input('ItemType', sql.NVarChar, ItemType);
    request.input('Price', sql.Int, Price);
    request.input('Stock', sql.Int, Stock);
    request.input('SellerID', sql.NVarChar, SellerID);
    request.input('上架时间', sql.DateTime, currentTime);
    request.input('ItemImage', sql.NVarChar, ItemImage);

    await request.query(queryStr);

    res.status(200).json({ message: '商品上传成功，请等待管理员审核' });
  } catch (err) {
    console.error('上传商品失败:', err);
    res.status(500).json({ error: '商品上传失败，稍后重试' });
  }
});
// ===========================
// 15. 管理员接口
// ===========================
// 管理员获取用户列表
app.get('/admin/users', async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query(`
      SELECT UserID, UserName, PhoneNumber, IDNumber, Role, CreditLevel 
      FROM Users
      ORDER BY UserID 
    `);
    
    res.status(200).json({
      code: 200,
      data: result.recordset,
      message: 'success'
    });
  } catch (err) {
    console.error('获取用户列表出错:', err);
    res.status(500).json({
      code: 500,
      message: '获取用户列表失败',
      error: err.message
    });
  }
});


// 管理员更新用户信息
app.put('/admin/users/:UserID', async (req, res) => {
  const { UserID } = req.params;
  const { UserName, PhoneNumber, IDNumber, Role, CreditLevel } = req.body;

  try {
    const request = new sql.Request();
    request.input('UserID', sql.VarChar(50), UserID);
    request.input('UserName', sql.VarChar(50), UserName);
    request.input('PhoneNumber', sql.VarChar(20), PhoneNumber);
    request.input('IDNumber', sql.VarChar(20), IDNumber);
    request.input('Role', sql.VarChar(20), Role);
    request.input('CreditLevel', sql.Int, CreditLevel);

    await request.query(`
      UPDATE Users
      SET 
        UserName = @UserName,
        PhoneNumber = @PhoneNumber,
        IDNumber = @IDNumber,
        Role = @Role,
        CreditLevel = @CreditLevel
      WHERE UserID = @UserID
    `);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('更新用户信息出错:', err);
    res.status(500).json({ error: '更新用户信息失败' });
  }
});

// 禁用用户
app.post('/admin/users/:UserID/disable', async (req, res) => {
  const { UserID } = req.params;
  const { reason, adminID } = req.body;

  try {
    const request = new sql.Request();
    request.input('UserID', sql.VarChar(50), UserID);
    request.input('CreditLevel', sql.Int, 0);

    await request.query(`
      UPDATE Users
      SET CreditLevel = @CreditLevel
      WHERE UserID = @UserID
    `);

    // 记录操作日志（可选）
    if (adminID) {
      await logAdminAction(adminID, 'disable-user', UserID, reason);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('禁用用户出错:', err);
    res.status(500).json({ error: '禁用用户失败' });
  }
});

// 启用用户
app.post('/admin/users/:UserID/enable', async (req, res) => {
  const { UserID } = req.params;
  const { reason, adminID } = req.body;

  try {
    const request = new sql.Request();
    request.input('UserID', sql.VarChar(50), UserID);
    request.input('CreditLevel', sql.Int, 1); // 默认启用信用等级为1

    await request.query(`
      UPDATE Users
      SET CreditLevel = @CreditLevel
      WHERE UserID = @UserID
    `);

    // 记录操作日志（可选）
    if (adminID) {
      await logAdminAction(adminID, 'enable-user', UserID, reason);
    }
	
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('启用用户出错:', err);
    res.status(500).json({ error: '启用用户失败' });
  }
});

// 获取待审核商品列表
app.get('/admin/items', async (req, res) => {
  try {
    const request = new sql.Request();
    const itemsResult = await request.query(`
      SELECT i.* 
      FROM GameItems i
      WHERE i.IsApproved = 0
      ORDER BY i.上架时间 DESC
    `);

    const sellersResult = await request.query(`
      SELECT UserID, UserName 
      FROM Users 
      WHERE UserID IN (SELECT DISTINCT SellerID FROM GameItems)
    `);
    
    res.status(200).json({
      code: 200,
      data: {
        items: itemsResult.recordset,
        sellers: sellersResult.recordset
      },
      message: 'success'
    });
  } catch (err) {
    console.error('获取商品列表出错:', err);
    res.status(500).json({
      code: 500,
      message: '获取商品列表失败',
      error: err.message
    });
  }
});
//更新商品信息
app.put('/admin/items/:ItemID', async (req, res) => {
  const { ItemID } = req.params;
  const { ItemName, GameName, ItemType, Price, Stock, ItemImage, SellerID } = req.body;

  // 增强验证逻辑
  if (!ItemName || !GameName || !ItemType || Price === undefined || Stock === undefined) {
    return res.status(400).json({ 
      code: 400,
      message: '商品名称、游戏名称、类型、价格和库存为必填项'
    });
  }

  if (isNaN(Price) || Price < 0) {
    return res.status(400).json({
      code: 400,
      message: '价格必须为有效数字且不能为负数'
    });
  }

  if (isNaN(Stock) || Stock < 0 || !Number.isInteger(Number(Stock))) {
    return res.status(400).json({
      code: 400,
      message: '库存必须为有效整数且不能为负数'
    });
  }

  try {
    const request = new sql.Request();
    
    // 1. 检查商品是否存在 - 使用参数化查询
    request.input('ItemID', sql.VarChar(50), ItemID);
    const itemExists = await request.query(
      `SELECT 1 FROM GameItems WHERE ItemID = @ItemID`
    );
    
    if (itemExists.recordset.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '商品不存在'
      });
    }

    // 2. 验证卖家（如果提供了SellerID）
    if (SellerID) {
      request.input('SellerID', sql.VarChar(50), SellerID);
      const sellerExists = await request.query(
        `SELECT 1 FROM Users WHERE UserID = @SellerID AND Role = '卖家'`
      );
      
      if (sellerExists.recordset.length === 0) {
        return res.status(400).json({
          code: 400,
          message: '指定的卖家不存在或不是卖家角色'
        });
      }
    }

    // 3. 构建更新SQL（安全的方式）
    const updateFields = [
      'ItemName = @ItemName',
      'GameName = @GameName',
      'ItemType = @ItemType',
      'Price = @Price',
      'Stock = @Stock',
      'ItemImage = @ItemImage'
    ];
    
    if (SellerID) {
      updateFields.push('SellerID = @SellerID');
    }

    // 添加所有参数
    request.input('ItemName', sql.NVarChar(100), ItemName);
    request.input('GameName', sql.NVarChar(100), GameName);
    request.input('ItemType', sql.NVarChar(50), ItemType);
    request.input('Price', sql.Decimal(10, 2), parseFloat(Price));
    request.input('Stock', sql.Int, parseInt(Stock));
    request.input('ItemImage', sql.NVarChar(500), ItemImage || null);

    // 执行更新
    const updateQuery = `
      UPDATE GameItems 
      SET ${updateFields.join(', ')}
      WHERE ItemID = @ItemID
    `;
    
    await request.query(updateQuery);

    // 4. 获取更新后的商品信息
    const updatedItem = await request.query(
      `SELECT * FROM GameItems WHERE ItemID = @ItemID`
    );

    res.status(200).json({
      code: 200,
      message: '商品信息更新成功',
      data: updatedItem.recordset[0]
    });

  } catch (err) {
    console.error('更新商品信息出错:', err);
    
    // 更详细的错误分类
    if (err.message.includes('违反约束')) {
      return res.status(400).json({
        code: 400,
        message: '数据验证失败',
        error: err.message
      });
    }
    
    res.status(500).json({
      code: 500,
      message: '更新商品信息失败',
      error: err.message
    });
  }
});

// 审核通过商品
app.post('/admin/items/:ItemID/approve', async (req, res) => {
  const { ItemID } = req.params;
  const { auditorID, auditResult, rejectReason } = req.body;

  try {
    const request = new sql.Request();
    request.input('AuditID', sql.VarChar(50), generateID()); // 生成唯一ID
    request.input('ItemID', sql.VarChar(50), ItemID);
    request.input('AuditorID', sql.VarChar(50), auditorID);
    request.input('AuditTime', sql.DateTime, new Date());
    request.input('AuditResult', sql.VarChar(20), auditResult);
    request.input('RejectReason', sql.NVarChar(sql.MAX), rejectReason);

    await request.query(`
      INSERT INTO AuditRecords (AuditID, ItemID, AuditorID, AuditTime, AuditResult, RejectReason)
      VALUES (@AuditID, @ItemID, @AuditorID, @AuditTime, @AuditResult, @RejectReason)
    `);

    // 触发器会自动更新GameItems表的IsApproved字段

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('审核商品出错:', err);
    res.status(500).json({ error: '审核商品失败' });
  }
});

// 拒绝商品上架
app.post('/admin/items/:ItemID/reject', async (req, res) => {
  const { ItemID } = req.params;
  const { auditorID, auditResult, rejectReason } = req.body;

  try {
    const request = new sql.Request();
    request.input('AuditID', sql.VarChar(50), generateID()); // 生成唯一ID
    request.input('ItemID', sql.VarChar(50), ItemID);
    request.input('AuditorID', sql.VarChar(50), auditorID);
    request.input('AuditTime', sql.DateTime, new Date());
    request.input('AuditResult', sql.VarChar(20), auditResult);
    request.input('RejectReason', sql.NVarChar(sql.MAX), rejectReason);

    await request.query(`
      INSERT INTO AuditRecords (AuditID, ItemID, AuditorID, AuditTime, AuditResult, RejectReason)
      VALUES (@AuditID, @ItemID, @AuditorID, @AuditTime, @AuditResult, @RejectReason)
    `);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('拒绝商品出错:', err);
    res.status(500).json({ error: '拒绝商品失败' });
  }
});
// 获取所有通过审核的商品
app.get('/admin/products', async (req, res) => {
  try {
    const request = new sql.Request();
    const itemsResult = await request.query(`
      SELECT * FROM GameItems
	  WHERE GameItems.IsApproved = 1
      ORDER BY 上架时间 DESC
    `);

    const sellersResult = await request.query(`
      SELECT UserID, UserName 
      FROM Users 
      WHERE UserID IN (SELECT DISTINCT SellerID FROM GameItems)
    `);
    
    res.status(200).json({
      code: 200,
      data: {
        products: itemsResult.recordset,
        sellers: sellersResult.recordset
      },
      message: 'success'
    });
  } catch (err) {
    console.error('获取商品列表出错:', err);
    res.status(500).json({
      code: 500,
      message: '获取商品列表失败',
      error: err.message
    });
  }
});

// 商品下架接口
app.post('/admin/items/:ItemID/disable', async (req, res) => {
  const { ItemID } = req.params;
  const { reason, adminID } = req.body;

  try {
    const request = new sql.Request();
    request.input('ItemID', sql.VarChar(50), ItemID);
    request.input('IsApproved', sql.Bit, 0); // 设置为未审核状态

    await request.query(`
      UPDATE GameItems
      SET IsApproved = 0
      WHERE ItemID = @ItemID
    `);

    // 记录操作日志（可选）
    if (adminID) {
      await logAdminAction(adminID, 'disable-product', ItemID, reason);
    }

    res.status(200).json({ 
      success: true,
      message: '商品已下架，如需重新上架需重新审核'
    });
  } catch (err) {
    console.error('下架商品出错:', err);
    res.status(500).json({ 
      error: '下架商品失败',
      details: err.message 
    });
  }
});
// ===========================
// 16. 订单相关接口
// ===========================

// 创建订单（多商品独立订单）
app.post('/orders/batch', async (req, res) => {
  const { BuyerID, Orders, PaymentMethod } = req.body;

  if (!BuyerID || !Orders || !Orders.length || !PaymentMethod) {
    return res.status(400).json({
      success: false,
      message: '缺少必要的订单信息'
    });
  }

  const pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);
  
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    // 方法1：使用UNION ALL批量插入（适合中小批量）
    const values = Orders.map(order => 
      `('${String(order.OrderID).substring(0,50)}', 
       '${String(BuyerID).substring(0,50)}', 
       '${String(order.ItemID).substring(0,50)}', 
       ${parseFloat(order.OrderAmount) || 0}, 
       '${new Date(order.OrderTime || new Date()).toISOString()}', 
       '待支付', 
       ${parseInt(order.Quantity) || 1})`
    ).join(',');

    const query = `
      INSERT INTO Orders (OrderID, BuyerID, ItemID, OrderAmount, OrderTime, OrderStatus, Quantity)
      VALUES ${values}
    `;

    await request.query(query);
    await transaction.commit();
    
    res.json({
      success: true,
      message: `成功创建${Orders.length}个订单`
    });
  } catch (err) {
    await transaction.rollback();
    console.error('批量创建订单出错:', err);
    res.status(500).json({
      success: false,
      message: '批量创建订单失败',
      error: err.message
    });
  }
});
// 批量更新订单状态
app.put('/orders/batch/status', async (req, res) => {
  const { OrderIDs, OrderStatus } = req.body;

  if (!OrderIDs || !OrderIDs.length || !OrderStatus) {
    return res.status(400).json({
      success: false,
      message: '缺少OrderIDs或OrderStatus参数'
    });
  }

  const transaction = new sql.Transaction();
  
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    // 构建参数化查询（避免参数名重复）
    const params = OrderIDs.map((id, index) => {
      const paramName = `id_${index}`;
      request.input(paramName, sql.NVarChar(50), String(id).substring(0, 50));
      return `@${paramName}`;
    });

    // 使用表变量方式批量更新
    const query = `
      DECLARE @OrderIDs TABLE (ID NVARCHAR(50));
      INSERT INTO @OrderIDs VALUES ${OrderIDs.map((_, i) => `(@id_${i})`).join(',')};
      
      UPDATE Orders 
      SET OrderStatus = @OrderStatus
      WHERE OrderID IN (SELECT ID FROM @OrderIDs)
    `;
    
    request.input('OrderStatus', sql.NVarChar(20), OrderStatus.substring(0, 20));
    
    const result = await request.query(query);
    await transaction.commit();
    
    res.json({
      success: true,
      affectedRows: result.rowsAffected[0],
      message: `成功更新${result.rowsAffected[0]}个订单状态`
    });
  } catch (err) {
    await transaction.rollback();
    console.error('批量更新订单状态出错:', err);
    res.status(500).json({
      success: false,
      message: '批量更新订单状态失败',
      error: err.message
    });
  }
});
// ===========================
// 17. 交易记录接口
// ===========================
// 批量更新交易状态接口
app.post('/transactions/batch', async (req, res) => {
  const { Transactions } = req.body;

  // 验证输入
  if (!Transactions || !Transactions.length) {
    return res.status(400).json({
      success: false,
      message: '缺少交易数据'
    });
  }

  const transaction = new sql.Transaction();
  
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    // 方法1：使用分块处理批量插入
    const chunkSize = 100; // 每次处理100条记录
    for (let i = 0; i < Transactions.length; i += chunkSize) {
      const chunk = Transactions.slice(i, i + chunkSize);
      
      // 构建批量插入语句
      const values = chunk.map(trx => {
        const safeTransactionID = String(trx.TransactionID).substring(0, 50);
        const safeOrderID = String(trx.OrderID).substring(0, 50);
        const safeMethod = String(trx.PaymentMethod).substring(0, 20);
        const safeStatus = String(trx.TransactionStatus).substring(0, 50);
        const time = new Date(trx.TransactionTime || new Date()).toISOString();
        
        return `('${safeTransactionID.replace(/'/g, "''")}', 
                '${safeOrderID.replace(/'/g, "''")}', 
                '${safeMethod.replace(/'/g, "''")}', 
                '${time}', 
                '${safeStatus.replace(/'/g, "''")}')`;
      }).join(',');

      // 执行批量插入
      await request.query(`
        INSERT INTO Transactions 
        (TransactionID, OrderID, PaymentMethod, TransactionTime, TransactionStatus)
        VALUES ${values}
      `);

      // 批量更新订单状态
      const statusUpdates = chunk.map(trx => 
        `WHEN '${String(trx.OrderID).substring(0,50).replace(/'/g, "''")}' THEN 
         '${trx.TransactionStatus.includes('成功') ? '已支付' : '支付失败'}'`
      ).join(' ');

      await request.query(`
        UPDATE Orders
        SET OrderStatus = CASE OrderID
          ${statusUpdates}
        END
        WHERE OrderID IN (${chunk.map(trx => `'${String(trx.OrderID).substring(0,50).replace(/'/g, "''")}'`).join(',')})
      `);
    }

    await transaction.commit();
    
    res.json({
      success: true,
      message: `成功处理${Transactions.length}条交易记录`
    });
  } catch (err) {
    console.error('批量更新交易记录出错:', err);
    
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      console.error('回滚事务失败:', rollbackErr);
    }
    
    res.status(500).json({
      success: false,
      message: '批量更新交易记录失败',
      error: err.message
    });
  } 
});

// ===========================
// 18. 购物车相关接口
// ===========================

// 清空已购买的商品
app.post('/cart/clear-purchased/:UserID', async (req, res) => {
  const { UserID } = req.params;
  const { itemIDs } = req.body;

  if (!itemIDs || !itemIDs.length) {
    return res.status(400).json({
      success: false,
      message: '缺少商品ID列表'
    });
  }

  try {
    const request = new sql.Request();
    
    // 构建IN条件
    const itemIDList = itemIDs.map((id, index) => {
      request.input(`ItemID_${index}`, sql.VarChar(50), id);
      return `@ItemID_${index}`;
    }).join(',');
    
    // 直接删除购物车中的商品（不处理库存）
    const deleteQuery = `
      DELETE FROM ShoppingCart
      WHERE UserID = @UserID AND ItemID IN (${itemIDList})
    `;
    
    request.input('UserID', sql.VarChar(50), UserID);
    await request.query(deleteQuery);
    
    res.json({
      success: true,
      message: '已清空已购买的商品'
    });
  } catch (err) {
    console.error('清空购物车商品出错:', err);
    res.status(500).json({
      success: false,
      message: '清空购物车商品失败',
      error: err.message
    });
  }
});
// 生成唯一ID的函数
function generateID() {
  return 'AUDIT_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// 记录管理员操作日志（可选）
async function logAdminAction(adminID, actionType, targetID, reason) {
  const request = new sql.Request();
  request.input('LogID', sql.VarChar(50), 'LOG_' + Date.now());
  request.input('AdminID', sql.VarChar(50), adminID);
  request.input('ActionType', sql.VarChar(50), actionType);
  request.input('TargetID', sql.VarChar(50), targetID);
  request.input('ActionTime', sql.DateTime, new Date());
  request.input('Reason', sql.NVarChar(sql.MAX), reason);

  await request.query(`
    INSERT INTO AdminLogs (LogID, AdminID, ActionType, TargetID, ActionTime, Reason)
    VALUES (@LogID, @AdminID, @ActionType, @TargetID, @ActionTime, @Reason)
  `);
}
// ===========================
// 启动服务
// ===========================
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
