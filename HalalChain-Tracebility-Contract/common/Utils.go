/*
@author: lau
@email: laulucky@126.com
@date: 2018/2/7
 */
package common

import (
	"strings"
	"reflect"
	"encoding/json"
)

func Json2map(str string) (s map[string]interface{}, err error) {
	var result map[string]interface{}
	if err := json.Unmarshal([]byte(str), &result); err != nil {
		return nil, err
	}
	return result, nil
}

func SetStructByJsonName(ptr interface{}, fields map[string]interface{}) error{
	v := reflect.ValueOf(ptr).Elem() // the struct variable
	for i := 0; i < v.NumField(); i++ {
		fieldInfo := v.Type().Field(i) // a reflect.StructField
		tag := fieldInfo.Tag           // a reflect.StructTag
		name := tag.Get("json")
		if name == "" {
			//无tag的情况，将field首字母变小写
			name = strings.ToLower(fieldInfo.Name[0:1])+fieldInfo.Name[1:]
		}
		//去掉逗号后面内容 如 `json:"txId,omitempty"`
		name = strings.Split(name, ",")[0]
		if value, ok := fields[name]; ok {
			//给结构体赋值
			//保证赋值时数据类型一致
			if reflect.ValueOf(value).Type() == v.FieldByName(fieldInfo.Name).Type() {
				v.FieldByName(fieldInfo.Name).Set(reflect.ValueOf(value))
			}
		}
	}
	return nil
}