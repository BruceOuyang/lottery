package schema

// 用户库
type User struct {
	ID           int64  `xorm:"'id' unique autoincr index pk" json:"id,omitempty"`
	Name         string `xorm:"name" json:"name"`                   // 名称
	Avatar       string `xorm:"'avatar'" json:"avatar"`             // 头像
	RemoteAvatar string `xorm:"remote_avatar" json:"remote_avatar"` // 远程头像地址头像
	UUID         string `xorm:"'uuid'" json:"uuid,omitempty"`       // 唯一编码 用来标示唯一用户，便于接入第三方用户数据 字符串
	UID          int64  `xorm:"uid" json:"uid"`                     // 唯一编码 用来标示唯一用户 便于接入第三方用户数据 int64
	SourceID     int64  `xorm:"source_id" json:"source_id"`
	Ext          string `xorm:"'ext'" json:"ext,omitempty"`   // 扩展字段1
	Status       int    `xorm:"'status'" json:"status"`       // 是否已经中间
	Pool         string `xorm:"'pool'" json:"pool,omitempty"` // 用户池
	Weight       int    `xorm:"'weight'" json:"weight"`       // 排序权重
	CreatedAt    int64  `xorm:"created_at" json:"created_at"`
}

func (u User) TableName() string {
	return "user"
}
