package service

import (
	"hlccc/log"
	"hlccc/module"
	"hlccc/common"
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"fmt"
	"reflect"
	"errors"
)

func getMspid(stub shim.ChaincodeStubInterface) (mspid string) {
	createrbyte, err := stub.GetCreator()
	if err != nil {
		log.Logger.Error("shim getCreater error", err.Error())
		return ""
	}
	newbytes := []byte{}
	headFlg := true
	for i := 0; i < len(createrbyte); i++ {
		if createrbyte[i] >= 33 && createrbyte[i] <= 126 {
			headFlg = false
			newbytes = append(newbytes, createrbyte[i])
		}
		if createrbyte[i] < 33 || createrbyte[i] > 126 {
			if !headFlg {
				break
			}
		}
	}
	return string(newbytes)
}

func putTxId(stub shim.ChaincodeStubInterface, productId string, productOwner module.ProductOwner, txType string, txInfoAdd module.TxInfoAdd) error {
	jsonByte, err := stub.GetState(productId)
	if err != nil {
		log.Logger.Error("get product txList error", err.Error())
		return err
	}
	var txList []module.TxInfo
	if jsonByte != nil {
		err = json.Unmarshal(jsonByte, &txList)
		if err != nil {
			log.Logger.Error("Unmarshal product txList error", err.Error())
			return err
		}
	}

	txInfo := module.TxInfo{}
	txInfo.TxId = stub.GetTxID()
	txInfo.PreOwner = productOwner.PreOwner
	txInfo.CurrentOwner = productOwner.CurrentOwner
	txInfo.TxType = txType
	txInfo.Operation = txInfoAdd.Operation
	txInfo.MapPosition = txInfoAdd.MapPosition
	txInfo.Operator = txInfoAdd.Operator

	timestamp, err := stub.GetTxTimestamp()
	if err != nil {
		log.Logger.Error("get timestamp error", err.Error())
		return err
	}

	txInfo.TxTime = fmt.Sprintf("%d", timestamp.Seconds)
	txList = append(txList, txInfo)
	jsonByte, err = json.Marshal(txList)
	if err != nil {
		log.Logger.Error("Marshal prouct txList error", err.Error())
		return err
	}
	err = stub.PutState(productId, jsonByte)
	if err != nil {
		log.Logger.Error("update product txList error", err.Error())
		return err
	}
	return nil
}

func queryProductOwner(stub shim.ChaincodeStubInterface, productId string) (productOwner module.ProductOwner, err error) {
	jsonByte, err := stub.GetState(common.PRODUCT_OWNER + common.ULINE + productId)
	if err != nil {
		log.Logger.Error("get productOwner error", err.Error())
		return productOwner, err
	}
	err = json.Unmarshal(jsonByte, &productOwner)
	if err != nil {
		log.Logger.Error("Unmarshal productOwner error", err.Error())
		return productOwner, err
	}
	return productOwner, nil
}

func changeProductOwner(stub shim.ChaincodeStubInterface, before,after module.ProductOwner,productId string) (err error) {
	jsonByte, err := json.Marshal(after)
	if err != nil {
		log.Logger.Error("Marshal productOwner error",err.Error())
		return err
	}
	err = stub.PutState(common.PRODUCT_OWNER+common.ULINE+productId, jsonByte)
	if err != nil {
		log.Logger.Error("put productOwner error",err.Error())
		return err
	}
	var changeOwner = module.ChangeOwner{}
	changeOwner.Before = before
	changeOwner.After = after
	jsonByte, err = json.Marshal(changeOwner)
	if err != nil {
		log.Logger.Error("Marshal changeOwner error", err.Error())
		return err
	}
	err = stub.PutState(stub.GetTxID(), jsonByte)
	if err != nil {
		log.Logger.Error("put changeOwner error", err.Error())
		return err
	}
	return nil
}

func getProductInfo(stub shim.ChaincodeStubInterface, productId string) (productInfo module.ProductInfo, err error) {
	jsonByte, err := stub.GetState(common.PRODUCT_INFO + common.ULINE + productId)
	if err != nil {
		log.Logger.Error("get productInfo error", err.Error())
		return productInfo, err
	}
	if jsonByte == nil{
		return productInfo,errors.New("product is not exists")
	}
	err = json.Unmarshal(jsonByte, &productInfo)
	if err != nil {
		log.Logger.Error("Unmarshal productInfo error", err.Error())
		return productInfo, err
	}
	return productInfo, nil
}

func changeProductInfo(stub shim.ChaincodeStubInterface, param map[string]interface{}) (err error) {
	productId := reflect.ValueOf(param[common.PRODUCT_ID]).String()
	log.Logger.Info("productId:",productId)
	productInfo,err := getProductInfo(stub,productId)
	if err!= nil{
		return err
	}
	var changeProduct = module.ChangeProduct{}
	changeProduct.Before = productInfo
	common.SetStructByJsonName(&productInfo,param)
	changeProduct.After = productInfo
	jsonByte,err := json.Marshal(productInfo)
	if err != nil{
		log.Logger.Error("put productInfo error",err.Error())
		return err
	}
	err = stub.PutState(common.PRODUCT_INFO+common.ULINE+productId, jsonByte)
	if err != nil {
		return err
	}
	jsonByte, err = json.Marshal(changeProduct)
	if err != nil {
		log.Logger.Error("Marshal changeProduct error", err.Error())
		return err
	}
	err = stub.PutState(stub.GetTxID(), jsonByte)
	if err != nil {
		log.Logger.Error("put changeProduct error", err.Error())
		return err
	}
	return nil
}

