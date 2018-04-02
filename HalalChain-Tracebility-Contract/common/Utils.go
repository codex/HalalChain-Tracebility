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
			name = strings.ToLower(fieldInfo.Name[0:1])+fieldInfo.Name[1:]
		}
		name = strings.Split(name, ",")[0]
		if value, ok := fields[name]; ok {
			if reflect.ValueOf(value).Type() == v.FieldByName(fieldInfo.Name).Type() {
				v.FieldByName(fieldInfo.Name).Set(reflect.ValueOf(value))
			}
		}
	}
	return nil
}
