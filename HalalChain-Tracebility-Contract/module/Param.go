/*
@author: lau
@email: laulucky@126.com
@date: 2018/2/7
 */
package module

type RegisterParam struct {
	ProductId	string		`json:"productId"`
	ProductName	string		`json:"productName"`
	InModule	string		`json:"inModule"`	// 入栏批次
	Kind		string		`json:"kind"`		// 种类
	Type		string		`json:"type"`		// 品种
	MapPosition	string		`json:"mapPosition"`	// 地理位置
	ISerial		string		`json:"iSerial"`	// 入栏终端编号
	IName		string		`json:"iName"`		// 入栏操作员
	Lairage		string		`json:"lairageTime"`	// 入栏时间
	Fattened	string		`json:"fattenedTime"`	// 出栏时间
	Days		string		`json:"days"`		// 生长天数
	Condition	string		`json:"condition"`	// 健康状况 0:良好，1...... 等讨论定义
	Comment		string		`json:"comment"`	// 具体行为
	PenNum		string		`json:"penNum"`		// 圈号
}

type ChangeOrgParam struct {
	ProductId	string `json:"productId"`
	ToOrgMsgId	string `json:"toOrgMsgId"`
}

type ComfirmChangeParam struct {
	ProductId string `json:"productId"`
}

type DestroyParam struct {
	ProductId string `json:"productId"`
	SerialNum string `json:"serialNum"`
}

type QueryParam struct {
	ProductId string `json:"productId"`
}

type QueryTxParam struct {
	TxId string `json:"txId"`
}

type QueryProductDetailParam struct {
	ProductId string `json:"productId"`
}
