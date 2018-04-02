package module

type RegisterParam struct {
	ProductId	string		`json:"productId"`
	ProductName	string		`json:"productName"`
	InModule	string		`json:"inModule"`
	Kind		string		`json:"kind"`
	Type		string		`json:"type"`
	MapPosition	string		`json:"mapPosition"`
	ISerial		string		`json:"iSerial"`
	IName		string		`json:"iName"`
	Lairage		string		`json:"lairageTime"`
	Fattened	string		`json:"fattenedTime"`
	Days		string		`json:"days"`
	Condition	string		`json:"condition"`
	Comment		string		`json:"comment"`
	PenNum		string		`json:"penNum"`
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
