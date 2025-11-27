# 用户通知表结构设计

## 表名：user_notification

### Go Struct 定义

```go
type UserNotification struct {
    Id          int       `json:"id" form:"id" gorm:"primaryKey;autoIncrement"`           // 通知ID
    UserId      int       `json:"user_id" form:"user_id" gorm:"index;not null"`         // 用户ID
    Title       string    `json:"title" form:"title" gorm:"type:varchar(255);not null"` // 通知标题
    Content     string    `json:"content" form:"content" gorm:"type:text"`              // 通知内容
    Type        string    `json:"type" form:"type" gorm:"type:varchar(50);index"`       // 通知类型（用于区分不同类型的事件）
    IsRead      int8      `json:"is_read" form:"is_read" gorm:"default:0;index"`        // 是否已读 0:未读 1:已读
    Priority    int8      `json:"priority" form:"priority" gorm:"default:0"`            // 优先级 0:普通 1:重要 2:紧急
    Status      int8      `json:"status" form:"status" gorm:"default:1"`                 // 状态 1:有效 0:已删除
    ReadTime    *time.Time `json:"read_time" form:"read_time" gorm:"type:datetime"`     // 阅读时间
    CreateTime  time.Time `json:"create_time" form:"create_time" gorm:"type:datetime;default:CURRENT_TIMESTAMP"` // 创建时间
    UpdateTime  time.Time `json:"update_time" form:"update_time" gorm:"type:datetime;default:CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"` // 更新时间
}
```

### MySQL 建表语句

```sql
CREATE TABLE `user_notification` (
    `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '通知ID',
    `user_id` INT(11) NOT NULL COMMENT '用户ID',
    `title` VARCHAR(255) NOT NULL COMMENT '通知标题',
    `content` TEXT COMMENT '通知内容',
    `type` VARCHAR(50) DEFAULT NULL COMMENT '通知类型（用于区分不同类型的事件）',
    `is_read` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已读 0:未读 1:已读',
    `priority` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '优先级 0:普通 1:重要 2:紧急',
    `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态 1:有效 0:已删除',
    `read_time` DATETIME DEFAULT NULL COMMENT '阅读时间',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_is_read` (`is_read`),
    KEY `idx_type` (`type`),
    KEY `idx_user_read` (`user_id`, `is_read`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户通知表';
```

### 字段说明

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| id | INT | 通知ID | 主键，自增 |
| user_id | INT | 用户ID | 外键，关联用户表，已建立索引 |
| title | VARCHAR(255) | 通知标题 | 必填，通知的简短标题 |
| content | TEXT | 通知内容 | 可选，详细的通知内容 |
| type | VARCHAR(50) | 通知类型 | 可选，用于区分不同类型的事件（如：approval、task、system等） |
| is_read | TINYINT(1) | 是否已读 | 0:未读，1:已读，默认0，已建立索引 |
| priority | TINYINT(1) | 优先级 | 0:普通，1:重要，2:紧急，默认0 |
| status | TINYINT(1) | 状态 | 1:有效，0:已删除，默认1 |
| read_time | DATETIME | 阅读时间 | 可选，用户阅读通知的时间 |
| create_time | DATETIME | 创建时间 | 自动设置，通知创建时间 |
| update_time | DATETIME | 更新时间 | 自动更新，通知最后更新时间 |

### 索引设计

1. **主键索引**：`id` - 用于唯一标识通知
2. **用户ID索引**：`idx_user_id` - 用于快速查询某个用户的所有通知
3. **已读状态索引**：`idx_is_read` - 用于快速筛选已读/未读通知
4. **类型索引**：`idx_type` - 用于按类型筛选通知
5. **复合索引**：`idx_user_read` - 用于快速查询某个用户的已读/未读通知
6. **时间索引**：`idx_create_time` - 用于按时间排序和筛选

### 使用场景示例

1. **查询用户未读通知数量**：
   ```sql
   SELECT COUNT(*) FROM user_notification 
   WHERE user_id = ? AND is_read = 0 AND status = 1;
   ```

2. **查询用户所有通知（分页）**：
   ```sql
   SELECT * FROM user_notification 
   WHERE user_id = ? AND status = 1 
   ORDER BY create_time DESC 
   LIMIT ? OFFSET ?;
   ```

3. **标记通知为已读**：
   ```sql
   UPDATE user_notification 
   SET is_read = 1, read_time = NOW() 
   WHERE id = ? AND user_id = ?;
   ```

4. **批量标记为已读**：
   ```sql
   UPDATE user_notification 
   SET is_read = 1, read_time = NOW() 
   WHERE user_id = ? AND is_read = 0;
   ```

### 扩展建议

如果需要更复杂的功能，可以考虑添加以下字段：

- `event_id`：关联的事件ID（如果通知关联具体事件）
- `action_url`：点击通知后的跳转链接
- `expire_time`：通知过期时间
- `sender_id`：发送者ID（如果是用户间通知）
- `related_id`：关联的业务ID（如审批单ID、任务ID等）

